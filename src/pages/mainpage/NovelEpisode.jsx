// NovelEpisode.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NovelEpisode.css";
import downIcon from "/src/assets/down.png";
import { instance } from "/src/API/api";

const EPISODES_PER_BATCH = 4;

// 토큰을 안전하게 읽어오는 유틸
const getStoredToken = () => {
  const raw =
    localStorage.getItem("accessToken") ??
    localStorage.getItem("token") ??
    sessionStorage.getItem("accessToken") ??
    sessionStorage.getItem("token");

  // 'Bearer '로 저장되어 있으면 제거
  return raw?.replace(/^Bearer\s+/i, "") ?? null;
};

function NovelEpisodeList({
  episodes,
  novel,
  onPurchase,
  purchasingId,
  purchasedEpisodes,
}) {
  return (
    <div className="episode-list">
      {episodes.map((episode, index) => {
        const isPurchased = purchasedEpisodes.includes(episode.episodeId);
        return (
          <div
            className="episode-card"
            key={episode.episodeId ?? `${episode.novelId}-${index}`}
          >
            {novel.coverImageUrl && (
              <img src={novel.coverImageUrl} alt={`${novel.title} 표지`} />
            )}


            <div className="episode-info">
              <p className="episode-date">{episode.publicationDate}</p>
              <p className="episode-title-text">{episode.episodeTitle}</p>
            </div>

            <div className="episode-meta">
              <span>{episode.episodeNumber}화</span>
              <button
                className="free-badge"
                onClick={() => onPurchase(episode)}
                disabled={purchasingId === episode.episodeId}
                style={{
                  backgroundColor: isPurchased ? "#EEEEEE" : "#FFFFFF",
                  color: "#000",
                  border: "1px solid #ccc",
                }}
              >
                {purchasingId === episode.episodeId
                  ? "처리 중..."
                  : isPurchased
                    ? "구매완료"
                    : "무료"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const NovelEpisode = ({ novel }) => {
  const [episodes, setEpisodes] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [visibleCount, setVisibleCount] = useState(EPISODES_PER_BATCH);
  const [purchasingId, setPurchasingId] = useState(null);
  const [purchasedEpisodes, setPurchasedEpisodes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const res = await instance.get(`/novels/${novel.novelId}/episodes`);
        setEpisodes(res.data);
      } catch (error) {
        console.error("에피소드 불러오기 실패:", error);
      }
    };

    if (novel?.novelId) fetchEpisodes();
  }, [novel?.novelId]);

  if (!novel) return <div>오류 발생</div>;

  const sortedEpisodes = [...episodes].sort((a, b) =>
    sortOrder === "asc"
      ? a.episodeNumber - b.episodeNumber
      : b.episodeNumber - a.episodeNumber
  );
  const visibleEpisodes = sortedEpisodes.slice(0, visibleCount);

  const handleLoadMore = () =>
    setVisibleCount((prev) => prev + EPISODES_PER_BATCH);

  const handleSortChange = (order) => {
    setSortOrder(order);
    setVisibleCount(EPISODES_PER_BATCH);
  };

  const handlePurchase = async (episode) => {
    try {
      setPurchasingId(episode.episodeId);

      const token = getStoredToken();
      console.log("accessToken:", token);

      if (!token) {
        alert("인증 정보가 없습니다. 로그인 후 다시 시도해 주세요.");
        return;
      }

      await instance.post(
        "/purchase",
        {
          episodeId: episode.episodeId,
          novelId: episode.novelId,
          ispurchased: true,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPurchasedEpisodes((prev) => [...prev, episode.episodeId]);
      navigate(`/viewer/${episode.novelId}/${episode.episodeNumber}`);
    } catch (err) {
      const status = err?.response?.status;

      if (status === 409) {
        setPurchasedEpisodes((prev) => [...prev, episode.episodeId]);
        navigate(`/viewer/${episode.novelId}/${episode.episodeNumber}`);
        return;
      }
      if (status === 401) {
        alert("인증이 필요합니다. 로그인 후 다시 시도해 주세요.");
      } else if (status === 404) {
        alert("에피소드를 찾을 수 없습니다.");
      } else if (status === 400) {
        alert("잘못된 요청입니다. 잠시 후 다시 시도해 주세요.");
      } else {
        alert("구매 처리 중 오류가 발생했습니다.");
      }
      console.error("구매 실패:", err);
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <div className="novel-episode">
      <h2 className="episode-title">{novel.title}</h2>

      <div className="episode-controls">
        <button
          className={`sort-button ${sortOrder === "asc" ? "active" : ""}`}
          onClick={() => handleSortChange("asc")}
        >
          첫화부터
        </button>
        <button
          className={`sort-button ${sortOrder === "desc" ? "active" : ""}`}
          onClick={() => handleSortChange("desc")}
        >
          최신화부터
        </button>
      </div>

      <p className="episode-count">전체 {episodes.length}화</p>

      <NovelEpisodeList
        episodes={visibleEpisodes}
        novel={novel}
        onPurchase={handlePurchase}
        purchasingId={purchasingId}
        purchasedEpisodes={purchasedEpisodes}
      />

      {visibleCount < episodes.length && (
        <div className="load-more-wrapper">
          <button className="load-more" onClick={handleLoadMore}>
            <img src={downIcon} alt="더 보기" className="load-more-icon" />
          </button>
        </div>
      )}
    </div>
  );
};

export default NovelEpisode;
