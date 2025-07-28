import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ViewerControlBar.css";
import { dummyEpisodes } from "../data/episodeData";

function ViewerControlBar({ title }) {
  const navigate = useNavigate();
  const { id, number } = useParams(); // id: novelId, number: episodeNumber

  const currentNumber = parseInt(number, 10);
  const novelId = Number(id);

  const currentEpisode = dummyEpisodes.find(
    (ep) => ep.id === novelId && ep.number === currentNumber
  );

  // 🔑 제목에서 공백 제거한 slug 만들기
  const slug = currentEpisode?.novelTitle?.replace(/\s+/g, "");

  const goBackToDetail = () => {
    if (slug) {
      navigate(`/MainPage/${slug}`);
    } else {
      navigate(-1); // fallback
    }
  };

  const goToEpisode = (episodeNumber) => {
    navigate(`/viewer/${novelId}/${episodeNumber}`);
  };

  const hasPrevious = dummyEpisodes.some(
    (ep) => ep.id === novelId && ep.number === currentNumber - 1
  );
  const hasNext = dummyEpisodes.some(
    (ep) => ep.id === novelId && ep.number === currentNumber + 1
  );

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
          className="nav-button"
          onClick={() => goToEpisode(currentNumber - 1)}
          disabled={!hasPrevious}
        >
          ◀ 이전화
        </button>
        <button
          className="nav-button"
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
