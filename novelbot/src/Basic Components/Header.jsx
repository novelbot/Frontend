// components/Header.jsx
import "./Header.css";
import userIcon from "../assets/user.png";
import SearchBar from "./SearchBar";

function Header({ onNavigate }) {
  return (
    <header className="header">
      {/* 상단 고정 헤더 바 */}
      {/* 왼쪽: 로고 + 메뉴 */}
      <div className="left-section">
        <span className="logo" onClick={() => onNavigate("novelList")}>
          Novel Bot
        </span>
        <span className="menu" onClick={() => onNavigate("cart")}>
          장바구니
        </span>
        <span className="menu" onClick={() => onNavigate("novelList")}>
          웹소설
        </span>
      </div>
      {/* 오른쪽: 검색창 + 로그인 영역 */}
      <div className="right-section">
        <SearchBar /> {/* 🔍 검색바 컴포넌트 */}
        <div className="login-section" onClick={() => onNavigate("login")}>
          <img src={userIcon} alt="user" /> {/* 사용자 아이콘 */}
          <span>로그인/회원가입</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
