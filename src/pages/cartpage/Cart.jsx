import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";
import cover1 from "/src/data/01_젊은 느티나무 표지.png";
import cover2 from "/src/data/02_백치 아다다 표지.png";
import cover3 from "/src/data/03_카프카를 읽는 밤 표지.png";
import cover4 from "/src/data/04_강아지똥 표지.png";
import cover5 from "/src/data/05_등신불 표지.png";
import cover6 from "/src/data/06_바위 표지.png";
import cover7 from "/src/data/25_먼길 표지.png";
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
    id: 2,
    title: "백치 아다다",
    author: "계용묵",
    genre: "단편 소설",
    lastUpdate: "2018.06.27(완결)",
    startDate: "2014.01.17",
    cover: cover2,
  },
  {
    id: 3,
    title: "카프카를 읽는 밤",
    author: "구효서",
    genre: "현대문학, 심리소설, 로맨스",
    lastUpdate: "2022.11.05(완결)",
    startDate: "2021.09.12",
    cover: cover3,
  },
  {
    id: 4,
    title: "강아지 똥",
    author: "권정생",
    genre: "동화",
    lastUpdate: "2015.03.10(완결)",
    startDate: "2014.12.25",
    cover: cover4,
  },
  {
    id: 5,
    title: "등신불(等身佛)",
    author: "김동리",
    genre: "현대 단편 소설, 사실주의, 비극",
    lastUpdate: "2017.09.18(완결)",
    startDate: "2017.08.01",
    cover: cover5,
  },
  {
    id: 6,
    title: "바위",
    author: "김동리",
    genre: "현대 단편 소설, 사실주의, 비극",
    lastUpdate: "2019.05.30(완결)",
    startDate: "2019.03.27",
    cover: cover6,
  },
  {
    id: 7,
    title: "먼 길",
    author: "김인숙",
    genre: "일상, 드라마",
    lastUpdate: "2024.06.10(완결)",
    startDate: "2024.04.15",
    cover: cover7,
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
