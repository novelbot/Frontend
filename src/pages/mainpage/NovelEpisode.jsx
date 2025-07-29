// NovelEpisode.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import "./NovelEpisode.css";
import downIcon from "/src/assets/down.png";
import { dummyEpisodes } from "/src/data/episodeData";

const EPISODES_PER_BATCH = 4;

function NovelEpisodeList({ episodes }) {
  return (
    <div className="episode-list">
      {episodes.map((episode) => (
        <div className="episode-card" key={episode.id + "-" + episode.number}>
          <img src={episode.thumbnail} alt="썸네일" />
          <div className="episode-info">
            <p className="episode-date">{episode.date}</p>
            <p className="episode-title-text">{episode.title}</p>
          </div>
          <div className="episode-meta">
            <span>{episode.number}화</span>
<Link to={`/viewer/${episode.id}/${episode.number}`}>
  <button className="free-badge">무료</button>
</Link>

          </div>
        </div>
      ))}
    </div>
  );
}

const NovelEpisode = ({ novel }) => {
  if (!novel) return <div>오류 발생</div>;
  const { title } = novel;
  const [sortOrder, setSortOrder] = useState("asc");
  const [visibleCount, setVisibleCount] = useState(EPISODES_PER_BATCH);

  const sortedEpisodes = [...dummyEpisodes].sort((a, b) =>
    sortOrder === "asc" ? a.number - b.number : b.number - a.number
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
      <h2 className="episode-title">{title}</h2>

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

      <p className="episode-count">전체 {dummyEpisodes.length}</p>

      <NovelEpisodeList episodes={visibleEpisodes} />

      {visibleCount < dummyEpisodes.length && (
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
