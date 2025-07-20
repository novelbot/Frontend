import './NovelDetail.css';
import NovelCard from './NovelCard';
import NovelEpisode from './NovelEpisode';

const NovelDetail = () => {
  return (
    <div className="novel-detail-container">
      <div className="novel-detail-left">
        <NovelCard />
      </div>
      <div className="novel-detail-right">
        <NovelEpisode />
      </div>
    </div>
  );
};

export default NovelDetail;
