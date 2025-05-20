# Nexon Event Management Platform

## 프로젝트 개요
이 프로젝트는 입사지원자 박유현의 Nexon의 이벤트/보상 관리 플랫폼을 구현한 백엔드 과제입니다. 마이크로서비스 아키텍처(MSA)를 기반으로 하여 이벤트 생성, 보상 관리, 유저 보상 요청 등의 기능을 제공합니다.

### 레포지토리 구조
```
nexon-event-management-platform/
├── docker-compose.yml          # 로컬 개발 환경을 위한 Docker Compose 설정
├── .env                        # 공통 환경 변수 설정
├── README.md                   # 프로젝트 문서
└── services/                   # 각 마이크로서비스 디렉토리
    ├── auth-service/           # 인증 서비스
    │   ├── src/               # 소스 코드
    │   ├── package.json       # Node.js 프로젝트 설정 및 의존성 관리
    │   ├── Dockerfile         # 서비스별 Docker 설정
    │   └── README.md          # 서비스별 문서
    ├── event-service/         # 이벤트 서비스
    │   ├── src/
    │   ├── package.json
    │   ├── Dockerfile
    │   └── README.md
    ├── event-api-gateway-service/  # API Gateway 서비스
    │   ├── src/
    │   ├── package.json
    │   ├── Dockerfile
    │   └── README.md
    └── mock-game-management-platform/  # Mock 서버
        ├── src/
        ├── package.json
        ├── Dockerfile
        └── README.md
```

> **참고**: 
> - 이 레포지토리는 로컬 개발 및 테스트 환경을 위한 통합 설정을 포함하고 있습니다.
> - `services/` 디렉토리 하위의 각 서비스는 실제 운영 환경에서는 독립적인 레포지토리로 관리될 수 있습니다.
> - 각 서비스는 자체적인 소스 코드, Dockerfile, 문서를 포함하여 완전히 독립적으로 동작할 수 있습니다.
> - 각 서비스를 독립적으로 실행하기 위한 가이드는 README.md에 명시되어있습니다.
> - 현재는 개발 편의성을 위해 단일 레포지토리에서 관리되고 있으며, `docker-compose.yml`을 통해 로컬에서 통합 테스트가 가능합니다.

## API 문서
모든 API 문서는 Gateway 서비스의 Swagger UI를 통해 통합으로 제공됩니다:
- API 문서: `http://localhost:3000/api-docs`

API 문서에서는 다음 기능들을 확인할 수 있습니다:
- 인증 관련 API (회원가입, 로그인, 토큰 갱신)
- 이벤트 관리 API (생성, 조회, 수정)
- 보상 처리 API (요청, 조회)
- 각 API의 요청/응답 스키마
- Swagger UI를 통한 직접 API 테스트 기능 (Try it out 기능)
  - 각 API의 요청 파라미터를 직접 입력하여 테스트 가능
  - 인증이 필요한 API의 경우 로그인 후 발급받은 토큰을 입력하여 테스트 가능
  - 실제 서버에 요청을 보내고 응답을 즉시 확인 가능

## 기술 스택
- Node.js 18
- NestJS (최신 버전)
- MongoDB 6.0
- JWT (인증)
- Docker + docker-compose

## 서비스 아키텍처
프로젝트는 다음과 같은 4개의 서버로 구성되어 있습니다:

1. **Gateway Server** (`event-api-gateway-service`)
   - 모든 API 요청의 진입점
   - 인증 및 권한 검사
   - HTTP 기반의 서비스 간 요청 라우팅

> **참고**: 현재 서비스 간 통신은 HTTP 요청을 통해 동기적으로 이루어지고 있습니다. 향후 시스템 규모가 커지거나 비동기 처리가 필요한 경우(예: 대량의 보상 요청 처리, 실시간 알림 등), 메시지 브로커를 도입하여 이벤트 드리븐 아키텍처로 전환할 수 있습니다. 이를 통해 서비스 간 결합도를 낮추고, 확장성과 신뢰성을 높일 수 있습니다.

2. **Auth Server** (`auth-service`)
   - 유저 정보 관리
   - 로그인 처리
   - 역할(Role) 관리
   - JWT 발급

