import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ViewerControlBar.css";
import { dummyEpisodes } from "/src/data/episodeData";
import { novels } from "/src/data/novelData";

function ViewerControlBar({ title, pageIndex, setPageIndex }) {
  const navigate = useNavigate();
  const { id, number } = useParams(); // id: novelId, number: episodeNumber

  const currentNumber = parseInt(number, 10);
  const novelId = Number(id);

  const novel = novels.find((n) => n.novelId === novelId);
  const slug = novel?.title?.replace(/\s+/g, "");

  const goBackToDetail = () => {
    if (slug) {
      navigate(`/MainPage/${slug}`);
    }
  };

  const goToEpisode = (episodeNumber) => {
    setPageIndex(0);
    navigate(`/viewer/${novelId}/${episodeNumber}`);
  };

  const hasPrevious = dummyEpisodes.some(
    (ep) => ep.id === novelId && ep.number === currentNumber - 1
  );
  const hasNext = dummyEpisodes.some(
    (ep) => ep.id === novelId && ep.number === currentNumber + 1
  );
  // 현재 novelId의 모든 에피소드만 필터링
  const episodesForNovel = dummyEpisodes.filter((ep) => ep.id === novelId);

  // 에피소드가 하나도 없으면 기본값 처리
  const maxEpisodeNumber =
    episodesForNovel.length > 0
      ? Math.max(...episodesForNovel.map((ep) => ep.number))
      : 1;

  // 첫 화, 마지막 화 확인용 변수
  const isFirstEpisode = currentNumber === 1;
  const isLastEpisode = currentNumber === maxEpisodeNumber;

  return (
    <header className="viewer-header">
      <div className="left-control">
        <h3
          className="back-arrow"
          onClick={goBackToDetail}
          style={{ cursor: "pointer" }}
        >
          ←
        </h3>
        <h3 className="episode-title">{title}</h3>
      </div>

      <div className="right-control">
        <button
          className={`nav-button ${isFirstEpisode ? "disabled" : ""}`}
          onClick={() => goToEpisode(currentNumber - 1)}
          disabled={!hasPrevious}
        >
          ◀ 이전화
        </button>
        <button
          className={`nav-button ${isLastEpisode ? "disabled" : ""}`}
          onClick={() => goToEpisode(currentNumber + 1)}
          disabled={!hasNext}
        >
          다음화 ▶
        </button>
        <span className="welcome-msg">RyuJaeHun님 환영합니다!</span>
      </div>
    </header>
  );
}

export default ViewerControlBar;
