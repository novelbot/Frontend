import './NovelCard.css';
import coverImage from '../assets/25. 먼길 표지.png';
import heartImg from '../assets/heart.png';

// 소설 정보 변수로 분리
const title = '먼길';
const author = '김인숙';
const genre = '일상, 드라마';
const description = `바다에 대한 깊은 트라우마를 가진 한영은, 감정을 숨긴 채 정체불명의 친구 명우와 함께 낚싯배에 오른다. 소나기 예보와 거친 파도, 그리고 서로가 감추고 있는 속내 속에서, 그들은 점점 바다의 깊은 이면과 마주하게 된다.`;
const coverImageUrl = coverImage;

const NovelCard = () => {
  return (
    <div className="novel-card"> {/* 전체 카드 영역 */}

      {/*  소설 표지 이미지 */}
      <div className="novel-card-image-wrapper">
        <img
          className="novel-card-foreground"
          src={coverImageUrl}
          alt="소설 표지"
        />
      </div>

      {/*  제목 + 장르/작가 정보 */}
      <h2 className="novel-card-title">{title}</h2>
      <p className="novel-card-meta">{genre} | {author}</p>

      {/*  줄거리 설명 */}
      <div className="novel-card-description">
        <h2>줄거리</h2>
        <p>{description}</p>
      </div>

      {/* ▶ 첫 화 보기 +  좋아요 버튼 */}
      <div className="novel-card-buttons">
        <button className="start-button">첫 화 보기</button>
        <button className="like-button">
          <img src={heartImg} alt="좋아요" className="like-icon" />
        </button>
      </div>

    </div>
  );
};

export default NovelCard;
