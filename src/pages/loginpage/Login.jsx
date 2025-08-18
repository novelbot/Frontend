// pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { instance } from "../../API/api"; // Axios 인스턴스
import "./Login.css";

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!id.trim() || !password.trim()) {
      window.alert("아이디와 비밀번호를 입력해주세요");
      return;
    }
    if (loading) return;
    setLoading(true);

    try {
      const res = await instance.post("/auth/login", {
        username: id, // API 스펙상 username 사용
        password,
      });

      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);

        // 헤더가 즉시 반응하도록 알림 이벤트 발행
        window.dispatchEvent(new Event("authChanged"));

        // 로그인 성공 시 페이지 이동 (원하는 경로로 변경 가능)
        navigate("/"); // 예: navigate("/novellist");
      } else {
        window.alert("로그인에 실패했습니다");
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          window.alert("아이디가 존재하지 않습니다");
        } else if (err.response.status === 401) {
          window.alert("비밀번호가 일치하지 않습니다");
        } else {
          window.alert(err.response.data?.message || "로그인에 실패했습니다");
        }
      } else {
        window.alert("네트워크 오류가 발생했습니다");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1 className="logo">novel bot</h1>

      <div className="login-box">
        <input
          type="text"
          placeholder="아이디를 입력해주세요"
          value={id}
          onChange={(e) => setId(e.target.value)}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLogin();
          }}
        />

        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>

        <div className="divider">
          <hr /><span>or</span><hr />
        </div>

        <Link to="/sign">
          <button className="signup-btn">회원가입</button>
        </Link>
      </div>
    </div>
  );
}

export default Login;
