import { useState } from "react";
import "./Signup.css";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = () => {
    console.log("회원가입 데이터:", formData);
  };

  const checkDuplicate = (field) => {
    console.log(`${field} 중복 확인`);
  };

  return (
    <div className="signup-container">
      <h1 className="logo">novel bot</h1>

      <div className="signup-box">
        {/* 아이디 */}
        <div className="input-row">
          <label>아이디</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="아이디를 입력하세요"
          />
          <button onClick={() => checkDuplicate("아이디")}>중복 확인</button>
        </div>

        {/* 비밀번호 */}
        <div className="input-row">
          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요"
          />
        </div>

        {/* 비밀번호 확인 */}
        <div className="input-row">
          <label>비밀번호 확인</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="비밀번호를 다시 입력하세요"
          />
          <button onClick={() => checkDuplicate("비밀번호")}>중복 확인</button>
        </div>

        {/* 닉네임 */}
        <div className="input-row">
          <label>닉네임</label>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            placeholder="닉네임을 입력하세요"
          />
        </div>

        {/* 이메일 */}
        <div className="input-row">
          <label>이메일</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일을 입력하세요"
          />
        </div>

        {/* 회원가입 버튼 */}
        <button className="signup-btn" onClick={handleSignup}>
          회원가입
        </button>
      </div>
    </div>
  );
}

export default Signup;