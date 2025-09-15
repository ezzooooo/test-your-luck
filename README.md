# 🎲 Test Your Luck - 동전 던지기 게임

Vue 3와 Firebase를 활용한 웹 기반 동전 던지기 게임입니다. 플레이어는 동전의 앞면/뒷면을 예측하고, 승패에 따라 MMR 점수를 획득하거나 잃을 수 있습니다.

## 🎮 게임 규칙

- **시작 MMR**: 10,000점
- **게임 방식**: 동전의 앞면/뒷면 예측
- **점수 변동**: 승리/패배 시 15~25점 랜덤 변동
- **데이터 저장**: Google Firebase를 통한 실시간 데이터 동기화
- **랭킹 시스템**: 전체 플레이어 대비 상위 퍼센트 표시

## 🚀 주요 기능

- ✅ 닉네임 설정 및 게임 시작
- ✅ 동전 던지기 애니메이션
- ✅ 실시간 MMR 점수 관리
- ✅ Firebase를 통한 데이터 저장 및 동기화
- ✅ 랭킹 시스템 및 상위 퍼센트 표시
- ✅ 반응형 웹 디자인

## 🛠 기술 스택

- **Frontend**: Vue 3 + TypeScript + Vite
- **상태 관리**: Pinia
- **라우팅**: Vue Router
- **데이터베이스**: Google Firebase Firestore
- **인증**: Firebase Authentication
- **배포**: GitHub Actions
- **스타일링**: CSS3 + 반응형 디자인

## 📦 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── GameBoard.vue   # 게임 보드 컴포넌트
│   ├── CoinFlip.vue    # 동전 던지기 애니메이션
│   ├── ScoreBoard.vue  # 점수 표시
│   └── Ranking.vue     # 랭킹 시스템
├── views/              # 페이지 컴포넌트
│   ├── HomeView.vue    # 메인 페이지
│   ├── GameView.vue    # 게임 페이지
│   └── RankingView.vue # 랭킹 페이지
├── stores/             # Pinia 스토어
│   ├── game.ts         # 게임 상태 관리
│   ├── user.ts         # 사용자 정보 관리
│   └── ranking.ts      # 랭킹 데이터 관리
├── services/           # API 서비스
│   └── firebase.ts     # Firebase 설정 및 서비스
└── utils/              # 유틸리티 함수
    └── gameLogic.ts    # 게임 로직 함수
```

## 🚀 시작하기

### 1. 프로젝트 클론 및 의존성 설치

```bash
git clone <repository-url>
cd test-your-luck
npm install
```

### 2. Firebase 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. Firestore Database 활성화
3. Authentication 설정 (익명 로그인 활성화)
4. `src/services/firebase.ts`에 Firebase 설정 정보 추가

```typescript
// src/services/firebase.ts
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  // Firebase 설정 정보 입력
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 프로덕션 빌드

```bash
npm run build
```

## 🎯 게임 플레이 방법

1. **닉네임 설정**: 게임 시작 전 닉네임을 입력합니다
2. **동전 선택**: 앞면(Head) 또는 뒷면(Tail) 중 하나를 선택합니다
3. **동전 던지기**: "동전 던지기" 버튼을 클릭하여 게임을 진행합니다
4. **결과 확인**: 동전의 결과에 따라 승패가 결정됩니다
5. **점수 확인**: 승리 시 15~25점 획득, 패배 시 15~25점 차감
6. **랭킹 확인**: 현재 랭킹과 상위 퍼센트를 확인할 수 있습니다

## 🔧 개발 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 타입 체크
npm run type-check

# 린트 검사 및 수정
npm run lint

# 코드 포맷팅
npm run format

# 단위 테스트 실행
npm run test:unit
```

## 📱 배포

GitHub Actions를 통한 자동 배포가 설정되어 있습니다:

1. `main` 브랜치에 푸시
2. 자동으로 빌드 및 배포 실행
3. 배포된 사이트에서 게임 플레이 가능

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.
