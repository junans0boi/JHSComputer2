# JHSComputer2

정효성 TV PC 구매 플랫폼 MVP입니다.

## 구조

- `JHSComputer_DataBase`: NestJS 기반 MySQL 세팅 프로젝트
- `JHSComputer_Server`: NestJS + TypeORM + MySQL API
- `JHSComputer_Frontend`: Next.js App Router 웹
- `JHSComputer_Agent`: 컴퓨존/다나와 크롤링 및 샘플 분석 도구
- `project/docs`: Claude / Codex 공용 기획, DB, API, ADR, 진행 문서

## 개발 시작

```bash
npm install
npm run dev:api
npm run dev:web
```

DB는 서버 #3의 `data.hollywood.kro.kr` MySQL을 사용하고, 개발 중에는 `jhs_computer_dev`에 연결합니다.

서버 #3 최초 DB 세팅:

```bash
cd JHSComputer_DataBase
cp .env.server.example .env.server
npm run db:bootstrap:server
```

로컬 Docker MySQL을 쓸 때만 아래 명령을 사용합니다.

```bash
npm run db:up
npm run db:reset
```

환경변수는 `.env.example` 또는 `JHSComputer_DataBase/.env.server.example`을 기준으로 만들어 사용합니다.

Docker daemon이 켜져 있어야 `db:up`과 `db:reset`을 실행할 수 있습니다.
