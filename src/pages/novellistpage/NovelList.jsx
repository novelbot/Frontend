// src/mainpage/NovelList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NovelList.css";
import NovelCard from "./NovelCard";
import { instance } from "../../API/api";

const NovelList = () => {
  const [novelList, setNovelList] = useState([]);

  useEffect(() => {
    const getNovelList = async () => {
      try {
        const res = await instance.get("/novels");
        const data = res.data;
        setNovelList(data); // 상태에 저장
      } catch (err) {
        console.error("소설 목록 불러오기 실패:", err);
      }
    };

    getNovelList();
  }, []);

  return (
    <div className="novel-list-container">
      <h3>웹소설</h3>
      <div className="novel-grid">
        {novelList.map((novel) => (
          <NovelCard
            key={novel.novelId}
            title={novel.title}
            genre={novel.genre}
            author={novel.author}
            imageUrl={novel.coverImageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default NovelList;

// const NovelList = () => {
//   const [novelList, setNovelList] = useState([]);
//   const navigate = useNavigate();

//   const handleCardClick = (id) => {
//     navigate(`/MainPage/${id}`);
//   };

//   useEffect(() => {
//     const getNovelList = async () => {
//       try {
//         const res = await instance.get("/novels");
//         setNovelList(res.data);
//       } catch (err) {
//         console.error("소설 목록 불러오기 실패:", err);
//       }
//     };

//     getNovelList();
//   }, []);

//   return (
//     <div className="novel-list-container">
//       <h3>웹소설</h3>
//       <div className="novel-grid">
//         {novelList.map((novel) => (
//           <div
//             key={novel.novelId}
//             onClick={() => handleCardClick(novel.novelId)}
//           >
//             <NovelCard
//               title={novel.title}
//               genre={novel.genre}
//               author={novel.author}
//               imageUrl={novel.coverImageUrl}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
