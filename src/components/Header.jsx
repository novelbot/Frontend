// components/Header.jsx
import "./Header.css";
import userIcon from "../assets/user.png";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";

function Header({ onSearchResults }) {
  return (
    <header className="header">
      <div className="left-section">
        <Link
          to="/"
          className="header-logo"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = "/";
          }}
        >
          Novel Bot
        </Link>
        <Link to="/Cart" className="menu">
          장바구니
        </Link>
        <Link
          to="/"
          className="menu"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = "/";
          }}
        >
          웹소설
        </Link>
      </div>

      <div className="right-section">
        <SearchBar onResults={onSearchResults} />
        <div className="login-section">
          <img src={userIcon} alt="user" />
          <Link to="/login">로그인/회원가입</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
