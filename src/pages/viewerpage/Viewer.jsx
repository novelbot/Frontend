import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Viewer.css";
import ViewerControlBar from "./ViewerControlBar";
import { instance } from "/src/API/api";

function Viewer({ bearOpen }) {
  const { id: novelId, number: episodeNumber } = useParams();

  // 모든 state를 컴포넌트 최상단에서 선언
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);

  // ✅ novelId와 episodeNumber localStorage 저장/삭제
  useEffect(() => {
    localStorage.setItem("novelId", novelId);
    localStorage.setItem("episodeNumber", episodeNumber);

    return () => {
      // 컴포넌트 언마운트 시 삭제
      localStorage.removeItem("novelId");
      localStorage.removeItem("episodeNumber");
    };
  }, [novelId, episodeNumber]);

  // 데이터 fetch
  useEffect(() => {
    async function fetchEpisode() {
      try {
        const res = await instance.get(
          `/novels/${novelId}/episodes/${episodeNumber}`
        );
        setEpisode(res.data);
      } catch (error) {
        console.error("에피소드 로드 실패:", error);
        setEpisode(null);
      } finally {
        setLoading(false);
      }
    }
    fetchEpisode();
  }, [novelId, episodeNumber]);

  // 페이지 분할은 episode가 있든 없든 항상 실행
  const pages = splitTextIntoPages(episode?.content || "", 500);
  const leftPage = pages[pageIndex] || "";
  const rightPage = pages[pageIndex + 1] || "";

  const goToNextPage = () => {
    if (pageIndex + 2 < pages.length) {
      setPageIndex((prev) => prev + 2);
    }
  };

  const goToPreviousPage = () => {
    if (pageIndex - 2 >= 0) {
      setPageIndex((prev) => prev - 2);
    }
  };

  const isPrevDisabled = pageIndex === 0;
  const isNextDisabled = pageIndex + 2 >= pages.length;

  // 키보드 이벤트
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") goToNextPage();
      else if (e.key === "ArrowLeft") goToPreviousPage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pageIndex]);

  // UI 분기 처리
  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (!episode) {
    return <div className="error">에피소드를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="viewer-container">
      <ViewerControlBar
        title={`${episode.episodeNumber}화 - ${episode.episodeTitle}`}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
      />

      <div className={`viewer-main ${bearOpen ? "shrink" : ""}`}>
        <span
          onClick={goToPreviousPage}
          className={`arrow-button ${isPrevDisabled ? "disabled" : ""}`}
        >
          〈
        </span>

        <section className="page left-page">
          {textWithLineBreaks(leftPage)}
        </section>
        <section className="page right-page">
          {textWithLineBreaks(rightPage)}
        </section>

        <span
          onClick={goToNextPage}
          className={`arrow-button ${isNextDisabled ? "disabled" : ""}`}
        >
          〉
        </span>
      </div>
    </div>
  );
}

// 텍스트 분할
function splitTextIntoPages(text, maxCharsPerPage = 500) {
  const paragraphs = text
    .trim()
    .split("\n")
    .filter((p) => p.trim() !== "");
  const pages = [];
  let currentPage = "";

  for (let para of paragraphs) {
    if ((currentPage + "\n" + para).length <= maxCharsPerPage) {
      currentPage += "\n" + para;
    } else {
      pages.push(currentPage.trim());
      currentPage = para;
    }
  }
  if (currentPage) pages.push(currentPage.trim());

  return pages;
}

// 줄바꿈 표시
function textWithLineBreaks(text) {
  const paragraphs = text.split(/\n\s*\n?/);
  return paragraphs.map((para, index) => (
    <p key={index} style={{ marginBottom: "1.5em", whiteSpace: "pre-line" }}>
      {para.trim()}
    </p>
  ));
}

export default Viewer;