3. **Event Server** (`event-service`)
   - 이벤트 생성 및 관리
   - 보상 정의
   - 보상 요청 처리
   - 지급 상태 관리

4. **Mock Game Management Platform** (`mock-game-management-platform`)
   - 실제 게임 데이터 관리 플랫폼을 시뮬레이션하는 Mock 서버
   - 이벤트 관리 플랫폼과는 별개의 외부 시스템으로 가정
   - 게임 서비스의 이벤트 조건 검증 및 보상 지급 API를 모사
   - 테스트 및 개발 환경에서 실제 게임 서비스 연동 없이도 시스템 검증 가능

## 주요 기능

### 1. 이벤트 관리
- 운영자/관리자의 이벤트 생성
- 이벤트 목록 및 상세 조회
- 이벤트 상태 관리 (활성/비활성)

### 2. 보상 관리
- 이벤트별 보상 정의
- 다양한 보상 유형 지원 (포인트, 아이템, 쿠폰 등)
- 보상 수량 관리

### 3. 유저 보상 요청
- 이벤트 조건 충족 검증
  > 이벤트 관리 플랫폼은 이벤트 관리에만 집중하도록 설계되었습니다. 실제 유저의 게임 데이터(레벨, 접속일수 등)에 대한 검증은 외부 게임 서비스에 위임합니다. 이를 통해:
  > - 이벤트 플랫폼은 이벤트의 정의와 관리에만 집중할 수 있습니다.
  > - 게임 서비스는 자신의 도메인 데이터에 대한 검증 책임을 가집니다.
  > - 서비스 간 관심사가 명확히 분리되어 유지보수성이 향상됩니다.

- 이벤트 조건을 충족한 경우 보상 지급
  > 보상 지급 역시 외부 게임 서비스에 위임하여 구현했습니다.

- 보상 이력을 통한 중복 요청 방지 (동일 이벤트에 대한 중복 요청 차단)
- 요청 상태 기록

> **설계 의도**: 
> - 이벤트 조건과 보상은 MongoDB의 유연한 스키마를 활용하여 `desiredCondition`과 `reward` 필드를 상태(state)로 정의했습니다.
> - 이는 현재로서는 어떤 조건이나 보상의 종류가 필요한지 알 수 없기 때문에 좀 더 추상적인 의미로써 접근하기 위함입니다.
> - 상태 변경에 대한 비즈니스 로직(예: 레벨 10 달성, 3일 연속 접속 등)은 이벤트 플랫폼에서 구현하지 않고, 외부 게임 서비스에 위임합니다.
> - 이러한 설계를 통해 이벤트 플랫폼은 다양한 게임 서비스와 유연하게 연동되기를 의도하였습니다.

### 4. 보상 이력 관리
- 보상 요청 이력 저장 및 관리
  - 전체 이력 조회
  - 유저별 요청 이력 조회
- 보상 지급의 투명성과 추적성 보장
- 이력 데이터의 불변성(Immutability) 보장
  - 모든 이력은 생성 시점에 한 번만 기록 (Insert-only)
  - 생성된 이력은 수정/삭제 불가
  - 이력 변경이 필요한 경우 새로운 이력으로 추가

## 사용자 역할
시스템의 모든 API는 역할 기반 접근 제어(RBAC)를 통해 보호되며, 각 역할별로 다음과 같은 기능에 대한 접근이 제한됩니다:

- **USER**: 보상 요청 기능만 접근 가능
  - 이벤트 보상 요청 API 사용 가능
  - 자신의 보상 요청 이력 조회 가능

- **OPERATOR**: 이벤트/보상 관리 기능 접근 가능
  - 이벤트 생성, 조회, 수정 API 사용 가능
  - 활성 이벤트 관리 가능

- **AUDITOR**: 보상 이력 조회 기능만 접근 가능
  - 전체 보상 이력 조회 API 사용 가능
  - 유저별 보상 이력 조회 API 사용 가능

- **ADMIN**: 모든 기능에 대한 접근 권한 보유
  - 모든 API에 대한 접근 가능

## 🚀 실행 방법

### 1. 환경 설정
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 설정합니다:

