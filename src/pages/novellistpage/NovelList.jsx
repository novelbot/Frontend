// src/mainpage/NovelList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NovelList.css";
import NovelCard from "./NovelCard";
// import { instance } from "../../API/api";

const NovelList = ({ novelList = [] }) => {
  if (!Array.isArray(novelList)) {
    return <p>데이터를 불러오는 중입니다...</p>;
  }
  return (
    <div className="novel-list-container">
      <h3>웹소설</h3>
      <div className="novel-grid">
        {novelList.length === 0 ? (
          <p>검색 결과가 없습니다.</p>
        ) : (
          novelList.map((novel) => (
            <NovelCard key={novel.novelId || novel.id} novel={novel} />
          ))
        )}
      </div>
    </div>
  );
};

export default NovelList;