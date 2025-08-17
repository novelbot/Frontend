import { useState } from "react";
import ChatList from "./ChatList";
import ChatRoom from "./ChatRoom";
import "./ChatBearOverlay.css";

function ChatBearOverlay({ novelId }) {
  const [view, setView] = useState("list"); // "list" | "chat"
  const [chatTitle, setChatTitle] = useState("대화 제목 어쩌고 ...");

  const handleEnterChat = (title) => {
    setChatTitle(title);
    setView("chat");
  };

  const handleBackToList = () => {
    setView("list");
  };

  return (
    <>
      {view === "list" ? (
        <ChatList novelId={novelId} onEnterChat={handleEnterChat} />
      ) : (
        <ChatRoom
          novelId={novelId}
          chatTitle={chatTitle}
          onBack={handleBackToList}
        />
      )}
    </>
  );
}

export default ChatBearOverlay;
