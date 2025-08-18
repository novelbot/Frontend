// src/mainpage/NovelCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./NovelList.css"; // 스타일은 그대로 사용

const NovelCard = ({ novel }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/MainPage/${novel.novelId}`, {
      state: { novel }, // novel 객체를 상태로 전달
    });
  };

  return (
    <div className="novel-card" onClick={handleClick}>
      {/* coverImageUrl 사용 */}
      <img
        src={novel.coverImageUrl}
        alt={novel.title}
        className="novel-image"
      />
      <div className="novel-overlay">
        <h4>{novel.title}</h4>
        <p>
          {novel.genre} · {novel.author}
        </p>
      </div>
    </div>
  );
};

export default NovelCard;
