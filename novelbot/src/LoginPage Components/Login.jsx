import { useState } from "react";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("로그인:", email, password);
  };

  const handleSignup = () => {
    console.log("회원가입 페이지 이동");
  };

  return (
    <div className="login-container">
      <h1 className="logo">novel bot</h1>

      <div className="login-box">
        <input
          type="email"
          placeholder="이메일을 입력해주세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleLogin}>
          로그인
        </button>

        <div className="divider">
          <hr />
          <span>or</span>
          <hr />
        </div>

        <button className="signup-btn" onClick={handleSignup}>
          회원가입
        </button>
      </div>
    </div>
  );
}

export default Login;
