// components/Header.jsx
import "./Header.css";
import userIcon from "../assets/user.png";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom"; // ✅ 추가

function Header() {
  return (
    <header className="header">
      {/* 왼쪽: 로고 + 메뉴 */}
      <div className="left-section">
        <Link to="/" className="header-logo">Novel Bot</Link>
        <Link to="/Cart" className="menu">장바구니</Link>
        <Link to="/" className="menu">웹소설</Link>
      </div>

      {/* 오른쪽: 검색창 + 로그인 영역 */}
      <div className="right-section">
        <SearchBar />
        <div className="login-section">
          <img src={userIcon} alt="user" />
          <Link to="/login">로그인/회원가입</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
