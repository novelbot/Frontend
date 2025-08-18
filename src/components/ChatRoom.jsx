import { useState } from "react";
import bookmarkIcon from "../assets/bookmark.png";
import backIcon from "../assets/back.png";
import BlacksendIcon from "../assets/blacksend.png";
import "./ChatBearOverlay.css";

function ChatRoom({ novelId, chatTitle, onBack }) {
  const chatButtons = [
    "이전화 한줄 요약",
    "현재까지 줄거리",
    "인물 관계도",
    "주인공의 행적",
  ];

  const [inputText, setInputText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatButtons, setShowChatButtons] = useState(true);

  const handleSend = (forcedText) => {
    const textToSend = (forcedText ?? inputText).trim();
    if (!textToSend) return;

    setChatHistory((prev) => [...prev, { role: "user", text: textToSend }]);
    setInputText("");
    setShowChatButtons(false);

    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        { role: "ai", text: `"${textToSend}"에 대한 임시 답변입니다.` },
      ]);
    }, 500);
  };

  return (
    <div className="bear-overlay">
      <div className="bear-overlay-content">
        <div className="chat-header">
          <img
            src={backIcon}
            alt="back"
            className="chat-icon"
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
