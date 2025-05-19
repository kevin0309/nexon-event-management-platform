# Mock Game Management Platform

넥슨 이벤트 관리 플랫폼의 게임 서비스 Mock 서버

## 기능 설명

이 서비스는 실제 게임 서버를 대체하는 Mock 서버로, 다음과 같은 기능을 제공합니다:
- 이벤트 조건 검증 API (성공/실패 케이스)
- 이벤트 보상 지급 API (성공/실패 케이스)

## 기술 스택

- Express.js

## 환경 변수 설정

```env
# 서버 설정
MOCK_SERVER_PORT=4400
```

## API 엔드포인트

### 이벤트 조건 검증
- `POST /validate-event-condition/success` - 이벤트 조건 검증 성공 응답
- `POST /validate-event-condition/failed` - 이벤트 조건 검증 실패 응답

### 이벤트 보상 지급
- `POST /provide-event-reward/success` - 이벤트 보상 지급 성공 응답
- `POST /provide-event-reward/failed` - 이벤트 보상 지급 실패 응답

## 개발 환경 설정

```bash
# 의존성 설치
npm install

# 서버 실행
npm start
```

## Docker로 실행

```bash
# 이미지 빌드
docker build -t mock-game-platform .

# 컨테이너 실행
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  mock-game-platform
``` 