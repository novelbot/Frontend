import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";
import cover1 from "../cartpage/01_젊은 느티나무 표지.png";
import downIcon from "/src/assets/down.png";

// 보여줄 개수 단위
const ITEMS_PER_BATCH = 3;

const sampleCart = [
  {
    id: 1,
    title: "젊은 느티나무",
    author: "강신재",
    genre: "멜로, 청춘",
    lastUpdate: "2025.07.03(최신화 업데이트 완료)",
    startDate: "2025.06.28",
    cover: cover1,
  },
  {
    id: 1,
    title: "젊은 느티나무",
    author: "강신재",
    genre: "멜로, 청춘",
    lastUpdate: "2025.07.03(최신화 업데이트 완료)",
    startDate: "2025.06.28",
    cover: cover1,
  },
  {
    id: 1,
    title: "젊은 느티나무",
    author: "강신재",
    genre: "멜로, 청춘",
    lastUpdate: "2025.07.03(최신화 업데이트 완료)",
    startDate: "2025.06.28",
    cover: cover1,
  },
  {
    id: 1,
    title: "젊은 느티나무",
    author: "강신재",
    genre: "멜로, 청춘",
    lastUpdate: "2025.07.03(최신화 업데이트 완료)",
    startDate: "2025.06.28",
    cover: cover1,
  },
  {
    id: 1,
    title: "젊은 느티나무",
    author: "강신재",
    genre: "멜로, 청춘",
    lastUpdate: "2025.07.03(최신화 업데이트 완료)",
    startDate: "2025.06.28",
    cover: cover1,
  },
  {
    id: 1,
    title: "젊은 느티나무",
    author: "강신재",
    genre: "멜로, 청춘",
    lastUpdate: "2025.07.03(최신화 업데이트 완료)",
    startDate: "2025.06.28",
    cover: cover1,
  },
  {
    id: 1,
    title: "젊은 느티나무",
    author: "강신재",
    genre: "멜로, 청춘",
    lastUpdate: "2025.07.03(최신화 업데이트 완료)",
    startDate: "2025.06.28",
    cover: cover1,
  },
];

function Cart() {
  const [sort, setSort] = useState("update");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);

  const toSlug = (title) => title.replace(/\s+/g, "");

  const visibleItems = sampleCart.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_BATCH);
  };

  return (
    <div className="cart-page">
      <h2 className="cart-title">장바구니</h2>

      <div className="cart-controls">
        <button
          className={sort === "update" ? "active" : ""}
          onClick={() => setSort("update")}
        >
          업데이트순
        </button>
        <button
          className={sort === "recent" ? "active" : ""}
          onClick={() => setSort("recent")}
        >
          최근등록순
        </button>
      </div>

      <div className="cart-list">
        {visibleItems.map((novel) => (
          <div className="cart-item" key={novel.id}>
            <img src={novel.cover} alt={novel.title} className="cart-cover" />
            <div className="cart-info">
              <h1 style={{ fontWeight: "normal", fontSize: "22px" }}>
                {novel.title}
              </h1>
              <p>
                {novel.genre} · {novel.author}
              </p>
              <p>최근 업데이트: {novel.lastUpdate}</p>
              <p>연재 시작일: {novel.startDate}</p>
            </div>
            <Link
              to={`/MainPage/${toSlug(novel.title)}`}
              className="continue-btn"
            >
              이어보기 &gt;
            </Link>
          </div>
        ))}
      </div>

      {/* down 버튼 */}
      {visibleCount < sampleCart.length && (
        <div className="load-more-wrapper">
          <button className="load-more" onClick={handleLoadMore}>
            <img src={downIcon} alt="더 보기" className="load-more-icon" />
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
