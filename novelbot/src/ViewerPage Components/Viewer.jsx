import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./Viewer.css";
import { dummyEpisodes } from "../data/episodeData";
import ViewerControlBar from "./ViewerControlBar";

function Viewer() {
  const { id, number } = useParams();

  const episode = dummyEpisodes.find(
    (ep) =>
      String(ep.id) === String(id) && String(ep.number) === String(number)
  );

  if (!episode) {
    return (
      <div style={{ textAlign: "center", marginTop: "4rem", color: "#444" }}>
        에피소드를 찾을 수 없습니다.
      </div>
    );
  }

  const pages = splitTextIntoPages(episode.content, 500);
  const [pageIndex, setPageIndex] = useState(0);

  const leftPage = pages[pageIndex] || "";
  const rightPage = pages[pageIndex + 1] || "";

  const goToNextPage = () => {
    if (pageIndex + 2 < pages.length) {
      setPageIndex(pageIndex + 2);
    }
  };

  const goToPreviousPage = () => {
    if (pageIndex - 2 >= 0) {
      setPageIndex(pageIndex - 2);
    }
  };


  return (
    <div className="viewer-container">
      {/* ✅ 헤더는 최상단에 */}
      <ViewerControlBar title={`${episode.number}화 - ${episode.title}`} />

      {/* ✅ 본문 뷰어는 따로 */}
      <div className="viewer-main">
        <span onClick={goToPreviousPage} className="arrow-button">〈</span>

        <section className="page left-page">
          {textWithLineBreaks(leftPage)}
        </section>
        <section className="page right-page">
          {textWithLineBreaks(rightPage)}
        </section>

        <span onClick={goToNextPage} className="arrow-button">〉</span>
      </div>
    </div>
  );
}

// 텍스트를 페이지 단위로 분할
function splitTextIntoPages(text, maxCharsPerPage = 800) {
  const paragraphs = text.trim().split("\n").filter((p) => p.trim() !== "");
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

// 줄바꿈 포함한 단락 표시
function textWithLineBreaks(text) {
  const paragraphs = text.split(/\n\s*\n?/);
  return paragraphs.map((para, index) => (
    <p key={index} style={{ marginBottom: "1.5em", whiteSpace: "pre-line" }}>
      {para.trim()}
    </p>
  ));
}

export default Viewer;
