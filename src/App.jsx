// App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import BearIcon from "./components/BearIcon";
import NovelList from "./pages/novellistpage/NovelList";
import NovelDetail from "./pages/mainpage/NovelDetail";
import Viewer from "./pages/viewerpage/Viewer";
import Login from "./pages/loginpage/Login";
import Cart from "./pages/cartpage/Cart";
import Signup from "./pages/loginpage/Signup";
import MyPage from "./pages/mypage/MyPage";

import { instance } from "./API/api";

function App() {
  const location = useLocation();
  const isViewerPage = location.pathname.startsWith("/viewer/");

  // 곰 상태 관리: 채팅창 열렸는지 닫혔는지
  const [bearOpen, setBearOpen] = useState(false);

  // novelList 상태 관리
  const [novelList, setNovelList] = useState([]);

  // 초기 전체 목록 불러오기 (마운트 시)
  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const res = await instance.get("/novels");
        setNovelList(res.data);
      } catch (err) {
        console.error("소설 목록 불러오기 실패:", err);
      }
    };
    fetchNovels();
  }, []);

  // 검색 결과를 받을 함수 (Header → SearchBar → 여기로)
  const handleSearchResults = (results) => {
    setNovelList(results);
  };

  return (
    <>
      {!isViewerPage && <Header onSearchResults={handleSearchResults} />}
      {/* Viewer 페이지에선 기본 헤더 안 보이게 */}
      <Routes>
        <Route path="/" element={<NovelList novelList={novelList} />} />
        <Route path="/MainPage/:id" element={<NovelDetail />} />
        <Route
          path="/viewer/:id/:number"
          element={<Viewer bearOpen={bearOpen} />}
        />
        {/* <Route path="/cart" element={<Cart />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/sign" element={<Signup />} />
        <Route path="/MyPage" element={<MyPage />} />
      </Routes>
      <BearIcon isOpen={bearOpen} setIsOpen={setBearOpen} />
    </>
  );
}

export default App;
