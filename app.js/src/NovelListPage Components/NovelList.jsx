// src/MainPage Components/NovelList.jsx
import React from "react";
import "./NovelList.css";
import cover1 from "./exampleAssets/01_젊은느티나무표지.png";
import cover2 from "./exampleAssets/02_백치 아다다 표지.png";
import cover3 from "./exampleAssets/03_카프카를 읽는 밤 표지.png";
import cover4 from "./exampleAssets/04_강아지똥 표지.png";
import cover5 from "./exampleAssets/05_등신불 표지.png";
import cover6 from "./exampleAssets/06_바위 표지.png";
import cover7 from "./exampleAssets/25_먼길 표지.png";

const novels = [
  {
    title: "젊은 느티나무",
    author: "강신재",
    genre: "멜로, 청춘",
    image: cover1,
    description:
      "겉으로는 평화롭고 단정한 가족의 일상 속, 소녀의 마음속에 피어오르는 감정은 누구에게도 말할 수 없는 비밀이다. 순수한 일상과 함께 깊어지는 마음의 혼란, 그 끝에서 주인공은 무엇을 선택하게 될까. 아름답고도 금기된 사랑, 그 감정의 무게를 섬세하게 그려낸 청춘의 기록.",
  },
  {
    title: "백치 아다다",
    author: "계용묵",
    genre: "단편 소설",
    image: cover2,
    description:
      "벙어리로 태어난 아다다는 누구보다 성실하고 순박했지만, 가족과 사회는 그녀를 따뜻하게 받아들이지 않았다. 그러나 그녀는 끝까지 사랑을 갈구하며 삶의 자리를 찾아 나아간다. 그녀의 이야기는, 우리가 잊고 있던 인간다움에 대해 조용히 질문을 던진다.",
  },
  {
    title: "카프카를 읽는 밤",
    author: "구효서",
    genre: "현대문학, 심리소설, 로맨스",
    image: cover3,
    description:
      "낯선 땅, 낯선 사람. 어느 땅에도 완전히 속하지 못한 이들이 조용히 스쳐가듯 만나고, 문학과 침묵 사이에서 서로의 내면에 작은 흔적을 남긴다. 모든 경계 위에 선 이 밤, 우리는 왜 글을 쓰는가, 왜 기억하려 하는가.",
  },
  {
    title: "강아지 똥",
    author: "권정생",
    genre: "동화",
    image: cover4,
    description:
      "더럽고 하찮다고 여겨졌던 강아지똥. 하지만 조용한 골목길에서 만난 작고 따뜻한 이야기들은 그를 조금씩 바꾸어 간다. 진정한 쓰임이란, 어디에서 오는 것일까?",
  },
  {
    title: "등신불(等身佛)",
    author: "김동리",
    genre: "현대 단편 소설, 사실주의, 비극",
    image: cover5,
    description:
      "모진 세월, 마음 깊은 곳에 남은 건 고통일까, 믿음일까. 한 사내와 한 여인이 만난 이 고요한 절터엔 말보다 깊은 침묵과 사연이 맴돈다. 구원의 손길은 때론 가장 비천한 곳에서 시작된다.",
  },
  {
    title: "바위",
    author: "김동리",
    genre: "현대 단편 소설, 사실주의, 비극",
    image: cover6,
    description:
      "마을 어귀의 커다란 바위, 사람들은 그것을 ‘복바위’라 부른다. 누군가는 거기서 복을 빌고, 누군가는 잃어버린 것을 되찾으려 간절히 손을 얹는다. 그 바위를 향한 한 여인의 애절한 이야기, 그 끝은 말할 수 없이 조용하다",
  },
  {
    title: "먼 길",
    author: "김인숙",
    genre: "일상, 드라마",
    image: cover7,
    description:
      "바다에 대한 깊은 트라우마를 가진 한영은, 감정을 숨긴 채 정체불명의 친구 명우와 함께 낚싯배에 오른다. 소나기 예보와 거친 파도, 그리고 서로가 감추고 있는 속내 속에서, 그들은 점점 바다의 깊은 이면과 마주하게 된다.",
  },
];

const NovelList = ({ onSelectNovel }) => {
  return (
    <div className="novel-list-container">
      <h3>웹소설</h3>
      <div className="novel-grid">
        {novels.map((novel, index) => (
          <div
            key={index}
            className="novel-card"
            onClick={() => onSelectNovel(novel)}
            style={{ cursor: "pointer" }}
          >
            <img src={novel.image} alt={novel.title} className="novel-image" />
            <div className="novel-overlay">
              <h4>{novel.title}</h4>
              <p>
                {novel.genre} · {novel.author}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NovelList;
