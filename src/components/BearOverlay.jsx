import { useEffect, useState } from "react";
import { instance } from "../API/api";
import "./BearOverlay.css";
import ChatSearchBar from "./ChatSearchBar";
import folderIcon from "../assets/folder.png"; // 작품 아이템에 사용할 폴더 아이콘
import ChatBearOverlay from "./ChatBearOverlay";

function BearOverlay({ onSelectNovel }) {
  const [novelsChat, setNovelsChat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNovelId, setSelectedNovelId] = useState(null);

  // 검색 결과 상태
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchResults = (results) => {
    setSearchResults(results);
    // console.log("검색 결과:", results);
    // 여기서 상태 저장해서 리스트 렌더링하면 됨
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

  // 소설 목록 fetch
  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const res = await instance.get("/chatrooms/novels");
        setNovelsChat(Array.isArray(res.data) ? res.data : []);
        // console.log(res.data);
      } catch (error) {
        console.error("소설 목록 불러오기 실패:", error);
        setNovelsChat([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNovels();
  }, []);

  if (selectedNovelId) {
    return (
      <ChatBearOverlay
        novelId={selectedNovelId}
        onClose={() => setSelectedNovelId(null)}
      />
    );
  }

  if (loading) {
    return <div>로딩 중...</div>;
  }

  const displayList = searchResults.length > 0 ? searchResults : novelsChat;

  return (
    <div className="bear-overlay">
      <div className="bear-overlay-content">
        <h2 className="overlay-title">작품 목록</h2>
      </div>

      <div className="searchbar-box">
        <ChatSearchBar
          placeholder="작품 검색"
          onResults={handleSearchResults}
        />
      </div>

      <div className="scrollable-work-list">
        {displayList.map((novel) => (
          <div
            className="work-item"
            key={novel.novelId}
            onClick={() => onSelectNovel(novel.novelId)}
          >
            <img src={folderIcon} alt="folder" className="folder-icon" />
            <span>{novel.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BearOverlay;
