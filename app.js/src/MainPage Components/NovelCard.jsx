import './NovelCard.css';
import coverImage from '../assets/25. 먼길 표지.png';
import heartImg from '../assets/heart.png';

const NovelCard = () => {
  return (
    <div className="novel-card">
      <div className="novel-card-image-wrapper">
        <img
          className="novel-card-foreground"
          src={coverImage}
          alt="소설 표지"
        />
      </div>

      <h2 className="novel-card-title">먼길</h2>
      <p className="novel-card-meta">일상, 드라마 | 김인숙</p>

      <div className="novel-card-description">
        <h2>줄거리</h2>
        <p>바다에 대한 깊은 트라우마를 가진 한영은, 감정을 숨긴 채 정체불명의 친구 명우와 함께 낚싯배에 오른다. 소나기 예보와 거친 파도, 그리고 서로가 감추고 있는 속내 속에서, 그들은 점점 바다의 깊은 이면과 마주하게 된다.</p>
      </div>

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
