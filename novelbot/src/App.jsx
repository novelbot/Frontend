// App.jsx
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { useLocation } from "react-router-dom";
import Header from "./Basic Components/Header";
import BearIcon from "./Basic Components/BearIcon";
import NovelList from "./NovelListPage Components/NovelList";
import NovelDetail from "./MainPage Components/NovelDetail";
import Viewer from "./ViewerPage Components/Viewer";
import Login from "./Login&JoinPage Components/Login";
import Cart from "./CartPage Components/Cart";
import Signup from "./Login&JoinPage Components/Signup";

function App() {
  const location = useLocation();
  const isViewerPage = location.pathname.startsWith("/viewer/");
  return (
    <>
      {!isViewerPage && <Header />} {/* Viewer 페이지에선 기본 헤더 안 보이게 */}

      <Routes>
        <Route path="/" element={<NovelList />} />
        <Route path="/MainPage/:id" element={<NovelDetail />} />
        <Route path="/viewer/:id/:number" element={<Viewer />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="sign" element={<Signup />} />
      </Routes>

      <BearIcon />
    </>
  );
}

export default App;
