import { useState } from "react";
import "./BearIcon.css";
import bearDown from "../assets/bear_down.png"; // 기본 상태의 곰 이미지
import bearUp from "../assets/bear_up.png"; // 클릭 후 활성화 상태 곰 이미지
import BearOverlay from "./BearOverlay"; // 오버레이 컴포넌트

function BearIcon({ isOpen, setIsOpen }) {
  // const [isOpen, setIsOpen] = useState(false); // 오버레이 열림 여부 상태

  const toggleOverlay = () => {
    setIsOpen((prev) => !prev); // 클릭 시 상태 토글
  };

  return (
    <>
      <div className="bear-icon" onClick={toggleOverlay}>
        <img src={isOpen ? bearUp : bearDown} alt="bear" />
        {/* 오버레이가 닫혀있을 때만 말풍선 표시 */}
        <div className={`bear-tooltip ${isOpen ? "disabled" : ""}`}>
          회원가입 후 곰과 대화해 보세요!
        </div>
      </div>

      {/* 오버레이 열렸을 때 컴포넌트 분기 */}
      {isOpen && (
        isViewerPage ? (
          <ChatBearOverlay onClose={toggleOverlay} />
        ) : (
          <BearOverlay onClose={toggleOverlay} />
        )
      )}
    </>
  );
}

export default BearIcon;
