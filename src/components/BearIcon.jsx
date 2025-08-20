import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./BearIcon.css";
import bearDown from "../assets/bear_down.png";
import bearUp from "../assets/bear_up.png";
import BearOverlay from "./BearOverlay";
import ChatBearOverlay from "./ChatBearOverlay";

function BearIcon({ isOpen, setIsOpen }) {
  const location = useLocation();
  const isViewerPage = location.pathname.startsWith("/viewer/");

  const [overlayType, setOverlayType] = useState("bear"); // "bear" | "chat"
  const [selectedNovelId, setSelectedNovelId] = useState(null);

  const toggleOverlay = () => {
    if (isOpen) {
      // 닫을 때 초기화
      setOverlayType("bear");
      setSelectedNovelId(null);
      setIsOpen(false);
    } else {
      // 열 때 로그인 여부 확인
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인 후 이용할 수 있습니다.");
        return;
      }
      setIsOpen(true);
    }
  };

  const openChatOverlay = (novelId) => {
    setSelectedNovelId(novelId);
    setOverlayType("chat");
  };

  return (
    <>
      <div className="bear-icon" onClick={toggleOverlay}>
        <img src={isOpen ? bearUp : bearDown} alt="bear" />

        {/* 오버레이 닫혀있을 때만 말풍선 표시 (viewer 페이지는 제외) */}
        {!isViewerPage && !localStorage.getItem("token") && (
          <div className={`bear-tooltip ${isOpen ? "disabled" : ""}`}>
            회원가입 후 곰과 대화해 보세요!
          </div>
        )}
      </div>

      {/* 오버레이 열렸을 때 컴포넌트 분기 */}
      {isOpen &&
        (isViewerPage ? (
          <ChatBearOverlay
            novelId={selectedNovelId}
            onClose={toggleOverlay}
            isViewer={isViewerPage}
          />
        ) : overlayType === "chat" ? (
          <ChatBearOverlay
            novelId={selectedNovelId}
            onClose={toggleOverlay}
            isViewer={isViewerPage}
          />
        ) : (
          <BearOverlay
            onClose={toggleOverlay}
            onSelectNovel={openChatOverlay}
          />
        ))}
    </>
  );
}

export default BearIcon;
