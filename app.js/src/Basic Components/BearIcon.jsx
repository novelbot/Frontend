// components/BearIcon.jsx
import './BearIcon.css';
import bearImg from '../assets/bear_down.png'; // 이미지 파일은 assets 폴더에 저장하세요.

function BearIcon() {
  return (  
    <div className="bear-icon">
      <img src={bearImg} alt="bear" />
    </div>
  );
}

export default BearIcon;
