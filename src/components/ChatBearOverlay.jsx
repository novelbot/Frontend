import { useState, useEffect } from "react";
import ChatList from "./ChatList";
import ChatRoom from "./ChatRoom";
import "./ChatBearOverlay.css";
import { instance } from "../API/api";

// 에피소드 ID 가져오기
export async function getEpisodeId(novelId, episodeNumber) {
  try {
    const res = await instance.get(`/novels/${novelId}/episodes`);
    const episodes = res.data;
    const targetEpisode = episodes.find(
      (episode) => episode.episodeNumber === episodeNumber
    );
    return targetEpisode ? targetEpisode.episodeId : null;
  } catch (error) {
    console.error("에피소드 조회 중 오류: ", error);
    return null;
  }
}

// 채팅방 생성
export async function createChatRoom(novelId, episodeId, chatTitle) {
  try {
    const res = await instance.post("/chatrooms", {
      novelId,
      episodeId,
      chatTitle,
    });
    return res.data;
  } catch (error) {
    console.error("채팅방 생성 실패:", error);
    return null;
  }
}

function ChatBearOverlay({ novelId, onClose, isViewer }) {
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

  // 채팅방 생성
  useEffect(() => {
    const initChatRoom = async () => {
      try {
        const episodeNumber = parseInt(
          localStorage.getItem("episodeNumber"),
          10
        );
        const storedNovelId = parseInt(localStorage.getItem("novelId"), 10);

        if (!episodeNumber || !storedNovelId) {
          // console.error(
          //   "localStorage에서 novelId 또는 episodeNumber를 찾을 수 없습니다."
          // );
          return;
        }

        const episodeId = await getEpisodeId(storedNovelId, episodeNumber);
        if (!episodeId) {
          console.error("episodeId를 찾을 수 없습니다.");
          return;
        }

        const newRoom = await createChatRoom(
          storedNovelId,
          episodeId,
          `${episodeNumber}화`
        );

        if (newRoom) {
          // console.log("생성된 채팅방:", newRoom);
          if (isViewer) {
            // isViewer면 바로 ChatRoom으로
            setChatId(newRoom);
            setChatTitle(`${episodeNumber}화`);
            setView("chat");
          }
        }
      } catch (err) {
        console.error("채팅방 생성 중 오류:", err);
      }
    };

    initChatRoom();
  }, [isViewer]);

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
          chatTitle={chatTitle}
          chatId={chatId}
          onBack={handleBackToList}
        />
      )}
    </>
  );
}

export default ChatBearOverlay;
