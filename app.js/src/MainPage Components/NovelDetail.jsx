import "./NovelDetail.css";
import NovelCard from "./NovelCard";
import NovelEpisode from "./NovelEpisode";

const NovelDetail = ({ novel }) => {
  return (
    <div className="novel-detail-container">
      {/* 전체 상세 페이지 레이아웃 */}
      <div className="novel-detail-left">
        {/* 왼쪽: 소설 카드 정보 */}
        <NovelCard novel={novel} />
      </div>
      <div className="novel-detail-right">
        {/* 오른쪽: 에피소드 목록 */}
        <NovelEpisode novel={novel} />
      </div>
    </div>
  );
};

export default NovelDetail;
