import React, { useState } from "react";
import "./Viewer.css";

function ViewerPage({ fullText }) {
  const pages = splitTextIntoPages(fullText, 500);
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
    <div className="viewer-main">
      <span onClick={goToPreviousPage} className="arrow-button">
        〈
      </span>

      <section className="page left-page">
        {textWithLineBreaks(leftPage)}
      </section>
      <section className="page right-page">
        {textWithLineBreaks(rightPage)}
      </section>

      <span onClick={goToNextPage} className="arrow-button">
        〉
      </span>
    </div>
  );
}

function splitTextIntoPages(text, maxCharsPerPage = 800) {
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

function textWithLineBreaks(text) {
  const paragraphs = text.split(/\n\s*\n?/); // 한 줄 띄우기만 있어도 분리
  return paragraphs.map((para, index) => (
    <p key={index} style={{ marginBottom: "1.5em", whiteSpace: "pre-line" }}>
      {para.trim()}
    </p>
  ));
}

export default ViewerPage;
