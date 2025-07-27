import { useState } from "react";
import "./NovelEpisode.css";
import downIcon from "../assets/down.png";
import { dummyEpisodes } from "../data/episodeData";

const EPISODES_PER_BATCH = 4;

// NovelEpisode.jsx (또는 에피소드 목록 컴포넌트)
function NovelEpisodeList({ episodes, onSelectEpisode }) {
  return (
    <div className="episode-list">
      {episodes.map((episode) => (
        <div
          className="episode-card"
          key={episode.id + "-" + episode.number}
          onClick={() => onSelectEpisode(episode)}
        >
          <img src={episode.thumbnail} alt="썸네일" />
          <div className="episode-info">
            <p className="episode-date">{episode.date}</p>
            <p className="episode-title-text">{episode.title}</p>
          </div>
          <div className="episode-meta">
            <span>{episode.number}화</span>
            <button className="free-badge">무료</button>
          </div>
        </div>
      ))}
    </div>
  );
}

const NovelEpisode = ({ novel, handleEpisodeClick }) => {
  if (!novel) return <div>오류 발생</div>;
  const { novelId, title, author, description, genre, coverImageUrl } = novel;
  const [sortOrder, setSortOrder] = useState("asc"); // 정렬 기준: asc 또는 desc
  const [visibleCount, setVisibleCount] = useState(EPISODES_PER_BATCH); // 현재 보여줄 에피소드 수

  // 정렬된 에피소드 배열 생성
  const sortedEpisodes = [...dummyEpisodes].sort((a, b) =>
    sortOrder === "asc" ? a.number - b.number : b.number - a.number
  );

  // 화면에 보여줄 에피소드만 추출
  const visibleEpisodes = sortedEpisodes.slice(0, visibleCount);

  // 더보기 버튼 클릭 시 에피소드 수 증가
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + EPISODES_PER_BATCH);
  };

  // 정렬 버튼 클릭 시 기준 변경 및 목록 초기화
  const handleSortChange = (order) => {
    setSortOrder(order);
    setVisibleCount(EPISODES_PER_BATCH);
  };

  return (
    <div className="novel-episode">
      <h2 className="episode-title">{title}</h2>

      {/* 정렬 버튼: 첫화부터 / 최신화부터 */}
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

      {/* 전체 에피소드 수 표시 */}
      <p className="episode-count">전체 {dummyEpisodes.length}</p>

      {/* 에피소드 카드 목록 */}
      <NovelEpisodeList
        episodes={visibleEpisodes}
        onSelectEpisode={(episode) => {
          // 여기서 App으로부터 넘겨받은 핸들러 호출 (props로 받아야 함)
          if (typeof handleEpisodeClick === "function") {
            handleEpisodeClick(episode);
          }
        }}
      />

      {/* 더보기 버튼: 아직 보여줄 에피소드가 남았을 경우에만 표시 */}
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
