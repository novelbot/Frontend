// src/components/Header.jsx
import React from "react";
import "./ViewerControlBar.css";

function Header({ title }) {
  return (
    <header className="viewer-header">
      <div className="left-control">
        <h3
          className="back-arrow"
          onClick={() => setCurrentPage("detail")}
          style={{ cursor: "pointer" }}
        >
          ←
        </h3>
        <h3 className="episode-title">{title}</h3>
      </div>

      <div className="right-control">
        <button className="nav-button">◀ 이전화</button>
        <button className="nav-button">다음화 ▶</button>
        <span className="welcome-msg">RyuJaeHun님 환영합니다!</span>
      </div>
    </header>
  );
}

export default Header;
