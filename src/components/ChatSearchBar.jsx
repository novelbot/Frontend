// components/SearchBar.jsx
import "./SearchBar.css";
import searchIcon from "../assets/search.png";
import { instance } from "../API/api";
import { useState } from "react";

function ChatSearchBar({
  placeholder = "제목, 작가를 입력하세요.",
  onResults,
}) {
  const [keyword, setKeyword] = useState("");

  const handleSearch = async () => {
    try {
      const res = await instance.get("/novels/search", {
        params: { title: keyword },
      });
      // res.data가 배열인지 체크 후 넘기기
      const results = Array.isArray(res.data) ? res.data : [res.data];
      onResults(results);

      console.log(results);
    } catch (error) {
      console.error("검색 실패:", error);
    }
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder={placeholder}
        className="search-input"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <img
        src={searchIcon}
        alt="search"
        className="search-icon-right"
        onClick={handleSearch}
      />
    </div>
  );
}

export default ChatSearchBar;
