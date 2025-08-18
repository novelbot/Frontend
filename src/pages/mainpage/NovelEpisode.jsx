// NovelEpisode.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./NovelEpisode.css";
import downIcon from "/src/assets/down.png";
import { instance } from "/src/API/api";

const EPISODES_PER_BATCH = 4;

function NovelEpisodeList({ episodes, novel }) {
  return (
    <div className="episode-list">
      {episodes.map((episode, index) => (
        <div
          className="episode-card"
          key={episode.episodeId ?? `${episode.novelId}-${index}`}
        >
          {/* 모든 에피소드에 소설 전체 coverImageUrl 표시 */}
          <img src={novel.coverImageUrl} alt={`${novel.title} 표지`} />

          <div className="episode-info">
            <p className="episode-date">{episode.publicationDate}</p>
            <p className="episode-title-text">{episode.episodeTitle}</p>
          </div>
          <div className="episode-meta">
            <span>{episode.episodeNumber}화</span>
            <Link to={`/viewer/${episode.novelId}/${episode.episodeNumber}`}>
              <button className="free-badge">무료</button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

const NovelEpisode = ({ novel }) => {
  const [episodes, setEpisodes] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [visibleCount, setVisibleCount] = useState(EPISODES_PER_BATCH);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const res = await instance.get(`/novels/${novel.novelId}/episodes`);
        setEpisodes(res.data);
      } catch (error) {
        console.error("에피소드 불러오기 실패:", error);
      }
    };

    if (novel?.novelId) {
      fetchEpisodes();
    }
  }, [novel?.novelId]);

  if (!novel) return <div>오류 발생</div>;

  const sortedEpisodes = [...episodes].sort((a, b) =>
    sortOrder === "asc"
      ? a.episodeNumber - b.episodeNumber
      : b.episodeNumber - a.episodeNumber
  );
  const visibleEpisodes = sortedEpisodes.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + EPISODES_PER_BATCH);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    setVisibleCount(EPISODES_PER_BATCH);
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

      <NovelEpisodeList episodes={visibleEpisodes} novel={novel} />

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
