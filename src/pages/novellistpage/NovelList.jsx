// src/mainpage/NovelList.jsx
import React from "react";
import "./NovelList.css";
import { novels } from "/src/data/novelData";
import NovelCard from "./NovelCard";

const NovelList = () => {
  return (
    <div className="novel-list-container">
      <h3>웹소설</h3>
      <div className="novel-grid">
        {novels.map((novel, index) => (
          <NovelCard
            key={index}
            title={novel.title}
            genre={novel.genre}
            author={novel.author}
            imageUrl={novel.coverImageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default NovelList;
