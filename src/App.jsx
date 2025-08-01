// App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import { useState } from "react";
import Header from "./components/Header";
import BearIcon from "./components/BearIcon";
import NovelList from "./pages/novellistpage/NovelList";
import NovelDetail from "./pages/mainpage/NovelDetail";
import Viewer from "./pages/viewerpage/Viewer";
import Login from "./pages/loginpage/Login";
import Cart from "./pages/cartpage/Cart";
import Signup from "./pages/loginpage/Signup";
import MyPage from "./pages/mypage/MyPage";

function App() {
  const location = useLocation();
  const isViewerPage = location.pathname.startsWith("/viewer/");

  const [bearOpen, setBearOpen] = useState(false);
  return (
    <>
      {!isViewerPage && <Header />}{" "}
      {/* Viewer 페이지에선 기본 헤더 안 보이게 */}
      <Routes>
        <Route path="/" element={<NovelList />} />
        <Route path="/MainPage/:id" element={<NovelDetail />} />
        <Route
          path="/viewer/:id/:number"
          element={<Viewer bearOpen={bearOpen} />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign" element={<Signup />} />
        <Route path="/MyPage" element={<MyPage />} />
      </Routes>
      <BearIcon isOpen={bearOpen} setIsOpen={setBearOpen} />
    </>
  );
}

export default App;
