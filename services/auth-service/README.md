# Auth Service

넥슨 이벤트 관리 플랫폼의 인증 서비스

## 기능 설명

이 서비스는 사용자 인증과 권한 관리를 담당하며, 다음과 같은 기능을 제공합니다:
- 사용자 등록 및 로그인 (JWT 기반)
- 토큰 갱신 메커니즘
- 역할 기반 접근 제어 (RBAC)
  - USER: 보상 요청 가능
  - OPERATOR: 이벤트/보상 등록
  - AUDITOR: 보상 이력 조회만 가능
  - ADMIN: 시스템 전체 접근 권한

## 기술 스택

- NestJS
- MongoDB
- JWT (JSON Web Token)
- Passport.js
- bcrypt (비밀번호 해싱)

## 환경 변수 설정

서비스 실행에 필요한 환경 변수들입니다. `.env` 파일을 프로젝트 루트에 생성하여 설정할 수 있습니다:

```env
# 서버 설정
AUTH_SERVER_PORT=3000

# 데이터베이스 설정
MONGODB_URI=mongodb://localhost:27017/nexon-event-mgmt

# JWT 설정
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=3600        # 액세스 토큰 만료 시간 (초)
REFRESH_TOKEN_EXPIRATION=604800  # 리프레시 토큰 만료 시간 (초)

# 로깅 설정
LOG_LEVEL=info            # 로그 레벨 (debug, info, warn, error)
```

| 변수 | 설명 | 기본값 | 필수 |
|------|------|--------|------|
| `AUTH_SERVER_PORT` | 서비스 포트 번호 | `3000` | No |
| `MONGODB_URI` | MongoDB 연결 문자열 | - | Yes |
| `JWT_SECRET` | JWT 토큰 생성에 사용되는 비밀 키 | - | Yes |
| `JWT_EXPIRATION` | 액세스 토큰 만료 시간 (초) | `3600` | No |
| `REFRESH_TOKEN_EXPIRATION` | 리프레시 토큰 만료 시간 (초) | `604800` | No |
| `LOG_LEVEL` | 로그 레벨 | `info` | No |

## 보안 특징

- 비밀번호는 bcrypt를 사용하여 해시화 (salt rounds: 10)
- JWT 기반의 안전한 인증
- 리프레시 토큰을 통한 액세스 토큰 갱신
- 역할 기반의 세분화된 접근 제어

## API 엔드포인트

### 인증 관련
- `POST /auth/register` - 사용자 등록
- `POST /auth/login` - 사용자 로그인
- `POST /auth/refresh-token` - 액세스 토큰 갱신

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
docker build -t auth-service .
```

### 컨테이너 실행
```bash
# 환경 변수 직접 지정
docker run -d \
  -p 3000:3000 \
  -e MONGODB_URI=your-mongodb-uri \
  -e JWT_SECRET=your-jwt-secret \
  -e JWT_EXPIRATION=3600 \
  -e REFRESH_TOKEN_EXPIRATION=604800 \
  auth-service

# .env 파일 사용
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  auth-service
```
