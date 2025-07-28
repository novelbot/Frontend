import { useState } from "react";
import "./MyPage.css";

function MyPage() {
  const [editData, setEditData] = useState({
    username: "novelbot",
    password: "",
    confirmPassword: "",
    nickname: "RyuJaeHun",
    email: "novelbot@gmail.com",
  });

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = () => {
    console.log("회원 정보 수정:", editData);
  };

  const handleLogout = () => {
    console.log("로그아웃");
  };

  const handleWithdraw = () => {
    console.log("서비스 탈퇴");
  };

  return (
    <div className="mypage-container">
      <h2 className="mypage-title">마이페이지</h2>

      {/* 회원 정보 */}
      <div className="mypage-section">
        <h3>회원 정보</h3>
        <div className="mypage-info-box">
          <p>
            <strong>아이디</strong> {editData.username}
          </p>
          <p>
            <strong>닉네임</strong> {editData.nickname}
          </p>
          <p>
            <strong>이메일</strong> {editData.email}
          </p>
        </div>
      </div>

      {/* 회원 정보 수정 */}
      <div className="mypage-section">
        <h3>회원 정보 수정</h3>
        <div className="mypage-edit-box">
         <div className="mypage-input-row">
            <label>아이디</label>
            <input
                type="text"
                name="username"
                value={editData.username}
                onChange={handleChange}
            />
        <button>중복 확인</button>
        </div>

          <div className="mypage-input-row">
            <label>비밀번호</label>
            <input
              type="password"
              name="password"
              value={editData.password}
              onChange={handleChange}
            />
          </div>
          <div className="mypage-input-row">
            <label>비밀번호 확인</label>
            <input
              type="password"
              name="confirmPassword"
              value={editData.confirmPassword}
              onChange={handleChange}
            />
            <button>중복 확인</button>
          </div>
          <div className="mypage-input-row">
            <label>닉네임</label>
            <input
              type="text"
              name="nickname"
              value={editData.nickname}
              onChange={handleChange}
            />
          </div>
          <div className="mypage-input-row">
            <label>이메일</label>
            <input
              type="email"
              name="email"
              value={editData.email}
              onChange={handleChange}
            />
          </div>
          <button className="mypage-update-btn" onClick={handleUpdate}>
            정보 수정
          </button>
        </div>
      </div>

      {/* 로그아웃 */}
      <div className="mypage-section">
        <button className="mypage-logout-btn" onClick={handleLogout}>
          로그아웃
        </button>
      </div>

      {/* 서비스 탈퇴 */}
      <div className="mypage-section">
        <button className="mypage-withdraw-btn" onClick={handleWithdraw}>
          서비스 탈퇴
        </button>
      </div>
    </div>
  );
}

export default MyPage;