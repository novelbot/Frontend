// components/SearchBar.jsx
import './SearchBar.css';
import searchIcon from '../assets/search.png';

function SearchBar() {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="제목, 작가를 입력하세요."
        className="search-input"
      />
      <img src={searchIcon} alt="search" className="search-icon-right" />
    </div>
  );
}

export default SearchBar;
