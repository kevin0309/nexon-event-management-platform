# Event Service

넥슨 이벤트 관리 플랫폼의 이벤트 서비스

## 기능 설명

이 서비스는 이벤트 관리와 보상 처리를 담당하며, 다음과 같은 기능을 제공합니다:
- 이벤트 CRUD (생성, 조회, 수정)
- 이벤트 활성화 상태 관리
- 이벤트 보상 요청 처리
  - 이벤트 유효성 검증 (기간, 활성화 상태)
  - 외부 API를 통한 조건 검증
  - 외부 API를 통한 보상 지급
  - 보상 처리 결과 로깅

## 기술 스택

- NestJS
- MongoDB (Mongoose)
- Winston (로깅)
- Axios (외부 API 통신)

## 환경 변수 설정

서비스 실행에 필요한 환경 변수들입니다. `.env` 파일을 프로젝트 루트에 생성하여 설정할 수 있습니다:

```env
# 서버 설정
EVENT_SERVER_PORT=3000

# 데이터베이스 설정
MONGODB_URI=mongodb://localhost:27017/event-management

# 외부 API 설정
EVENT_VALIDATION_URL=http://validation-api-url
EVENT_REWARD_URL=http://reward-api-url

# 로깅 설정
LOG_LEVEL=info            # 로그 레벨 (debug, info, warn, error)
```

| 변수 | 설명 | 기본값 | 필수 |
|------|------|--------|------|
| `EVENT_SERVER_PORT` | 서비스 포트 번호 | `3000` | No |
| `MONGODB_URI` | MongoDB 연결 문자열 | - | Yes |
| `EVENT_VALIDATION_URL` | 이벤트 조건 검증 API URL | - | Yes |
| `EVENT_REWARD_URL` | 보상 지급 API URL | - | Yes |
| `LOG_LEVEL` | 로그 레벨 | `info` | No |

## 주요 특징

- 이벤트 기간과 활성화 상태 기반의 유효성 검증
- 외부 API를 통한 유연한 조건 검증과 보상 지급
- 상세한 보상 처리 로깅
- 일관된 에러 처리와 응답 형식
- 구조화된 로깅 (Winston)

## API 엔드포인트

### 이벤트 관리
- `POST /events/create` - 이벤트 생성
- `GET /events/list/all` - 모든 이벤트 조회
- `GET /events/list/active` - 활성화된 이벤트 조회
- `GET /events/detail/:id` - 단일 이벤트 조회
- `POST /events/update/:id` - 이벤트 정보 수정

### 보상 처리
- `POST /event-rewards/request` - 이벤트 보상 요청
- `GET /event-rewards/list` - 모든 보상 로그 조회
- `GET /event-rewards/list/user/:userId` - 사용자별 보상 로그 조회

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
docker build -t event-service .
```

### 컨테이너 실행
```bash
# 환경 변수 직접 지정
docker run -d \
  -p 3000:3000 \
  -e MONGODB_URI=your-mongodb-uri \
  -e EVENT_VALIDATION_URL=your-validation-api-url \
  -e EVENT_REWARD_URL=your-reward-api-url \
  event-service

# .env 파일 사용
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  event-service
```