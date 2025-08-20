import { useState, useEffect, useRef } from "react";
import { useNavigate, useMatch } from "react-router-dom";
import { instance } from "../API/api";
import SockJS from "sockjs-client";
import { over } from "stompjs";

import bookmarkIcon from "../assets/bookmark.png";
import backIcon from "../assets/back.png";
import BlacksendIcon from "../assets/blacksend.png";
import bookOpenIcon from "../assets/book-open.png";
import "./ChatBearOverlay.css";
import "./ChatRoom.css";

function ChatRoom({ chatTitle, chatId, onBack, novelId, episodeNumber }) {
  const chatButtons = [
    "이전화 한줄 요약",
    "현재까지 줄거리",
    "인물 관계도",
    "주인공의 행적",
  ];

  const [inputText, setInputText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatButtons, setShowChatButtons] = useState(true);
  const [stompClient, setStompClient] = useState(null);

  const isViewerPath = !!useMatch("/viewer/*");
  const isReadOnly = !isViewerPath;

  // 인터셉터 등록 (한 번만)
  useEffect(() => {
    const interceptor = instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      // 컴포넌트 언마운트 시 인터셉터 제거
      instance.interceptors.request.eject(interceptor);
    };
  }, []);

  // chatId로 쿼리 기록 가져오기
  useEffect(() => {
    if (!chatId) return;

    const fetchQueries = async () => {
      try {
        const res = await instance.get(`/chatrooms/${chatId}/queries`, {
          params: { chatId: chatId },
        });
        if (Array.isArray(res.data)) {
          const sorted = [...res.data].sort(
            (a, b) => a.queryId - b.queryId // 오래된 순
            // (a, b) => b.queryId - a.queryId // 최신 순
          );
          const history = [];

          res.data.forEach((item) => {
            // queryContent → 유저 말풍선
            if (item.queryContent) {
              history.push({ role: "user", text: item.queryContent });
            }
            // queryAnswer → AI 말풍선
            if (item.queryAnswer) {
              history.push({ role: "ai", text: item.queryAnswer });
            }
          });

          setChatHistory(history);
        }
      } catch (err) {
        console.error("채팅 불러오기 실패:", err);
      }
    };

    fetchQueries();
  }, [chatId]);

  // 웹소켓 연결
  useEffect(() => {
    const socket = new SockJS("https://api.novelbot.org/ws"); // 배포 주소
    const client = over(socket);

    console.log("웹소켓 연결 시도");

    client.connect(
      {},
      () => {
        console.log("웹소켓 연결 성공");
        setStompClient(client);
      },
      (error) => {
        console.error("웹소켓 연결 실패", error);
      }
    );

    return () => {
      if (client && client.connected) {
        client.disconnect(() => {
          console.log("웹소켓 연결 종료");
          setStompClient(null);
        });
      }
    };
  }, []);

  // 메시지 전송 함수
  const handleSend = async (forcedText) => {
    const textToSend = (forcedText ?? inputText).trim();
    if (!textToSend || isReadOnly) return;
    setShowChatButtons(false);
    setInputText("");

    try {
      // 임시 queryId 생성 (서버에서 실제 ID를 받을 때까지)
      const tempQueryId = Date.now();
      let actualQueryId = null;
      let received = false;

      // 1. 먼저 웹소켓 구독 설정
      if (stompClient && stompClient.connected) {
        const sub = stompClient.subscribe(
          `/topic/query/${tempQueryId}`, // 임시로 구독
          (message) => {
            received = true;
            console.log("답변 받음:", message.body);
            const body = JSON.parse(message.body);
            setChatHistory((prev) => [
              ...prev,
              { role: "ai", text: body.message },
            ]);
            sub.unsubscribe();
          }
        );

        // 2. POST 요청으로 queryId 받기
        const res = await instance.post(`/chatrooms/${chatId}/queries`, {
          queryContent: textToSend,
          chatId,
        });
        actualQueryId = res.data;

        // 3. 실제 queryId로 구독 재설정
        sub.unsubscribe();
        stompClient.subscribe(`/topic/query/${actualQueryId}`, (message) => {
          received = true;
          console.log("답변 받음:", message.body);
          const body = JSON.parse(message.body);
          setChatHistory((prev) => [
            ...prev,
            { role: "ai", text: body.message },
          ]);
        });
      } else {
        // 웹소켓이 연결되지 않은 경우에만 POST
        const res = await instance.post(`/chatrooms/${chatId}/queries`, {
          queryContent: textToSend,
          chatId,
        });
        actualQueryId = res.data;
      }

      // 화면에 유저 메시지 표시
      setChatHistory((prev) => [...prev, { role: "user", text: textToSend }]);

      // 타임아웃 fallback (10초 후)
      setTimeout(async () => {
        if (!received && actualQueryId) {
          try {
            const answerRes = await instance.get(
              `/chatrooms/${chatId}/queries/${actualQueryId}/answer`
            );
            const answer = answerRes.data.queryAnswer;
            if (answer && answer !== "처리중...") {
              setChatHistory((prev) => [...prev, { role: "ai", text: answer }]);
            }
          } catch (err) {
            console.error("Fallback 답변 조회 실패:", err);
          }
        }
      }, 10000);
    } catch (err) {
      console.error("Query 전송 실패:", err);
    }
  };

  // 에피 이동용 변수 (채팅방 생성된 에피소드로 이동함)
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  // 클릭 시 이동 함수
  const handleClick = () => {
    navigate(`/viewer/${novelId}/${episodeNumber}`);
  };

  // 스크롤 제일 밑에서 시작하기
  const messagesEndRef = useRef(null);
  // 컴포넌트 처음 로드 + chatHistory 변경될 때 스크롤 유지
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [chatHistory]); // chatHistory가 바뀔 때마다 맨 밑으로 이동

  return (
    <div className="bear-overlay">
      <div className="bear-overlay-content">
        <div className="chat-header">
          <img
            src={backIcon}
            alt="back"
            className="back-icon"
            onClick={onBack}
            style={{ cursor: "pointer" }}
          />
          <span className="chat-title">{chatTitle}</span>
          <div className="book-icon">
            <img
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleClick}
              src={isHovered ? bookOpenIcon : bookmarkIcon}
              alt="bookmark"
              className="chat-icon"
            />
            <div className={`bear-tooltip ${isHovered ? "" : "disabled"}`}>
              해당 에피소드로 이동할 수 있어요!
            </div>
          </div>
        </div>
      </div>

      <div className="chat-content">
        {chatHistory.map((item, index) => (
          <div
            key={index}
            className={`chat-bubble ${item.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
              }`}
          >
            {item.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
{!isReadOnly && showChatButtons && (
          <div className="chat-buttons-wrapper">
            {chatButtons.map((text, index) => (
              <button
                className="chat-bubble-button"
                key={index}
                onClick={() => handleSend(text)}
              >
                {text}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={`chat-input-bar ${isReadOnly ? "chat-input-bar--readonly" : ""}`}>
        {isReadOnly ? (
          <span className="chat-readonly-msg">소설 밖에서는 메시지 전송이 불가합니다.</span>
        ) : (
          <>
            <input
              type="text"
              placeholder={`이 대화는 ${chatTitle}까지의 내용을 중심으로 진행됩니다.`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.isComposing || e.nativeEvent.isComposing) return;
                if (e.key === "Enter") handleSend();
              }}
            />
            <button className="chat-send-btn" onClick={() => handleSend()}>
              <img src={BlacksendIcon} alt="send" className="send-icon" />
            </button>
          </>
        )}
      </div>

    </div>
  );
}

export default ChatRoom;
