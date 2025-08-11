import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [formData, setFormData] = useState({
    userName: "",
    userPassword: "",
    confirmPassword: "",
    userNickname: "",
    userEmail: "",
    userRole: "USER", // 기본값
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // ✅ API 엔드포인트
  const API_BASE = import.meta.env.VITE_BASE_URL;          // 예: https://api.novelbot.org
  const SIGNUP_URL = `${API_BASE}/users`;                  // POST /users

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: false }));
  };

  // ✅ API POST 연결
  const handleSignup = async () => {
    // 1) 빈칸 검사
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!String(formData[key]).trim()) newErrors[key] = true;
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 2) 비밀번호 불일치 검사
    if (formData.userPassword !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 3) 페이로드 (API 스펙)
    const payload = {
      userName: formData.userName,
      userNickname: formData.userNickname,
      userEmail: formData.userEmail,
      userPassword: formData.userPassword,
      userRole: formData.userRole || "USER",
    };

    try {
      const res = await fetch(SIGNUP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        // credentials: "include", // 쿠키 사용 시
      });

      if (!res.ok) {
        let msg = "회원가입에 실패했습니다.";
        try {
          const data = await res.json();
          if (data?.message) msg = data.message;
        } catch {}
        alert(msg);
        return;
      }

      alert("회원가입이 완료되었습니다.");
      navigate("/login");
    } catch (e) {
      alert("네트워크 오류가 발생했습니다.");
    }
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
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="아이디를 입력하세요"
            className={errors.userName ? "error" : ""}
          />
          <button onClick={() => checkDuplicate("아이디")}>중복 확인</button>
        </div>

        {/* 비밀번호 */}
        <div className="input-row">
          <label>비밀번호</label>
          <input
            type="password"
            name="userPassword"
            value={formData.userPassword}
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요"
            className={errors.userPassword ? "error" : ""}
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
            className={errors.confirmPassword ? "error" : ""}
          />
        </div>

        {/* 닉네임 */}
        <div className="input-row">
          <label>닉네임</label>
          <input
            type="text"
            name="userNickname"
            value={formData.userNickname}
            onChange={handleChange}
            placeholder="닉네임을 입력하세요"
            className={errors.userNickname ? "error" : ""}
          />
        </div>

        {/* 이메일 */}
        <div className="input-row">
          <label>이메일</label>
          <input
            type="email"
            name="userEmail"
            value={formData.userEmail}
            onChange={handleChange}
            placeholder="이메일을 입력하세요"
            className={errors.userEmail ? "error" : ""}
          />
        </div>

        {/* (선택) 권한 */}
        {/* 필요하면 select 등을 노출하고 변경 가능 */}
        {/* <select name="userRole" value={formData.userRole} onChange={handleChange}>...</select> */}

        {/* 회원가입 버튼 */}
        <button className="signup-btn" onClick={handleSignup}>
          회원가입
        </button>
      </div>
    </div>
  );
}

export default Signup;
