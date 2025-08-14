// src/pages/mypage/MyPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { instance } from "../../API/api";
import "./MyPage.css";

// JWT(Base64URL) 디코더
function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function MyPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [editData, setEditData] = useState({
    username: "",        // 아이디
    password: "",
    confirmPassword: "",
    nickname: "",        // 닉네임
    email: "",           // 이메일
  });

  // 1) 마운트 시 토큰으로 유저 정보 세팅
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    // (A) JWT payload에서 기본값 채우기
    const decoded = decodeJwt(token);
    const sub = decoded?.sub ? String(decoded.sub) : "";

    // (B) 서버에서 유저 정보 조회가 가능하다면 여기서 호출
    // 예시: GET /auth/me?token=...
    // 서버가 없다면 (또는 아직 준비되지 않았다면) JWT의 sub로 아이디만 채웁니다.
    (async () => {
      try {

        setEditData((prev) => ({
          ...prev,
          username: sub || "unknown",
          nickname: sub || "User",
          email: "",
        }));
      } catch (e) {
        console.error(e);
        // 실패 시에도 최소한 sub는 반영
        setEditData((prev) => ({
          ...prev,
          username: sub || "unknown",
          nickname: sub || "User",
          email: "",
        }));
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = () => {
    console.log("회원 정보 수정:", editData);
    // TODO: 서버의 회원정보 수정 API에 맞게 fetch 호출 추가
  };

  // 2) 로그아웃
  // ▼ MyPage.jsx 중 handleLogout 만 교체
  // MyPage.jsx - handleLogout 교체
  // MyPage.jsx - handleLogout 교체
const handleLogout = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("이미 로그아웃된 상태입니다.");
    navigate("/");
    return;
  }

  // 사용자별 아바타 색상 키 제거용
  const decoded = decodeJwt(token);
  const sub = decoded?.sub ? String(decoded.sub) : null;
  const colorKey = sub ? `avatarBgColor_${sub}` : null;

  try {
    // 1) 바디·헤더 없이 query string 으로만 전송 (문서 요구사항)
    await instance.post("/auth/logout", null, {
      params: { token: encodeURIComponent(token) },
      // 헤더 절대 넣지 않음: Authorization / Content-Type 등 제거
      headers: {},
    });

    if (colorKey) localStorage.removeItem(colorKey);
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChanged"));
    alert("로그아웃 완료");
    navigate("/");
  } catch (err) {
    console.error("로그아웃 실패:", err?.response?.data || err?.message);

    // 서버 오류여도 로컬 세션 정리
    if (colorKey) localStorage.removeItem(colorKey);
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChanged"));
    alert("서버 오류가 있었지만, 로컬 세션은 종료했습니다.");
    navigate("/");
  }
};



  const handleWithdraw = () => {
    console.log("서비스 탈퇴");
    // TODO: 탈퇴 API 연동 시 fetch 추가
  };

  if (loading) {
    return <div className="mypage-container">로딩 중...</div>;
  }

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
            <strong>이메일</strong> {editData.email || "-"}
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
