import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import { instance } from "../../API/api"; // Axios 인스턴스 (baseURL 등 사전설정)

function Signup() {
  const [formData, setFormData] = useState({
    userName: "",
    userPassword: "",
    confirmPassword: "",
    userNickname: "",
    userEmail: "",
    userRole: "USER",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: false }));
  };

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

    // 3) 페이로드
    const payload = {
      userName: formData.userName,
      userNickname: formData.userNickname,
      userEmail: formData.userEmail,
      userPassword: formData.userPassword,
      userRole: formData.userRole || "USER",
    };

    try {
      const { data } = await instance.post("/users", payload); // baseURL은 instance에 설정
      console.log("회원가입 성공:", data);
      alert("회원가입이 완료되었습니다.");
      navigate("/login");
    } catch (err) {
      console.error("회원가입 실패:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "회원가입에 실패했습니다.";
      alert(msg);
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

        {/* 회원가입 버튼 */}
        <button className="signup-btn" onClick={handleSignup}>
          회원가입
        </button>
      </div>
    </div>
  );
}

export default Signup;
