// src/MainPage Components/NovelList.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./NovelList.css";
import { novels } from "../data/novelData";

const NovelList = () => {
  const toSlug = (title) => title.replace(/\s+/g, ""); // 공백 제거

  return (
    <div className="novel-list-container">
      <h3>웹소설</h3>
      <div className="novel-grid">
        {novels.map((novel, index) => (
          <Link
            key={index}
            to={`/MainPage/${toSlug(novel.title)}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="novel-card" style={{ cursor: "pointer" }}>
              <img
                src={novel.coverImageUrl}  // 또는 novel.image 사용 중이면 맞게 조정
                alt={novel.title}
                className="novel-image"
              />
              <div className="novel-overlay">
                <h4>{novel.title}</h4>
                <p>{novel.genre} · {novel.author}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NovelList;
