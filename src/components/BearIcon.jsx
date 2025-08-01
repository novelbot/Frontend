import { useState } from 'react';
import { useLocation } from 'react-router-dom';  // 추가
import './BearIcon.css';
import bearDown from '../assets/bear_down.png';
import bearUp from '../assets/bear_up.png';
import BearOverlay from './BearOverlay';
import ChatBearOverlay from './ChatBearOverlay';  // Chat 전용 오버레이

function BearIcon({isOpen,setIsOpen}) {

  const location = useLocation(); // 현재 경로 가져오기
  const isViewerPage = location.pathname.startsWith('/viewer/');

  const toggleOverlay = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <>
      <div className="bear-icon" onClick={toggleOverlay}>
        <img src={isOpen ? bearUp : bearDown} alt="bear" />

        {/* 오버레이 닫혀있을 때만 말풍선 표시 (viewer 페이지는 제외) */}
        {!isViewerPage && (
          <div className={`bear-tooltip ${isOpen ? 'disabled' : ''}`}>
            회원가입 후 곰과 대화해 보세요!
          </div>
        )}
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
