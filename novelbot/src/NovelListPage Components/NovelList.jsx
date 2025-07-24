// src/MainPage Components/NovelList.jsx
import React from "react";
import "./NovelList.css";
import { novels } from "../data/novelData";

const NovelList = ({ onSelectNovel }) => {
  return (
    <div className="novel-list-container">
      <h3>웹소설</h3>
      <div className="novel-grid">
        {novels.map((novel, index) => (
          <div
            key={index}
            className="novel-card"
            onClick={() => onSelectNovel(novel)}
            style={{ cursor: "pointer" }}
          >
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
        ))}
      </div>
    </div>
  );
};

export default NovelList;
