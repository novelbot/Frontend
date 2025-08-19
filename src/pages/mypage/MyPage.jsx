// src/pages/mypage/MyPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { instance } from "../../API/api";
import "./MyPage.css";

function MyPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false); // 저장 중 표시용

  // 화면에 바인딩되는 편집 데이터
  const [editData, setEditData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    email: "",
  });

  // 원본(변경 전) 정보를 보관해 비교/부수효과 처리에 사용
  const [original, setOriginal] = useState({
    username: "",
    nickname: "",
    email: "",
  });

  const bearer = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  };

  // 마운트: 서버에서 사용자 정보 조회
  useEffect(() => {
    const b = bearer();
    if (!b) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    (async () => {
      try {
        const res = await instance.get("/users/user", {
          headers: { Authorization: b },
        });
        const { userName, userNickname, userEmail } = res.data ?? {};
        const filled = {
          username: userName ?? "",
          nickname: userNickname ?? "",
          email: userEmail ?? "",
        };
        setEditData((prev) => ({ ...prev, ...filled }));
        setOriginal(filled);
      } catch (err) {
        console.error("유저 정보 조회 실패:", err?.response?.data || err?.message);
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          alert("세션이 만료되었거나 권한이 없습니다. 다시 로그인해 주세요.");
          localStorage.removeItem("token");
          window.dispatchEvent(new Event("authChanged")); // 즉시 헤더 반영
          navigate("/login");
          return;
        }
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

  // 회원정보 수정
  const handleUpdate = async () => {
    // ✅ 비밀번호 불일치 시: API 호출하지 않고 팝업만 띄움
    if (editData.password && editData.password !== editData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const b = bearer();
    if (!b) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    // 요청 바디 구성 (비밀번호는 입력했을 때만 포함)
    const body = {
      userName: editData.username?.trim(),
      userNickname: editData.nickname?.trim(),
      userEmail: editData.email?.trim(),
    };
    if (editData.password?.trim()) body.userPassword = editData.password.trim();

    try {
      setUpdating(true);

      // API 호출
      const res = await instance.post("/users/user", body, {
        headers: {
          Authorization: b,
          "Content-Type": "application/json",
        },
      });

      // 응답 반영
      const data = res?.data ?? {};
      const updated = {
        username: data.userName ?? body.userName,
        nickname: data.userNickname ?? body.userNickname,
        email: data.userEmail ?? body.userEmail,
      };

      // ✅ 새 토큰 갱신 시도 (헤더 우선, 없다면 바디 token)
      const newAuthHeader = res?.headers?.authorization;
      const newTokenFromBody = data?.token;
      const newTokenRaw = newAuthHeader || newTokenFromBody;

      if (newTokenRaw) {
        const newStored =
          newTokenRaw.startsWith("Bearer ") ? newTokenRaw : `Bearer ${newTokenRaw}`;
        localStorage.setItem("token", newStored);
        window.dispatchEvent(new Event("authChanged")); // ✅ 헤더 즉시 갱신 (닉네임 포함)
      } else {
        // 새 토큰이 없다면, 아이디/비밀번호 변경 시 보안상 재로그인 유도
        const usernameChanged = original.username !== updated.username;
        const passwordChanged = Boolean(editData.password?.trim());

        if (usernameChanged || passwordChanged) {
          alert("아이디/비밀번호가 변경되었습니다. 보안을 위해 다시 로그인해 주세요.");
          localStorage.removeItem("token");
          window.dispatchEvent(new Event("authChanged")); // ✅ 헤더 즉시 로그아웃 반영
          navigate("/login");
          return; // 여기서 종료
        }
      }

      // 화면 상태 갱신
      setEditData((prev) => ({
        ...prev,
        ...updated,
        password: "",
        confirmPassword: "",
      }));
      setOriginal(updated);

      // ✅ 토큰이 바뀌지 않았어도(예: 닉네임만 변경) 헤더 동기화하여 닉네임을 즉시 반영
      window.dispatchEvent(new Event("authChanged"));

      alert("회원 정보가 수정되었습니다.");
    } catch (err) {
      console.error("정보 수정 실패:", err?.response?.data || err?.message);
      const status = err?.response?.status;
      if (status === 401) {
        alert("인증에 실패했습니다. 다시 로그인해 주세요.");
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("authChanged")); // 즉시 헤더 반영
        navigate("/login");
        return;
      }
      if (status === 404) {
        alert("사용자 정보를 찾을 수 없습니다.");
        return;
      }
      if (status === 409) {
        alert("중복된 사용자명 또는 이메일입니다. 다른 값으로 시도해 주세요.");
        return;
      }
      alert("정보 수정 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
      alert("이미 로그아웃된 상태입니다.");
      navigate("/");
      return;
    }

    try {
      await instance.post("/auth/logout", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 로컬 세션 정리
      const colorKey = editData.username ? `avatarBgColor_${editData.username}` : null;
      if (colorKey) localStorage.removeItem(colorKey);
      localStorage.removeItem("token");

      window.dispatchEvent(new Event("authChanged"));
      alert("로그아웃 완료");
      navigate("/");
    } catch (err) {
      console.error("로그아웃 실패:", err?.response?.data || err?.message);

      // 실패해도 로컬 세션은 정리
      const colorKey = editData.username ? `avatarBgColor_${editData.username}` : null;
      if (colorKey) localStorage.removeItem(colorKey);
      localStorage.removeItem("token");

      window.dispatchEvent(new Event("authChanged"));
      alert("서버 오류가 있었지만, 로컬 세션은 종료했습니다.");
      navigate("/");
    }
  };


  const handleWithdraw = () => {
    console.log("서비스 탈퇴");
    // TODO: 탈퇴 API 연동
  };

  if (loading) return <div className="mypage-container">로딩 중...</div>;

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
            <button type="button">중복 확인</button>
          </div>

          <div className="mypage-input-row">
            <label>비밀번호</label>
            <input
              type="password"
              name="password"
              value={editData.password}
              onChange={handleChange}
              placeholder="변경 시에만 입력"
            />
          </div>
          <div className="mypage-input-row">
            <label>비밀번호 확인</label>
            <input
              type="password"
              name="confirmPassword"
              value={editData.confirmPassword}
              onChange={handleChange}
              placeholder="변경 시에만 입력"
            />
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

          <button
            className="mypage-update-btn"
            onClick={handleUpdate}
            disabled={updating}
            title={updating ? "저장 중..." : "정보 수정"}
          >
            {updating ? "저장 중..." : "정보 수정"}
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
