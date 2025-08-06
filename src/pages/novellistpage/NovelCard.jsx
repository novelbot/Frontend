// src/mainpage/NovelCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./NovelList.css"; // 스타일은 그대로 사용

const NovelCard = ({ novel }) => {
  const toSlug = (text) => text.replace(/\s+/g, "");

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/MainPage/${toSlug(novel.title)}`, {
      state: { novel }, // novel 객체를 상태로 전달
    });
  };

  return (
    // <Link
    //   to={`/MainPage/${toSlug(novel.title)}`}
    //   style={{ textDecoration: "none", color: "inherit" }}
    // >
    <div className="novel-card" onClick={handleClick}>
      <img src={novel.imageUrl} alt={novel.title} className="novel-image" />
      <div className="novel-overlay">
        <h4>{novel.title}</h4>
        <p>
          {novel.genre} · {novel.author}
        </p>
      </div>
    </div>
    // </Link>
  );
};

export default NovelCard;
