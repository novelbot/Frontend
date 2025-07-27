// App.jsx
import { useState } from "react";
import "./App.css";
import Header from "./Basic Components/Header";
import NovelDetail from "./MainPage Components/NovelDetail";
import BearIcon from "./Basic Components/BearIcon";
import NovelList from "./NovelListPage Components/NovelList";
import Viewer from "./ViewerPage Components/Viewer";
import ViewerControl from "./ViewerPage Components/ViewerControlBar";

function App() {
  const [currentPage, setCurrentPage] = useState("novelList");
  const [selectedNovel, setSelectedNovel] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  const handleSelectNovel = (novel) => {
    setSelectedNovel(novel);
    setCurrentPage("detail");
  };

  const handleEpisodeClick = (episode) => {
    setSelectedEpisode(episode);
    setCurrentPage("viewer");
  };
  return (
    <>
      <Header onNavigate={setCurrentPage} />
      {currentPage === "novelList" && (
        <NovelList onSelectNovel={handleSelectNovel} /> // 여기에 함수 전달
      )}
      {currentPage === "novelDetail" && (
        <>
          <NovelDetail novel={selectedNovel} />
          <BearIcon />
        </>
      )}
      {currentPage === "detail" && selectedNovel && (
        <>
          <NovelDetail
            novel={selectedNovel}
            handleEpisodeClick={handleEpisodeClick}
          />
          <BearIcon />
        </>
      )}
      {currentPage === "viewer" && selectedEpisode && (
        <>
          <ViewerControl
            title={`${selectedEpisode.number}화: ${selectedEpisode.title}`}
          />
          <Viewer fullText={selectedEpisode.content} />
          <BearIcon />
        </>
      )}
    </>
  );
}

export default App;
