// components/Header.jsx
import './Header.css';
import userIcon from '../assets/user.png';
import SearchBar from './SearchBar';

function Header() {
  return (
    <header className="header">
      <div className="left-section">
        <span className="logo">Novel Bot</span>
        <span className="menu">장바구니</span>
        <span className="menu">웹소설</span>
      </div>

      <div className="right-section">
        <SearchBar />
        <div className="login-section">
          <img src={userIcon} alt="user" />
          <span>로그인/회원가입</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
