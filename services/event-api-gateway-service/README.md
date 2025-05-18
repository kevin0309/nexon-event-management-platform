# Event Management Platform - API Gateway Service

이벤트 관리 플랫폼의 API Gateway 서비스입니다. 이 서비스는 클라이언트의 요청을 받아 적절한 마이크로서비스로 라우팅하는 역할을 합니다.

## 기능

- 인증/인가 서비스와의 연동
  - 회원가입
  - 로그인
  - 토큰 갱신

## 기술 스택

- NestJS
- TypeScript
- Axios (HTTP 클라이언트)
- Swagger (API 문서화)

## 설치 및 실행

### 로컬 환경

1. 의존성 설치
```bash
npm install
```

2. 환경 변수 설정
`.env` 파일을 생성하고 다음 내용을 설정하세요:
```
API_GW_SERVER_PORT=3000
AUTH_SERVICE_URL=http://localhost:3001
```

3. 개발 서버 실행
```bash
npm run start:dev
```

4. 프로덕션 빌드
```bash
npm run build
npm run start:prod
```

### Docker 환경

1. Docker 이미지 빌드
```bash
docker build -t event-api-gateway-service .
```

2. Docker 컨테이너 실행
```bash
docker run -d \
  -p 3000:3000 \
  -e API_GW_SERVER_PORT=3000 \
  -e AUTH_SERVICE_URL=http://auth-service:3001 \
  --name event-api-gateway \
  event-api-gateway-service
```

## API 문서

서버 실행 후 다음 URL에서 Swagger API 문서를 확인할 수 있습니다:
```
http://localhost:3000/api-docs
```
