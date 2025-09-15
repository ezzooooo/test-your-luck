# 배포 가이드

## GitHub Pages 배포

이 프로젝트는 GitHub Actions를 사용하여 자동으로 GitHub Pages에 배포됩니다.

### 설정 방법

1. **GitHub Repository 설정**
   - GitHub에 프로젝트를 푸시합니다
   - Settings → Pages → Source를 "GitHub Actions"로 설정합니다

2. **Firebase 환경 변수 설정**
   - GitHub Repository → Settings → Secrets and variables → Actions
   - 다음 시크릿들을 추가해야 합니다:
     ```
     VITE_FIREBASE_API_KEY
     VITE_FIREBASE_AUTH_DOMAIN
     VITE_FIREBASE_PROJECT_ID
     VITE_FIREBASE_STORAGE_BUCKET
     VITE_FIREBASE_MESSAGING_SENDER_ID
     VITE_FIREBASE_APP_ID
     ```

3. **Firebase 프로젝트 설정**
   - Firebase Console에서 프로젝트 생성
   - Authentication → Sign-in method → Google 활성화
   - Firestore Database 생성 및 보안 규칙 설정
   - Authorized domains에 GitHub Pages 도메인 추가:
     ```
     username.github.io
     ```

### 자동 배포

- `master` 브랜치에 푸시할 때마다 자동으로 배포됩니다
- GitHub Actions 탭에서 배포 상태를 확인할 수 있습니다
- 배포 완료 후 `https://username.github.io/test-your-luck/`에서 접속 가능합니다

### 수동 배포

```bash
# 빌드
npm run build

# 로컬에서 빌드 결과 확인
npm run preview
```

### 문제 해결

1. **404 오류**: SPA 라우팅을 위한 `404.html` 파일이 포함되어 있습니다
2. **Firebase 오류**: `.env.production` 파일의 환경 변수를 확인하세요
3. **CORS 오류**: Firebase Console에서 Authorized domains 설정을 확인하세요

### 프로덕션 URL

배포 완료 후 다음 URL에서 접속할 수 있습니다:
`https://[your-username].github.io/test-your-luck/`