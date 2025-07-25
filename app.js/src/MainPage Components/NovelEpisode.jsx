import { useState } from 'react';
import './NovelEpisode.css';
import downIcon from '../assets/down.png';
import coverImage from '../assets/25. 먼길 표지.png';

// 더미 에피소드 목록 (썸네일 포함)
const dummyEpisodes = [
  { id: 25, number: 1, date: '25.01.01', title: '여명의 파도', thumbnail: coverImage },
  { id: 25, number: 2, date: '25.01.08', title: '흔들리는 것들', thumbnail: coverImage },
  { id: 25, number: 3, date: '25.01.15', title: '비명의 바다', thumbnail: coverImage },
  { id: 25, number: 4, date: '25.01.22', title: '먼 길', thumbnail: coverImage },
  { id: 25, number: 5, date: '25.01.29', title: '이방인의 기록', thumbnail: coverImage },
  { id: 25, number: 6, date: '25.02.05', title: '은빛의 고요, 붉은 그림자', thumbnail: coverImage },
  { id: 25, number: 7, date: '25.02.12', title: '가시고기들은 그물에 갇혀', thumbnail: coverImage },
  { id: 25, number: 8, date: '25.02.19', title: '먼 길 끝, 아무도 없는 방', thumbnail: coverImage },
  { id: 25, number: 9, date: '25.02.26', title: '나만의 자리', thumbnail: coverImage },
  { id: 25, number: 10, date: '25.03.04', title: '폭풍 속의 노래', thumbnail: coverImage },
  { id: 25, number: 11, date: '25.03.11', title: '숨고픈 땅', thumbnail: coverImage },
  { id: 25, number: 12, date: '25.03.18', title: '난민의 길, 잃어버린 땅', thumbnail: coverImage },
  { id: 25, number: 13, date: '25.03.25', title: '새벽 세 시', thumbnail: coverImage },
];

const EPISODES_PER_BATCH = 4;

const NovelEpisode = () => {
  const [sortOrder, setSortOrder] = useState('asc');                  // 정렬 기준: asc 또는 desc
  const [visibleCount, setVisibleCount] = useState(EPISODES_PER_BATCH); // 현재 보여줄 에피소드 수

  // 정렬된 에피소드 배열 생성
  const sortedEpisodes = [...dummyEpisodes].sort((a, b) =>
    sortOrder === 'asc' ? a.number - b.number : b.number - a.number
  );

  // 화면에 보여줄 에피소드만 추출
  const visibleEpisodes = sortedEpisodes.slice(0, visibleCount);

  // 더보기 버튼 클릭 시 에피소드 수 증가
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + EPISODES_PER_BATCH);
  };

  // 정렬 버튼 클릭 시 기준 변경 및 목록 초기화
  const handleSortChange = (order) => {
    setSortOrder(order);
    setVisibleCount(EPISODES_PER_BATCH);
  };

  return (
    <div className="novel-episode">
      <h2 className="episode-title">먼길</h2>

      {/* 정렬 버튼: 첫화부터 / 최신화부터 */}
      <div className="episode-controls">
        <button
          className={`sort-button ${sortOrder === 'asc' ? 'active' : ''}`}
          onClick={() => handleSortChange('asc')}
        >
          첫화부터
        </button>
        <button
          className={`sort-button ${sortOrder === 'desc' ? 'active' : ''}`}
          onClick={() => handleSortChange('desc')}
        >
          최신화부터
        </button>
      </div>

      {/* 전체 에피소드 수 표시 */}
      <p className="episode-count">전체 {dummyEpisodes.length}</p>

      {/* 에피소드 카드 목록 */}
      <div className="episode-list">
        {visibleEpisodes.map((episode) => (
          <div className="episode-card" key={episode.id + '-' + episode.number}>
            <img src={episode.thumbnail} alt="썸네일" />
            <div className="episode-info">
              <p className="episode-date">{episode.date}</p>
              <p className="episode-title-text">{episode.title}</p>
            </div>
            <div className="episode-meta">
              <span>{episode.number}화</span>
              <button className="free-badge">무료</button>
            </div>
          </div>
        ))}
      </div>

      {/* 더보기 버튼: 아직 보여줄 에피소드가 남았을 경우에만 표시 */}
      {visibleCount < dummyEpisodes.length && (
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
  