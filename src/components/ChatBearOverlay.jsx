import { useState } from 'react';
import './ChatBearOverlay.css';
import bookmarkIcon from '../assets/bookmark.png';
import backIcon from '../assets/back.png';
import WhitesendIcon from '../assets/whitesend.png';
import BlacksendIcon from '../assets/blacksend.png';
import messageIcon from '../assets/message.png';
import SearchBar from './SearchBar';

function ChatBearOverlay() {
  const [view, setView] = useState('chat'); // 'chat' 또는 'list'

  const chatButtons = [
    '이전화 한줄 요약',
    '현재까지 줄거리',
    '인물 관계도',
    '기본 질문 4',
    '질문'
  ];

  const listItems = [
    '3화 줄거리 요약',
    '질문1',
    '질문2',
    '질문3',
    '질문4',
    '질문5',
    '질문6',
    '질문7',
     '질문1',
    '질문2',
    '질문3',
    '질문4',
    '질문5',
    '질문6',
    '질문7',
  ];

  const handleChatButtonClick = (text) => {
    console.log(`버튼 클릭됨: ${text}`);
  };

  // ▼▼▼ ListBearOverlay JSX ▼▼▼
  const renderListOverlay = () => (
    <div className="bear-overlay">
      <div className="bear-overlay-content">
        <h2 className="overlay-title">대화 목록</h2>
      </div>
      <div className="searchbar-box">
        <SearchBar placeholder="작품 검색" />
      </div>
      <div className="scrollable-work-list">
        {listItems.map((title, index) => (
          <div className="work-item" key={index}>
            <img src={messageIcon} alt="message" className="folder-icon" />
            <span>{title}</span>
          </div>
        ))}
      </div>
      <div className="message-button-area">
        <button className="message-button" onClick={() => setView('chat')}>
          <img src={messageIcon} alt="message" className="message-icon" />
        </button>
      </div>
    </div>
  );

  // ▼▼▼ ChatBearOverlay JSX ▼▼▼
  const renderChatOverlay = () => (
    <div className="bear-overlay">
      <div className="bear-overlay-content">
        <div className="chat-header">
          <img
            src={backIcon}
            alt="back"
            className="chat-icon"
            onClick={() => setView('list')}
            style={{ cursor: 'pointer' }}
          />
          <span className="chat-title">대화 제목 어쩌고 ...</span>
          <img src={bookmarkIcon} alt="bookmark" className="chat-icon" />
        </div>
      </div>

      <div className="chat-content">
        {chatButtons.map((text, index) => (
          <button
            className="chat-bubble-button"
            key={index}
            onClick={() => handleChatButtonClick(text)}
          >
            {text}
          </button>
        ))}
      </div>

      <div className="chat-input-bar">
        <input type="text" placeholder="무엇이든 물어보세요" />
        <button className="chat-send-btn">
          <img src={BlacksendIcon} alt="send" className="send-icon" />
        </button>
      </div>
    </div>
  );

  return view === 'chat' ? renderChatOverlay() : renderListOverlay();
}

export default ChatBearOverlay;
