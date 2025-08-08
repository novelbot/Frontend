// NovelDetail.jsx
import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import NovelCard from "./NovelCard";
import NovelEpisode from "./NovelEpisode";
import "./NovelDetail.css";
import { instance } from "/src/API/api";

const NovelDetail = () => {
  const location = useLocation();
  const { id } = useParams();

  const [novel, setNovel] = useState(location.state?.novel || null);
  const [loading, setLoading] = useState(!novel);

  useEffect(() => {
    if (!novel) {
      (async () => {
        try {
          const res = await instance.get(`/novels/${id}/episodes`);
          setNovel(res.data);
        } catch (e) {
          setNovel(null);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, novel]);

  if (loading) return <div>로딩중...</div>;
  if (!novel) return <div>해당 소설을 찾을 수 없습니다.</div>;

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

// import { useLocation } from "react-router-dom";
// import "./NovelDetail.css";
// import NovelCard from "./NovelCard";
// import NovelEpisode from "./NovelEpisode";

// const NovelDetail = () => {
//   const location = useLocation();
//   const novel = location.state?.novel; // 전달된 novel 정보

//   if (!novel) {
//     return <div>해당 소설을 찾을 수 없습니다.</div>;
//   }

//   return (
//     <div className="novel-detail-container">
//       <div className="novel-detail-left">
//         <NovelCard novel={novel} />
//       </div>
//       <div className="novel-detail-right">
//         <NovelEpisode novel={novel} />
//       </div>
//     </div>
//   );
// };

// export default NovelDetail;
