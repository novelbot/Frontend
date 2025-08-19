import "./NovelCard.css";
import heartImg from "/src/assets/heart.png";

const NovelCard = ({ novel }) => {
  if (!novel) return <div>오류 발생</div>;
  const { novelId, title, author, description, genre, coverImageUrl } = novel;
  return (
    <div className="novel-info">
      {/*  소설 표지 이미지 */}
      <div className="novel-info-image-wrapper">
        {coverImageUrl && (
          <img
            className="novel-info-foreground"
            src={coverImageUrl}
            alt={`${title} 표지`}
          />
        )}
      </div>
        
      {/*  제목 + 장르/작가 정보 */}
      <h2 className="novel-info-title">{title}</h2>
      <p className="novel-info-meta">
        {genre} | {author}
      </p>
      {/*  줄거리 설명 */}
      <div className="novel-info-description">
        <h2>줄거리</h2>
        <p>{description}</p>
      </div>
      {/* ▶ 첫 화 보기 +  좋아요 버튼 */}
      <div className="novel-info-buttons">
        <button className="start-button">첫 화 보기</button>
        <button className="like-button">
          <img src={heartImg} alt="좋아요" className="like-icon" />
        </button>
      </div>
    </div>
  );
};

export default NovelCard;
