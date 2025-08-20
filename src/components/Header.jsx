// src/components/Header.jsx
import "./Header.css";
import userIcon from "../assets/user.png";
import down from "../assets/down.png";
import SearchBar from "./SearchBar";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { instance } from "../API/api"; // ✅ axios 인스턴스 사용

// 토큰 포맷터
function getBearer() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
}

function Header({ onSearchResults }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState(null); // ✅ 서버에서 받은 사용자 정보 {userName, userNickname, userEmail}
  const [avatarBg, setAvatarBg] = useState("#D6E6FF");

  // ✅ 토큰 존재 여부 + /users/user 호출로 상태 동기화
  const syncAuth = useCallback(async () => {
    const b = getBearer();
    if (!b) {
      setIsLoggedIn(false);
      setProfile(null);
      return;
    }

    try {
      const res = await instance.get("/users/user", {
        headers: { Authorization: b },
      });
      const data = res?.data ?? {};
      const filled = {
        userName: data.userName ?? "",
        userNickname: data.userNickname ?? "",
        userEmail: data.userEmail ?? "",
      };

      setIsLoggedIn(true);
      setProfile(filled);

      // 아바타 색상: 사용자 식별자로 고정
      const keyId = filled.userName || filled.userNickname || "unknown";
      const colorKey = `avatarBgColor_${keyId}`;
      const colors = [
        "#F6D6D6",
        "#FDE2B9",
        "#FFF1B6",
        "#D7F3E3",
        "#D6E6FF",
        "#E7D6FF",
        "#FFDFEF",
      ];
      const saved = localStorage.getItem(colorKey);
      if (saved) {
        setAvatarBg(saved);
      } else {
        const newColor = colors[Math.floor(Math.random() * colors.length)];
        setAvatarBg(newColor);
        localStorage.setItem(colorKey, newColor);
      }
    } catch (err) {
      // 401/403 등: 토큰 제거 후 비로그인 처리
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    // 초기 1회
    syncAuth();

    // 로그인/로그아웃/토큰갱신 시 커스텀 이벤트로 동기화
    const handleAuthChanged = () => {
      syncAuth();
    };
    window.addEventListener("authChanged", handleAuthChanged);

    // 다른 탭/창에서 토큰 변경 시 동기화
    const handleStorage = (e) => {
      if (!e.key || e.key !== "token") return;
      syncAuth();
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("authChanged", handleAuthChanged);
      window.removeEventListener("storage", handleStorage);
    };
  }, [syncAuth]);

  const nickname = profile?.userNickname || "";
  const displayInitial =
    nickname?.trim()?.charAt(0)?.toUpperCase() ||
    profile?.userName?.trim()?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <header className="header">
      <div className="left-section">
        <Link to="/" className="header-logo">
          Novel Bot
        </Link>
        {/* <Link to="/Cart" className="menu">장바구니</Link> */}
        <Link
          to="/"
          className="menu"
          onClick={(e) => {
            e.preventDefault(); // 기본 Link 동작 막기
            window.location.href = "/"; // 강제 새로고침 이동
          }}
        >
          웹소설
        </Link>
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
                {displayInitial}
              </div>
              <span style={{ marginRight: 8 }}>
                {nickname ? `${nickname}` : "사용자"}님 <br />
                환영합니다!
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