```env
# Common
NODE_ENV=development
LOG_LEVEL=debug
PUBLIC_PORT=3000
JWT_SECRET=let-there-be-light

# MongoDB
MONGODB_PORT=27017
MONGODB_USER_NAME=developer
MONGODB_USER_PASSWORD=dev1234
MONGODB_DB_NAME=nexon-event-management-platform

# API Gateway Service
API_GW_SERVER_PORT=3100

# Auth Service
AUTH_SERVER_PORT=3200
JWT_EXPIRATION=1h
REFRESH_TOKEN_EXPIRATION=7d

# Event Service
EVENT_SERVER_PORT=3300

# Mock Server
MOCK_SERVER_PORT=3400
```

### 2. 서비스 실행
```bash
# 서비스 빌드 및 실행 (최초 실행 또는 코드 변경 시)
docker-compose up -d --build
```

### 3. 서버 포트 구성
| 서버 | 외부 접근 포트 | 내부 포트 | 설명 |
|------|--------------|-----------|------|
| Gateway | 3000 | 3100 | 외부에서 접근 가능한 API Gateway 포트 |
| Auth | - | 3200 | 내부 네트워크에서만 접근 가능 |
| Event | - | 3300 | 내부 네트워크에서만 접근 가능 |
| Mock Game | 3400 | 3400 | 테스트용 Mock 서버 (외부 접근 가능) |

> **참고**: 
> - 실제 서비스 접근은 Gateway 서버의 외부 포트(3000)를 통해서만 가능합니다.
> - Auth 서버와 Event 서버는 Docker 내부 네트워크에서만 접근 가능합니다.
> - Mock Game 서버는 테스트 목적으로 외부 포트(3400)가 직접 노출되어 있습니다.

## 🧑‍💼 테스트 계정 정보
서비스 실행 시 다음과 같은 테스트 계정이 자동으로 생성됩니다:

> **주의**: 
> - 테스트 계정은 서비스 시작 후 약 10초 후에 자동으로 생성됩니다.
> - 최초 실행 시에는 계정이 생성되기 전에 API를 호출하면 401 Unauthorized 에러가 발생할 수 있습니다.
> - 계정 생성이 완료될 때까지 잠시 기다린 후 API를 호출해 주세요.

| 역할 | 아이디 | 비밀번호 |
|------|--------|----------|
| 관리자 | admin | admin1234 |
| 운영자 | operator | operator1234 |
| 감사자 | auditor | auditor1234 |
| 일반 사용자 | user | user1234 |

## 🧪 API 테스트 시나리오

각 역할별로 다음과 같은 테스트 시나리오를 통해 시스템의 주요 기능을 검증할 수 있습니다.

### 1. 운영자(OPERATOR) 시나리오: 이벤트 생성 및 관리
```bash
# 1.1 운영자 계정으로 로그인
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "id": "operator",
    "password": "operator1234"
  }'
# 응답으로 받은 access_token을 저장

# 1.2 이벤트 생성
curl -X POST http://localhost:3000/event/create \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "신규 유저 환영 이벤트",
    "desiredCondition": {
      "level": 10,
      "loginDays": 3
    },
    "reward": {
      "itemId": "item_001",
      "amount": 100
    },
    "startDate": "2025-05-20T00:00:00.000Z",
    "endDate": "2025-05-20T23:59:59.999Z"
  }'

# 1.3 이벤트 목록 조회
curl -X GET http://localhost:3000/event/list/all \
  -H "Authorization: Bearer {access_token}"

# 1.4 활성 이벤트 조회
curl -X GET http://localhost:3000/event/list/active \
  -H "Authorization: Bearer {access_token}"

# 1.5 이벤트 상세 조회
curl -X GET http://localhost:3000/event/detail/{eventId} \
  -H "Authorization: Bearer {access_token}"

# 1.6 이벤트 수정
curl -X POST http://localhost:3000/event/update/{eventId} \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "신규 유저 환영 이벤트 (수정)",
    "desiredCondition": {
      "level": 15,
      "loginDays": 5
    },
    "reward": {
      "itemId": "item_002",
      "amount": 200
    },
    "startDate": "2025-05-20T00:00:00.000Z",
    "endDate": "2025-05-20T23:59:59.999Z",
    "isEnabled": true
  }'
```

