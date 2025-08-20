import { useState, useEffect } from "react";
import { instance } from "../API/api";
import SockJS from "sockjs-client";
import { over } from "stompjs";

import bookmarkIcon from "../assets/bookmark.png";
import backIcon from "../assets/back.png";
import BlacksendIcon from "../assets/blacksend.png";
import "./ChatBearOverlay.css";

function ChatRoom({ chatTitle, chatId, onBack }) {
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
    if (!textToSend) return;
    setShowChatButtons(false);
    setInputText("");

    try {
      // queryId 받기
      const res = await instance.post(`/chatrooms/${chatId}/queries`, {
        queryContent: textToSend,
        chatId,
      });
      const queryId = res.data;

      // 화면에 유저 메시지 표시
      setChatHistory((prev) => [...prev, { role: "user", text: textToSend }]);

      // WebSocket 구독 -> AI 답변 받기
      let received = false; // 메시지 수신 여부 확인
      if (stompClient && stompClient.connected) {
        const sub = stompClient.subscribe(
          `/topic/query/${queryId}`,
          (message) => {
            received = true;
            console.log("답변 받음:", message.body);
            const body = JSON.parse(message.body);
            setChatHistory((prev) => [
              ...prev,
              { role: "ai", text: body.queryAnswer },
            ]);
            sub.unsubscribe();
          }
          // { id: `${queryId}` } // id를 부여
        );
      }

      // 일정 시간 후 REST GET으로 답변 가져오기 (임시)
      console.log(received);
      // setTimeout(async () => {
      //   if (!received) {
      //     try {
      //       const answerRes = await instance.get(
      //         `/chatrooms/${chatId}/queries/${queryId}/answer`
      //       );
      //       const answer = answerRes.data.queryAnswer;
      //       if (answer) {
      //         setChatHistory((prev) => [...prev, { role: "ai", text: answer }]);
      //       }
      //     } catch (err) {
      //       console.error("Fallback 답변 조회 실패:", err);
      //     }
      //   }
      // }, 3000); // 3초 후 fallback
    } catch (err) {
      console.error("Query 전송 실패:", err);
    }
  };

  // const handleSend = async (forcedText) => {
  //   const textToSend = (forcedText ?? inputText).trim();
  //   if (!textToSend) return;

  //   setShowChatButtons(false);
  //   try {
  //     // 질문 POST
  //     const res = await instance.post(`/chatrooms/${chatId}/queries`, {
  //       queryContent: textToSend,
  //       chatId: chatId,
  //     });

  //     const queryId = res.data.queryId; // 서버에서 넘겨주는 queryId
  //     console.log(queryId);
  //     // 화면에 user 메시지 추가
  //     setChatHistory((prev) => [...prev, { role: "user", text: textToSend }]);
  //     setInputText("");

  //     // 답변 GET
  //     const answerRes = await instance.get(
  //       `/chatrooms/${chatId}/queries/${queryId}/answer`
  //     );
  //     const answer = answerRes.data.queryAnswer;
  //     setMessages((prev) => [...prev, { role: "ai", text: answer }]);
  //   } catch (err) {
  //     console.error("Query 전송/응답 실패:", err);
  //   }
  // };

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
          <img src={bookmarkIcon} alt="bookmark" className="chat-icon" />
        </div>
      </div>

      <div className="chat-content">
        {chatHistory.map((item, index) => (
          <div
            key={index}
            className={`chat-bubble ${
              item.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
            }`}
          >
            {item.text}
          </div>
        ))}

        {showChatButtons && (
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

      <div className="chat-input-bar">
        <input
          type="text"
          placeholder="무엇이든 물어보세요"
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
      </div>
    </div>
  );
}

export default ChatRoom;
