// components/Header.jsx
import "./Header.css";
import userIcon from "../assets/user.png";
import down from "../assets/down.png";
import SearchBar from "./SearchBar";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

// JWT(Base64URL) 디코더
function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function Header({ onSearchResults }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [avatarBg, setAvatarBg] = useState("#D6E6FF");

  // 토큰 → 상태 동기화 함수 (초기/이벤트 시 모두 사용)
  const syncAuth = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      setUser(null);
      return;
    }

    const decoded = decodeJwt(token);
    if (!decoded || (decoded.exp && decoded.exp * 1000 <= Date.now())) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUser(null);
      return;
    }

    setIsLoggedIn(true);
    setUser(decoded);

    const colors = [
      "#F6D6D6", "#FDE2B9", "#FFF1B6",
      "#D7F3E3", "#D6E6FF", "#E7D6FF", "#FFDFEF",
    ];

    // 사용자별 색상 키
    const colorKey = `avatarBgColor_${decoded.sub}`;
    const savedColor = localStorage.getItem(colorKey);

    if (savedColor) {
      setAvatarBg(savedColor);
    } else {
      const newColor = colors[Math.floor(Math.random() * colors.length)];
      setAvatarBg(newColor);
      localStorage.setItem(colorKey, newColor);
    }
  }, []);

  useEffect(() => {
    // 초기 1회
    syncAuth();

    // 로그인/로그아웃 시 커스텀 이벤트로 동기화
    const handleAuthChanged = () => syncAuth();
    window.addEventListener("authChanged", handleAuthChanged);

    // 다른 탭/창에서 localStorage가 바뀌었을 때도 반영
    const handleStorage = (e) => {
      if (e.key && e.key.startsWith("token")) syncAuth();
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("authChanged", handleAuthChanged);
      window.removeEventListener("storage", handleStorage);
    };
  }, [syncAuth]);

  return (
    <header className="header">
      <div className="left-section">
        <Link to="/" className="header-logo">Novel Bot</Link>
        <Link to="/Cart" className="menu">장바구니</Link>
        <Link to="/" className="menu">웹소설</Link>
      </div>

      <div className="right-section">
        <SearchBar onResults={onSearchResults} />
        <div className="login-section">
          {isLoggedIn ? (
            <>
              <div
                className="user-avatar"
                style={{ backgroundColor: avatarBg }}
              >
                {user?.sub ? user.sub.charAt(0).toUpperCase() : "U"}
              </div>
              <span style={{ marginRight: 8 }}>
                {user?.sub ? `${user.sub}` : "사용자"}님 <br />환영합니다!
              </span>
              <Link to="/mypage">
                <img src={down} alt="down" style={{ width: 18, height: 18 }} />
              </Link>
            </>
          ) : (
            <>
              <img src={userIcon} alt="user" />
              <Link to="/login">로그인/회원가입</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
