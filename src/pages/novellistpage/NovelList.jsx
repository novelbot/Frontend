// src/mainpage/NovelList.jsx
import React from "react";
import { useEffect } from "react";
import "./NovelList.css";
import { novels } from "/src/data/novelData";
import NovelCard from "./NovelCard";
import { instance } from "../../api/api";

const NovelList = () => {

  useEffect(() => {
    const getNovelList = async () => {
      try {
        const res = await instance.get('/novels/1/episodes');
        const data = res
        console.log(data);
        return res;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }

    getNovelList();
  }, [])

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
