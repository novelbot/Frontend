// src/mainpage/NovelCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./NovelList.css"; // 스타일은 그대로 사용

const NovelCard = ({ title, genre, author, imageUrl }) => {
  const toSlug = (text) => text.replace(/\s+/g, "");

  return (
    <Link
      to={`/MainPage/${toSlug(title)}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="novel-card">
        <img src={imageUrl} alt={title} className="novel-image" />
        <div className="novel-overlay">
          <h4>{title}</h4>
          <p>
            {genre} · {author}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default NovelCard;