### 2. 일반 사용자(USER) 시나리오: 보상 요청 및 이력 확인
```bash
# 2.1 사용자 계정으로 로그인
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "id": "user",
    "password": "user1234"
  }'
# 응답으로 받은 access_token을 저장

# 2.2 이벤트 보상 요청
# 1.2에서 생성된 이벤트의 ID를 활용할 수 있습니다.
# 이벤트 생성 응답의 data._id 필드에서 이벤트 ID를 확인할 수 있습니다.
curl -X POST http://localhost:3000/event/reward/request \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user",
    "eventId": "65f1a2b3c4d5e6f7g8h9i0j1"  # 1.2에서 생성된 이벤트의 ID로 교체
  }'

# 2.3 자신의 보상 이력 조회
curl -X GET http://localhost:3000/event/reward/list/user/user \
  -H "Authorization: Bearer {access_token}"
```

### 3. 감사자(AUDITOR) 시나리오: 보상 이력 감사
```bash
# 3.1 감사자 계정으로 로그인
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "id": "auditor",
    "password": "auditor1234"
  }'
# 응답으로 받은 access_token을 저장

# 3.2 전체 보상 이력 조회
curl -X GET http://localhost:3000/event/reward/list \
  -H "Authorization: Bearer {access_token}"

# 3.3 특정 사용자의 보상 이력 조회
curl -X GET http://localhost:3000/event/reward/list/user/user \
  -H "Authorization: Bearer {access_token}"
```

> **참고**: 
> - 각 API 요청 시 `{access_token}`을 실제 로그인 응답으로 받은 토큰으로 교체해야 합니다.
> - `{eventId}`는 실제 이벤트 ID로 교체해야 합니다.
> - 모든 API는 Gateway 서버(포트 3000)를 통해 접근합니다.
> - Swagger UI(`http://localhost:3000/api-docs`)에서도 동일한 테스트를 수행할 수 있습니다.
> - 각 API의 상세한 요청/응답 스펙은 Swagger UI에서 확인할 수 있습니다.

## 개발 가이드
1. 각 서비스는 독립적으로 개발 및 테스트가 가능합니다.
2. 서비스 간 통신은 Gateway Server를 통해 이루어집니다.
3. 인증은 JWT를 통해 처리되며, 모든 API 요청은 Gateway Server를 통해 검증됩니다.

각 마이크로서비스의 상세 개발 가이드는 해당 서비스 디렉토리의 README.md 파일에서 확인할 수 있습니다:
- `services/auth-service/README.md`: 인증 서비스 개발 가이드
- `services/event-service/README.md`: 이벤트 서비스 개발 가이드
- `services/event-api-gateway-service/README.md`: API Gateway 서비스 개발 가이드

각 서비스의 README에는 다음과 같은 정보가 포함되어 있습니다:
- 서비스의 주요 기능과 책임
- 개발 환경 설정 방법
- API 엔드포인트 상세 명세
- 테스트 실행 방법
- 서비스별 특이사항 및 주의사항

### 서비스 실행 오류 발생시
서비스가 정상적으로 시작되지 않는 경우:
```bash
# 서비스 상태 확인
docker-compose ps

# 서비스 로그 확인
docker-compose logs -f [service-name]

# 서비스 재시작
docker-compose restart [service-name]

# 모든 서비스 중지 및 컨테이너 삭제
docker-compose down

# 모든 서비스 중지, 컨테이너 삭제, 볼륨 삭제 (데이터 초기화)
docker-compose down -v

# 모든 서비스 중지, 컨테이너 삭제, 볼륨 삭제, 이미지 삭제 (완전 초기화)
docker-compose down -v --rmi all
```

> **참고**: 
> - `docker-compose down`: 실행 중인 컨테이너를 중지하고 삭제합니다.
> - `docker-compose down -v`: 컨테이너와 함께 볼륨도 삭제하여 데이터를 초기화합니다.
> - `docker-compose down -v --rmi all`: 컨테이너, 볼륨, 이미지를 모두 삭제하여 완전히 초기화합니다.
> - 완전 초기화 후에는 `docker-compose up --build`로 서비스를 다시 시작해야 합니다.
