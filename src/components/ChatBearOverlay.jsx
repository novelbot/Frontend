import { useState } from "react";
import ChatList from "./ChatList";
import ChatRoom from "./ChatRoom";
import "./ChatBearOverlay.css";

function ChatBearOverlay({ novelId, onClose }) {
  const [view, setView] = useState("list"); // "list" | "chat"
  const [chatTitle, setChatTitle] = useState("새로운 채팅");
  const [chatId, setChatId] = useState(null);

  const handleEnterChat = (chatId, title) => {
    setChatTitle(title);
    setChatId(chatId);
    setView("chat");
  };

  const handleBackToList = () => {
    setView("list");
  };

  const handleBackToNovel = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {view === "list" ? (
        <ChatList
          novelId={novelId}
          onEnterChat={handleEnterChat}
          onBack={handleBackToNovel}
        />
      ) : (
        <ChatRoom
          novelId={novelId}
          chatTitle={chatTitle}
          chatId={chatId}
          onBack={handleBackToList}
        />
      )}
    </>
  );
}

export default ChatBearOverlay;
