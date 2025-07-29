import './BearOverlay.css';
import SearchBar from './SearchBar';
import folderIcon from '../assets/folder.png';     // 작품 아이템에 사용할 폴더 아이콘
import messageIcon from '../assets/message.png';   // 하단 버튼에 사용할 메시지 아이콘

function BearOverlay() {
     
const title = [  // 작품 제목 목록
  '감자',
  '배따라기',
  '운수 좋은 날',
  '날개',
  '레디메이드 인생',
  '소나기',
  '광염 소나타',
  '메밀꽃 필 무렵',
  '고향',
  '태평천하',
  '불',
  'B사감과 러브레터',
  '치숙',
  '자기 앞의 생',
  '사하촌',
  '모범 경작생',
  '잃어버린 사람들',
  '사랑 손님과 어머니',
  '순이 삼촌',
  '무진기행'
];


  return (
    <div className="bear-overlay"> {/* 전체 오버레이 영역 */}
      
      <div className="bear-overlay-content">
        <h2 className="overlay-title">작품 목록</h2> {/* 상단 타이틀 */}
      </div>

      {/*  검색바 */}
      <div className="searchbar-box">
        <SearchBar placeholder="작품 검색" />
      </div>

      {/*  스크롤 가능한 작품 목록 영역 */}
      <div className="scrollable-work-list">
        {title.map((title, index) => (
          <div className="work-item" key={index}>
            <img src={folderIcon} alt="folder" className="folder-icon" />
            <span>{title}</span>
          </div>
        ))}
      </div>

      {/*  하단 고정 메시지 버튼 */}
      <div className="message-button-area">
        <button className="message-button">
          <img src={messageIcon} alt="message" className="message-icon" />
        </button>
      </div>

    </div>
  );
}

export default BearOverlay;
