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
    episodeNumber != 1 ? `${episodeNumber - 1}화 한줄 요약` : "소설 장르",
    `${episodeNumber}화까지 줄거리`,
    "인물 관계 설명",
    "주인공의 행적 설명",
  ];

  const [inputText, setInputText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatButtons, setShowChatButtons] = useState(true);
  const [stompClient, setStompClient] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);

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

    // 연결 타임아웃 설정 (5초)
    const connectionTimeout = setTimeout(() => {
      console.log("⚠️ WebSocket 연결 타임아웃 - 강제로 연결 실패 처리");
      setWsConnected(false);
      setStompClient(null);
    }, 5000);

    client.connect(
      {},
      () => {
        console.log("✅ 웹소켓 연결 성공");
        clearTimeout(connectionTimeout);
        setStompClient(client);
        setWsConnected(true);
      },
      (error) => {
        console.error("❌ 웹소켓 연결 실패", error);
        clearTimeout(connectionTimeout);
        setWsConnected(false);
        setStompClient(null);
      }
    );

    // 소켓 이벤트 리스너 추가
    socket.onclose = () => {
      console.log("🔌 WebSocket 연결 종료됨");
      setWsConnected(false);
      setStompClient(null);
    };

    socket.onerror = (error) => {
      console.error("🚨 WebSocket 에러:", error);
      setWsConnected(false);
      setStompClient(null);
    };

    return () => {
      clearTimeout(connectionTimeout);
      if (client && client.connected) {
        client.disconnect(() => {
          console.log("웹소켓 연결 종료");
          setStompClient(null);
          setWsConnected(false);
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
    setIsStreaming(true);

    try {
      let actualQueryId = null;
      let streamingComplete = false;
      let currentAIMessageIndex = null;

      // 화면에 유저 메시지 먼저 표시
      setChatHistory((prev) => [...prev, { role: "user", text: textToSend }]);

      // 1. POST 요청으로 queryId 받기
      const res = await instance.post(`/chatrooms/${chatId}/queries`, {
        queryContent: textToSend,
        chatId,
      });
      actualQueryId = res.data;

      // 2. 웹소켓 구독 설정 (스트리밍)
      console.log("WebSocket 상태 체크:", {
        wsConnected,
        stompClient: !!stompClient,
        connected: stompClient?.connected,
        actualQueryId
      });
      
      if (wsConnected && stompClient && stompClient.connected) {
        console.log(`WebSocket 구독 시작: /topic/query/${actualQueryId}`);
        
        const subscription = stompClient.subscribe(`/topic/query/${actualQueryId}`, (message) => {
          console.log("✅ 스트림 데이터 받음:", message);
          // console.log("메시지 내용:", message.body);
          
          try {
            const body = JSON.parse(message.body);
            console.log("파싱된 데이터:", body);
            
            // 스트리밍 완료 체크
            if (body.isComplete) {
              streamingComplete = true;
              setIsStreaming(false);
              console.log("🏁 스트리밍 완료 - 최종 답변:", body.message);

              // WebSocket으로 받은 최종 답변으로 업데이트
              setChatHistory((prev) => {
                const newHistory = [...prev];
                if (currentAIMessageIndex !== null && newHistory[currentAIMessageIndex]) {
                  newHistory[currentAIMessageIndex] = {
                    ...newHistory[currentAIMessageIndex],
                    text: body.message,
                    isStreaming: false
                  };
                }
                return newHistory;
              });

              subscription.unsubscribe();
              return;
            }

            // 메시지에서 실제 텍스트 추출
            const actualMessage = body.message || "";
            
            console.log("추출된 실제 메시지:", actualMessage);

            // 실제 AI 응답이 있는 경우에만 처리
            if (actualMessage && actualMessage.trim()) {
              // 스트리밍 데이터 처리
              setChatHistory((prev) => {
                const newHistory = [...prev];
                
                // 현재 AI 메시지 인덱스 찾기 또는 새 메시지 추가
                if (currentAIMessageIndex === null) {
                  // 첫 번째 스트림 청크 - 새 AI 메시지 추가
                  newHistory.push({ role: "ai", text: actualMessage, isStreaming: true });
                  currentAIMessageIndex = newHistory.length - 1;
                } else {
                  // 기존 AI 메시지에 텍스트 추가 (누적)
                  if (newHistory[currentAIMessageIndex]) {
                    newHistory[currentAIMessageIndex] = {
                      ...newHistory[currentAIMessageIndex],
                      text: body.isIncremental 
                        ? newHistory[currentAIMessageIndex].text + actualMessage
                        : actualMessage,
                    };
                  }
                }
                
                return newHistory;
              });
            }
          } catch (error) {
            console.error("메시지 파싱 에러:", error);
          }
        });

        // WebSocket 스트리밍 타임아웃 (60초 후) - 스트리밍이 너무 오래 걸릴 경우에만
        setTimeout(() => {
          if (!streamingComplete) {
            console.log("WebSocket 스트리밍 타임아웃 - 구독 해제");
            subscription.unsubscribe();
            setIsStreaming(false);
            // 스트리밍이 완료되지 않았지만 타임아웃으로 인해 종료
            setChatHistory((prev) => {
              const newHistory = [...prev];
              if (currentAIMessageIndex !== null && newHistory[currentAIMessageIndex]) {
                newHistory[currentAIMessageIndex] = {
                  ...newHistory[currentAIMessageIndex],
                  isStreaming: false
                };
              }
              return newHistory;
            });
          }
        }, 60000);
      } else {
        // 웹소켓이 연결되지 않은 경우 - 스트리밍 없이 일반 응답 대기
        console.log("WebSocket 연결되지 않음 - 일반 응답 대기 모드");
        setIsStreaming(false);
        
        // WebSocket이 연결되지 않았을 때는 polling 방식으로 답변 확인
        console.log("🔄 Polling 방식으로 답변 대기 시작");
        
        // 로딩 상태를 표시하기 위해 임시 AI 메시지 추가
        setChatHistory((prev) => [
          ...prev, 
          { role: "ai", text: "답변을 준비하고 있습니다...", isStreaming: true }
        ]);
        
        let pollCount = 0;
        const maxPolls = 60; // 60번 시도 (60초)
        let lastAnswerLength = 0;
        
        const pollForAnswer = async () => {
          try {
            const answerRes = await instance.get(
              `/chatrooms/${chatId}/queries/${actualQueryId}/answer`
            );
            const answer = answerRes.data.queryAnswer;
            
            if (answer && answer !== "처리중..." && answer.length > 0) {
              // 답변이 이전보다 길어졌거나 완전히 다른 답변인 경우 업데이트
              if (answer.length !== lastAnswerLength) {
                lastAnswerLength = answer.length;
                setChatHistory((prev) => {
                  const newHistory = [...prev];
                  // 마지막 AI 메시지 업데이트
                  if (newHistory.length > 0 && newHistory[newHistory.length - 1].role === "ai") {
                    newHistory[newHistory.length - 1] = {
                      role: "ai",
                      text: answer,
                      isStreaming: false
                    };
                  } else {
                    newHistory.push({ role: "ai", text: answer });
                  }
                  return newHistory;
                });
                
                // 완전한 답변을 받았으면 polling 중단
                if (answer.length > 100) { // 임의의 최소 길이로 완성도 판단
                  console.log("📝 완전한 답변 수신 완료");
                  setIsStreaming(false);
                  return;
                }
              }
            }
            
            pollCount++;
            if (pollCount < maxPolls) {
              setTimeout(pollForAnswer, 1000); // 1초 후 재시도
            } else {
              console.log("⏰ 응답 polling 타임아웃");
              setIsStreaming(false);
              // 타임아웃 시 에러 메시지 표시
              setChatHistory((prev) => {
                const newHistory = [...prev];
                if (newHistory.length > 0 && newHistory[newHistory.length - 1].role === "ai") {
                  newHistory[newHistory.length - 1] = {
                    role: "ai",
                    text: "답변 생성에 시간이 오래 걸리고 있습니다. 잠시 후 다시 시도해주세요.",
                    isStreaming: false
                  };
                }
                return newHistory;
              });
            }
          } catch (err) {
            console.error("답변 polling 실패:", err);
            pollCount++;
            if (pollCount < maxPolls) {
              setTimeout(pollForAnswer, 2000); // 에러 시 2초 후 재시도
            } else {
              setIsStreaming(false);
            }
          }
        };
        
        // 즉시 polling 시작
        setTimeout(pollForAnswer, 500);
      }
    } catch (err) {
      console.error("Query 전송 실패:", err);
      setIsStreaming(false);
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
            className={`chat-bubble ${
              item.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
            } ${item.isStreaming ? "streaming" : ""}`}
          >
            {item.text}
            {item.isStreaming && (
              <span className="streaming-cursor">▎</span>
            )}
          </div>
        ))}
        {isStreaming && chatHistory.length > 0 && !chatHistory[chatHistory.length - 1]?.isStreaming && (
          <div className="chat-bubble chat-bubble-ai streaming">
            <span className="streaming-dots">●●●</span>
          </div>
        )}
        <div ref={messagesEndRef} />
        {!isReadOnly && showChatButtons && (
          <div className="chat-buttons-wrapper">
            {chatButtons.map((text, index) => (
              <button
                className="chat-bubble-button"
                key={index}
                onClick={() => handleSend(text)}
                disabled={isStreaming}
              >
                {text}
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        className={`chat-input-bar ${
          isReadOnly ? "chat-input-bar--readonly" : ""
        }`}
      >
        {isReadOnly ? (
          <span className="chat-readonly-msg">
            소설 밖에서는 메시지 전송이 불가합니다.
          </span>
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
