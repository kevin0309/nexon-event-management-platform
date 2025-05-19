# Event API Gateway Service

넥슨 이벤트 관리 플랫폼의 API 게이트웨이 서비스

## 기능 설명

이 서비스는 클라이언트와 백엔드 서비스들 사이의 중개자 역할을 하며, 다음과 같은 기능을 제공합니다:
- 인증/인가 처리 (JWT 검증, 역할 기반 접근 제어)
- 요청 라우팅 (Auth Service, Event Service로의 요청 전달)
- API 요청/응답 변환 및 통합
- 클라이언트에 대한 단일 진입점 제공

## 기술 스택

- NestJS
- JWT (JSON Web Token)
- Passport.js
- Axios (마이크로서비스 통신)
- Winston (로깅)

## 환경 변수 설정

서비스 실행에 필요한 환경 변수들입니다. `.env` 파일을 프로젝트 루트에 생성하여 설정할 수 있습니다:

```env
# 서버 설정
NODE_ENV=development
API_GW_SERVER_PORT=4100

# 인증 설정
JWT_SECRET=let-there-be-light

# 마이크로서비스 URL
AUTH_SERVICE_URL=http://localhost:4200
EVENT_SERVICE_URL=http://localhost:4300

# 로깅 설정
LOG_LEVEL=debug            # 로그 레벨 (debug, info, warn, error)
```

| 변수 | 설명 | 기본값 | 필수 |
|------|------|--------|------|
| `NODE_ENV` | 실행 환경 | `development` | No |
| `API_GW_SERVER_PORT` | 서비스 포트 번호 | `4100` | No |
| `JWT_SECRET` | JWT 토큰 검증에 사용되는 비밀 키 | - | Yes |
| `AUTH_SERVICE_URL` | 인증 서비스 URL | - | Yes |
| `EVENT_SERVICE_URL` | 이벤트 서비스 URL | - | Yes |
| `LOG_LEVEL` | 로그 레벨 | `debug` | No |

## 주요 특징

- JWT 기반의 인증/인가 처리
- 역할 기반 접근 제어 (RBAC)
  - USER: 보상 요청 가능
  - OPERATOR: 이벤트/보상 등록
  - AUDITOR: 보상 이력 조회만 가능
  - ADMIN: 시스템 전체 접근 권한
- 마이크로서비스 간 통신 관리
- 요청/응답 변환 및 통합
- 구조화된 로깅

## API 엔드포인트

### 인증 관련
- `POST /auth/register` - 사용자 등록
- `POST /auth/login` - 사용자 로그인
- `POST /auth/refresh-token` - 액세스 토큰 갱신

### 이벤트 관리
- `POST /event/create` - 이벤트 생성
- `GET /event/list/all` - 모든 이벤트 조회
- `GET /event/list/active` - 활성화된 이벤트 조회
- `GET /event/detail/:id` - 단일 이벤트 조회
- `POST /event/update/:id` - 이벤트 정보 수정

### 보상 처리
- `POST /event/reward/request` - 이벤트 보상 요청
- `GET /event/reward/list` - 모든 보상 로그 조회
- `GET /event/reward/list/user/:userId` - 사용자별 보상 로그 조회

## 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run start:dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start:prod
```

## Docker로 실행

### 이미지 빌드
```bash
docker build -t event-api-gateway-service .
```

### 컨테이너 실행
```bash
# 환경 변수 직접 지정
docker run -d \
  -p 3000:3000 \
  -e JWT_SECRET=your-jwt-secret \
  -e AUTH_SERVICE_URL=your-auth-service-url \
  -e EVENT_SERVICE_URL=your-event-service-url \
  event-api-gateway-service

# .env 파일 사용
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  event-api-gateway-service
```
