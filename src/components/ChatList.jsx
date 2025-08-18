import messageIcon from "../assets/message.png";
import SearchBar from "./SearchBar";
import "./ChatBearOverlay.css";
import { instance } from "../API/api";
import { useState, useEffect } from "react";

function ChatList({ novelId, onEnterChat }) {
  const [listItems, setListItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const res = await instance.get(`/chatrooms/novel/${novelId}`, {
          params: { novelId: novelId },
        });
        if (Array.isArray(res.data)) {
          const chats = res.data.map((item) => ({
            id: item.chatId, // 백엔드에서 오는 chatId
            title: item.chatTitle, // 백엔드에서 오는 chatTitle
          }));
          setListItems(chats);
        } else {
          setListItems([]);
        }
      } catch (error) {
        console.error("채팅 목록 불러오기 실패:", error);
        setListItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (novelId) {
      fetchChatList();
    }
  }, [novelId]); // novelId 바뀔 때마다 재호출

  if (loading) {
    return <div className="bear-overlay">로딩 중...</div>;
  }

  return (
    <div className="bear-overlay">
      <div className="bear-overlay-content">
        <h2 className="overlay-title">대화 목록</h2>
      </div>
      <div className="searchbar-box">
        <SearchBar placeholder="작품 검색" />
      </div>
      <div className="scrollable-work-list">
        {listItems.map((item) => (
          <div
            className="work-item"
            key={item.id}
            onClick={() => onEnterChat(item.id, item.title)} // 클릭 시 채팅방으로 전환
          >
            <img src={messageIcon} alt="message" className="folder-icon" />
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatList;
