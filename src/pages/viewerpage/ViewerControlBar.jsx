// ViewerControlBar.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ViewerControlBar.css";
import { instance } from "/src/API/api";

function ViewerControlBar({ title, pageIndex, setPageIndex }) {
  const navigate = useNavigate();
  const { id, number, slug } = useParams();

  const currentNumber = parseInt(number, 10);
  const novelId = Number(id);

  const [episodes, setEpisodes] = useState([]);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [hasNext, setHasNext] = useState(false);

  const getStoredToken = () => {
    const raw =
      localStorage.getItem("accessToken") ??
      localStorage.getItem("token") ??
      sessionStorage.getItem("accessToken") ??
      sessionStorage.getItem("token");
    return raw?.replace(/^Bearer\s+/i, "") ?? null;
  };

  useEffect(() => {
    async function loadEpisodes() {
      try {
        const res = await instance.get(`/novels/${novelId}/episodes`);
        const list = Array.isArray(res.data) ? res.data : [];
        setEpisodes(list);

        const nums = list.map((ep) => ep.episodeNumber);
        setHasPrevious(nums.includes(currentNumber - 1));
        setHasNext(nums.includes(currentNumber + 1));
      } catch (err) {
        console.error("이전/다음 화 여부 확인 실패:", err);
        setHasPrevious(false);
        setHasNext(false);
      }
    }
    loadEpisodes();
  }, [novelId, currentNumber]);

  const goBackToDetail = () => {
    if (id) navigate(`/MainPage/${id}`);
    else navigate("/MainPage");
  };

  const goTo = (episodeNumber) => {
    setPageIndex(0);
    if (slug) navigate(`/viewer/${novelId}/${episodeNumber}/${slug}`);
    else navigate(`/viewer/${novelId}/${episodeNumber}`);
  };

  const purchaseIfNeededAndGo = useCallback(
    async (targetNumber) => {
      const target = episodes.find((ep) => ep.episodeNumber === targetNumber);
      if (!target) {
        console.warn("대상 회차를 찾을 수 없습니다:", targetNumber);
        goTo(targetNumber); // 방어적 이동
        return;
      }

      // 이미 구매된 에피소드면 알림 후 바로 이동
      if (target.isPurchased === true) {
        alert("이미 구매된 회차입니다. 바로 열람합니다.");
        goTo(targetNumber);
        return;
      }

      // 미구매면 구매 후 이동
      try {
        const token = getStoredToken();
        if (!token) {
          alert("인증 정보가 없습니다. 로그인 후 다시 시도해 주세요.");
          return;
        }

        console.log("[뷰어] 구매 요청", {
          episodeId: target.episodeId,
          novelId,
          episodeNumber: target.episodeNumber,
        });

        await instance.post(
          "/purchase",
          {
            episodeId: target.episodeId, // 서버가 episodeNumber를 요구하면 여기 교체
            novelId,
            ispurchased: true,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("[뷰어] 구매 성공 → 이동");
        alert("구매 성공! 바로 열람합니다.");
        goTo(targetNumber);
      } catch (err) {
        const status = err?.response?.status;
        console.error("[뷰어] 다음/이전 회차 구매 실패", status, err?.response?.data);

        if (status === 409) {
          // 이미 구매 처리됨 → 알림 후 이동
          alert("이미 구매된 회차입니다. 바로 열람합니다.");
          goTo(targetNumber);
          return;
        }
        if (status === 401) alert("인증이 필요합니다. 로그인 후 다시 시도해 주세요.");
        else if (status === 404) alert("회차를 찾을 수 없습니다.");
        else if (status === 400) alert("잘못된 요청입니다. 잠시 후 다시 시도해 주세요.");
        else alert("구매 처리 중 오류가 발생했습니다.");
      }
    },
    [episodes, novelId, slug]
  );

  const handlePrev = () => {
    if (!hasPrevious) return;
    purchaseIfNeededAndGo(currentNumber - 1);
  };

  const handleNext = () => {
    if (!hasNext) return;
    purchaseIfNeededAndGo(currentNumber + 1);
  };

  return (
    <header className="viewer-header">
      <div className="left-control">
        <h3 className="back-arrow" onClick={goBackToDetail} style={{ cursor: "pointer" }}>
          ←
        </h3>
        <h3 className="episode-title">{title}</h3>
      </div>

      <div className="right-control">
        <button
          className={`nav-button ${!hasPrevious ? "disabled" : ""}`}
          onClick={handlePrev}
          disabled={!hasPrevious}
        >
          ◀ 이전화
        </button>
        <button
          className={`nav-button ${!hasNext ? "disabled" : ""}`}
          onClick={handleNext}
          disabled={!hasNext}
        >
          다음화 ▶
        </button>
        <span className="welcome-msg">RyuJaeHun님 환영합니다!</span>
      </div>
    </header>
  );
}

export default ViewerControlBar;
