![header](https://capsule-render.vercel.app/api?type=waving&color=A0C4F2&height=150&section=header&text=NovelBot&fontSize=50&animation=none&fontColor=FFFFFF)
# Novel Bot이란?

### 개발 배경
웹소설 독자들은 작품을 보다가 궁금한 점이 생기면 이전 화를 직접 찾아보거나, 댓글로 질문을 남겨 다른 독자의 답변을 기다려야 했습니다.  
이 과정에서 원치 않는 스포일러를 접할 위험이 크고, 많은 시간이 소요되었습니다.  
또한 기존 플랫폼의 검색 기능은 단순 키워드 매칭에 불과해 맥락을 이해한 정확한 답변을 제공하지 못했습니다.  

이러한 불편함은 단순한 사용자 경험 문제를 넘어,  
- 독자의 중도 이탈 증가  
- 작가의 창작 의욕 저하  
- 플랫폼 수익 감소  

와 같은 웹소설 산업 전반의 성장 저해 요인이 되고 있습니다.

### 개발 목적
**NovelBot**은 이러한 문제를 근본적으로 해결하기 위해 기획되었습니다.  
우리의 목표는 **웹소설 독자가 마치 개인 비서를 두고 있는 것처럼, 언제든 작품에 대한 궁금증을 즉시 해결할 수 있는 AI 시스템**을 제공하는 것입니다.

### 장점
Novel Bot의 주요 장점은 아래와 같습니다.
- 맥락 기반의 지능형 답변 시스템  
- 완벽한 스포일러 방지 메커니즘  
- 즉각적이고 정확한 정보 제공  
- 경제적이고 확장 가능한 솔루션  

# 기술 스택
프론트앤드 기술 스택과 개발환경은 아래와 같습니다.

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=white) 
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) 
![VS Code](https://img.shields.io/badge/VisualStudioCode-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white)

- **React 19.1.0** / **Vite 7.0.4**
- React Router, Axios, WebSocket (STOMP.js)
- HTTPS 로컬 개발 환경
- ESLint 코드 품질 관리

### 🚀설치 및 실행 방법🚀

#### 1. 사전 준비물

- Node.js **≥ 18** (권장: 20 LTS) / npm **≥ 9**
- Git
- 로컬 HTTPS 개발용 인증서  

#### 2. 프로젝트 받기 & 의존성 설치
```
git clone https://github.com/novelbot/Frontend.git
cd <YOUR_REPO_DIR>
npm install   # 또는 npm ci
```

#### 3. 환경 변수(.env) 설정
프로젝트 루트에 `.env`파일을 만들고 아래 예시를 채워 넣습니다.
```
VITE_BASE_URL=https://api.novelbot.org
```

#### 4. 로컬 HTTPS 설정
- macOS
```
brew install mkcert nss
mkcert -install
mkcert localhost 127.0.0.1 ::1
```
- Windows (Chocolatey)
```
choco install mkcert
mkcert -install
mkcert localhost 127.0.0.1 ::1
```
생성된 키/인증서를 프로젝트 루트에 두고(또는 `vite.config.js` 경로에 맞춤), 파일명을 `localhost+2-key.pem` / `localhost+2.pem` 으로 맞추거나 Vite 설정에서 경로를 수정하세요.

#### 5. Vite 개발 서버 설정 예시
`vite.config.js`가 다음과 유사한지 확인하세요.
```
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ESM 환경에서 __dirname 구현
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "localhost+2-key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "localhost+2.pem")),
    },
  },
  plugins: [react()],
  define: {
    global: "window", // Node의 global을 브라우저 window로 매핑
  },
});
```

#### 6. 실행
```
npm run dev      # 개발 서버 실행 (기본: https://localhost:5173)
```

# 프로젝트 구조
```bash
├─node_modules      # 프로젝트 의존성 모듈
│  
└─src               # 소스 코드
    │  App.css  
    │  App.jsx      # 메인 App 컴포넌트
    │  index.css
    │  main.jsx
    ├─api           # API 관련 함수
    ├─assets        # 정적 자산: 이미지, 아이콘 등
    ├─components    # 공용 컴포넌트: 헤더, 검색바, 곰돌이, 채팅창
    └─pages
        ├─cartpage  # 장바구니 페이지 (미사용)
        ├─loginpage # 로그인 페이지
        ├─mainpage  # 메인 페이지
        ├─mypage    # 마이 페이지
        ├─novellistpage # 소설 목록 페이지
        └─viewerpage    # 뷰어 페이지
```

# 팀 소개: 한소리
| 역할   | 이름   | 전공 | 담당 |
|--------|--------|------|------|
| 팀장   | 임성혁 | 동국대학교 컴퓨터공학과 | RAG |
| 팀원   | 이정진 | 동국대학교 컴퓨터공학과 | 백엔드 & 프론트엔드 |
| 팀원   | 김지후 | 동국대학교 컴퓨터공학전공 | 백엔드 |
| 팀원   | 류재훈 | 동국대학교 컴퓨터공학전공 | 프론트엔드 |
| 팀원   | 오정인 | 동국대학교 컴퓨터공학전공 | 프론트엔드 |


![header](https://capsule-render.vercel.app/api?type=venom&color=A0C4F2&height=150&section=header&text=Thank%20You!&fontSize=40&animation=none)
