// NovelDetail.jsx
import { useParams } from "react-router-dom";
import "./NovelDetail.css";
import NovelCard from "./NovelCard";
import NovelEpisode from "./NovelEpisode";
import { novels } from "/src/data/novelData";

const NovelDetail = () => {
  const { id } = useParams();

  const novel = novels.find(
    (n) => n.id === id || n.title.replace(/\s+/g, "") === id
  );

  if (!novel) {
    return <div>해당 소설을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="novel-detail-container">
      <div className="novel-detail-left">
        <NovelCard novel={novel} />
      </div>
      <div className="novel-detail-right">
        <NovelEpisode novel={novel} />
      </div>
    </div>
  );
};

export default NovelDetail;
