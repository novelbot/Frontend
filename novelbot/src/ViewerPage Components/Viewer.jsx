import React, { useState } from "react";
import "./Viewer.css";

function ViewerPage({ fullText }) {
  const pages = splitTextIntoPages(fullText, 800);
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
      <button onClick={goToPreviousPage} className="arrow-button">
        ←
      </button>

      <section className="page left-page">
        {textWithLineBreaks(leftPage)}
      </section>
      <section className="page right-page">
        {textWithLineBreaks(rightPage)}
      </section>

      <button onClick={goToNextPage} className="arrow-button">
        →
      </button>
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
  const lines = text.split(/\n/);
  const elements = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === "") {
      // 빈 줄: 두 줄 띄우기
      elements.push(<br key={`br1-${i}`} />);
      elements.push(<br key={`br2-${i}`} />);
    } else {
      elements.push(
        <React.Fragment key={i}>
          {lines[i]}
          <br />
        </React.Fragment>
      );
    }
  }

  return elements;
}

export default ViewerPage;
