// NovelEpisode.jsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./NovelEpisode.css";
import downIcon from "/src/assets/down.png";
import { instance } from "/src/API/api";

const EPISODES_PER_BATCH = 4;

// 토큰 유틸
const getStoredToken = () => {
  const raw =
    localStorage.getItem("accessToken") ??
    localStorage.getItem("token") ??
    sessionStorage.getItem("accessToken") ??
    sessionStorage.getItem("token");
  return raw?.replace(/^Bearer\s+/i, "") ?? null;
};

// episodeId 정규화(문자열)
const idOf = (id) => (id == null ? "" : String(id));

function NovelEpisodeList({
  episodes,
  novel,
  onPurchase,
  purchasingId,
  purchasedEpisodes, // 문자열 배열
}) {
  // 디버그: 렌더링 시 각 카드의 구매 여부 확인
  useEffect(() => {
    try {
      const dbg = episodes.map((ep) => ({
        episodeId: ep.episodeId,
        type: typeof ep.episodeId,
        isPurchased: purchasedEpisodes.includes(idOf(ep.episodeId)),
      }));
      console.table(dbg);
    } catch {}
  }, [episodes, purchasedEpisodes]);

  return (
    <div className="episode-list">
      {episodes.map((episode, index) => {
        const isPurchased = purchasedEpisodes.includes(idOf(episode.episodeId));
        return (
          <div
            className="episode-card"
            key={episode.episodeId ?? `${episode.novelId}-${index}`}
          >
            {novel.coverImageUrl && (
              <img src={novel.coverImageUrl} alt={`${novel.title} 표지`} />
            )}

            <div className="episode-info">
              <p className="episode-date">{episode.publicationDate}</p>
              <p className="episode-title-text">{episode.episodeTitle}</p>
            </div>

            <div className="episode-meta">
              <span>{episode.episodeNumber}화</span>
              <button
                className="free-badge"
                // 완료 상태에서도 클릭 가능 → onPurchase가 내부에서 분기 처리
                onClick={() => onPurchase(episode)}
                // 구매 진행 중일 때만 비활성화
                disabled={idOf(purchasingId) === idOf(episode.episodeId)}
                style={{
                  backgroundColor: isPurchased ? "#EEEEEE" : "#FFFFFF",
                  color: "#000",
                  border: "1px solid #ccc",
                  cursor:
                    idOf(purchasingId) === idOf(episode.episodeId)
                      ? "not-allowed"
                      : "pointer",
                }}
                title={
                  isPurchased
                    ? "이미 구매된 회차입니다. 클릭하면 바로 열람합니다."
                    : "무료로 구매합니다."
                }
              >
                {isPurchased
                  ? "완료"
                  : idOf(purchasingId) === idOf(episode.episodeId)
                  ? "처리 중..."
                  : "무료"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const NovelEpisode = ({ novel }) => {
  const [episodes, setEpisodes] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [visibleCount, setVisibleCount] = useState(EPISODES_PER_BATCH);
  const [purchasingId, setPurchasingId] = useState(null);
  const [purchasedEpisodes, setPurchasedEpisodes] = useState([]); // 문자열 배열
  const navigate = useNavigate();

  // 에피소드 목록 + 구매 여부(isPurchased) 함께 조회
  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const token = getStoredToken();
        console.log("토큰 존재 여부:", !!token);

        const res = await instance.get(`/novels/${novel.novelId}/episodes`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        const list = Array.isArray(res.data) ? res.data : [];
        setEpisodes(list);

        // 디버그: 원본 응답
        console.log("에피소드 API 응답:", list);

        // 응답의 isPurchased=true 인 episodeId만 수집(문자열로 정규화)
        const purchased = list
          .filter((ep) => ep?.isPurchased === true)
          .map((ep) => idOf(ep.episodeId));

        setPurchasedEpisodes(purchased);
        console.log("구매된 episodeId 목록:", purchased);
      } catch (error) {
        console.error("에피소드 불러오기 실패:", error);
      }
    };

    if (novel?.novelId) fetchEpisodes();
  }, [novel?.novelId]);

  if (!novel) return <div>오류 발생</div>;

  const sortedEpisodes = useMemo(
    () =>
      [...episodes].sort((a, b) =>
        sortOrder === "asc"
          ? a.episodeNumber - b.episodeNumber
          : b.episodeNumber - a.episodeNumber
      ),
    [episodes, sortOrder]
  );

  const visibleEpisodes = sortedEpisodes.slice(0, visibleCount);

  const handleLoadMore = () =>
    setVisibleCount((prev) => prev + EPISODES_PER_BATCH);

  const handleSortChange = (order) => {
    setSortOrder(order);
    setVisibleCount(EPISODES_PER_BATCH);
  };

  const handlePurchase = async (episode) => {
    const epId = idOf(episode.episodeId);

    // 이미 구매된 회차는 API 호출 없이 바로 뷰어로 이동
    if (purchasedEpisodes.includes(epId)) {
      alert("이미 구매된 회차입니다. 바로 열람합니다.");
      console.log("이미 구매됨 → 바로 이동:", episode.episodeId);
      navigate(`/viewer/${episode.novelId}/${episode.episodeNumber}`);
      return;
    }

    try {
      setPurchasingId(episode.episodeId);

      const token = getStoredToken();
      if (!token) {
        alert("인증 정보가 없습니다. 로그인 후 다시 시도해 주세요.");
        return;
      }

      // 디버그: 구매 요청 페이로드
      console.log("구매 요청:", {
        episodeId: episode.episodeId,
        novelId: episode.novelId,
      });

      await instance.post(
        "/purchase",
        {
          episodeId: episode.episodeId,
          novelId: episode.novelId,
          ispurchased: true,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 성공 시 상태 갱신(문자열로 저장)
      setPurchasedEpisodes((prev) => {
        const next = prev.includes(epId) ? prev : [...prev, epId];
        alert("구매 성공");
        console.log("구매 성공 → purchasedEpisodes 갱신:", next);
        return next;
      });

      navigate(`/viewer/${episode.novelId}/${episode.episodeNumber}`);
    } catch (err) {
      const status = err?.response?.status;
      console.error("구매 실패:", status, err);

      if (status === 409) {
        // 이미 구매된 상태 → 목록 갱신 후 이동
        alert("이미 구매된 회차입니다. 바로 열람합니다.");
        setPurchasedEpisodes((prev) => {
          const next = prev.includes(epId) ? prev : [...prev, epId];
          console.log("409 처리 → purchasedEpisodes 갱신:", next);
          return next;
        });
        navigate(`/viewer/${episode.novelId}/${episode.episodeNumber}`);
        return;
      }
      if (status === 401) {
        alert("인증이 필요합니다. 로그인 후 다시 시도해 주세요.");
      } else if (status === 404) {
        alert("에피소드를 찾을 수 없습니다.");
      } else if (status === 400) {
        alert("잘못된 요청입니다. 잠시 후 다시 시도해 주세요.");
      } else {
        alert("구매 처리 중 오류가 발생했습니다.");
      }
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <div className="novel-episode">
      <h2 className="episode-title">{novel.title}</h2>

      <div className="episode-controls">
        <button
          className={`sort-button ${sortOrder === "asc" ? "active" : ""}`}
          onClick={() => handleSortChange("asc")}
        >
          첫화부터
        </button>
        <button
          className={`sort-button ${sortOrder === "desc" ? "active" : ""}`}
          onClick={() => handleSortChange("desc")}
        >
          최신화부터
        </button>
      </div>

      <p className="episode-count">전체 {episodes.length}화</p>

      <NovelEpisodeList
        episodes={visibleEpisodes}
        novel={novel}
        onPurchase={handlePurchase}
        purchasingId={purchasingId}
        purchasedEpisodes={purchasedEpisodes}
      />

      {visibleCount < episodes.length && (
        <div className="load-more-wrapper">
          <button className="load-more" onClick={handleLoadMore}>
            <img src={downIcon} alt="더 보기" className="load-more-icon" />
          </button>
        </div>
      )}
    </div>
  );
};

export default NovelEpisode;
