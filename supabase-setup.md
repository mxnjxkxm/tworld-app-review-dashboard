# 🔗 Supabase 연결 정보 가이드

## 📍 현재 상황
- ✅ GitHub 저장소: https://github.com/mxnjxkxm/tworld-app-review-dashboard
- ✅ 코드 업로드 완료
- ⏳ Supabase 연결 정보 필요

## 🔍 Supabase 연결 문자열 찾기

### 1. Supabase 대시보드 접속
- https://supabase.com/dashboard
- 생성한 프로젝트 클릭

### 2. 데이터베이스 설정으로 이동
- 좌측 메뉴 > Settings > Database

### 3. Connection string 복사
- "Connection string" 섹션 찾기
- "URI" 탭 선택
- 문자열 복사 (예시):
```
postgresql://postgres.abc123def456:tworldappreview@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
```

### 4. 비밀번호 확인
- `[YOUR-PASSWORD]` 부분이 `tworldappreview`로 되어있는지 확인
- 만약 `[YOUR-PASSWORD]`로 되어있다면 `tworldappreview`로 교체

## 🎯 예상 연결 문자열 형태
```
postgresql://postgres.[PROJECT-ID]:tworldappreview@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
```

## 📋 다음 단계
연결 문자열을 복사하시면:
1. 환경변수 업데이트
2. Vercel 배포 자동 실행
3. 데이터베이스 마이그레이션
4. 완료! 🚀

**연결 문자열을 알려주시면 나머지를 자동으로 처리하겠습니다!**
