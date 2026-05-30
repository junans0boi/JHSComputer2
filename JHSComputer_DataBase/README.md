# JHSComputer_DataBase

정효성 TV PC 구매 플랫폼의 MySQL 데이터베이스 세팅 프로젝트다.

이 프로젝트는 SQL 파일을 기준으로 DB를 만들고, NestJS standalone 앱이 SQL을 순서대로 실행한다.

## 서버 #3 DB 구성

서버 #3 DB 인스턴스에는 아래 세 DB를 만든다.

| DB | 용도 |
|---|---|
| `jhs_computer_dev` | 로컬 개발용 |
| `jhs_computer_stage` | 배포 테스트용 |
| `jhs_computer_prod` | 실제 운영용 |

개발 중에는 기본적으로 `jhs_computer_dev`만 사용한다. `stage/prod`는 미리 만들어두되, 앱 연결 정보에서 사용하지 않는다.

주의: `https://data.hollywood.kro.kr/`는 웹 URL 표기이고, MySQL 연결에는 `DB_HOST=data.hollywood.kro.kr`, `DB_PORT=3306`처럼 TCP 호스트/포트를 사용한다.

## 실행 방식

루트에서 실행:

```bash
npm run db:up
npm run db:reset
```

`db:reset`은 `jhs_computer_dev`만 삭제 후 다시 만든다. `stage/prod`는 reset 대상이 아니다.

DB/계정 생성은 NestJS 실행기가 환경변수 기준으로 처리하고, schema/seed SQL은 아래 순서로 적용된다.

```txt
01_schema.sql
02_indexes.sql
03_seed_master.sql
04_seed_games.sql
```

`00_create_database.sql`은 예전 단일 DB 생성 SQL을 대체한 안내용 placeholder다.

## 서버 #3 최초 세팅

```bash
cd JHSComputer_DataBase
cp .env.server.example .env.server
# .env.server 안의 root/dev/stage/prod 비밀번호를 실제 값으로 수정
npm run db:bootstrap:server
```

`db:bootstrap:server`는 `jhs_computer_dev`, `jhs_computer_stage`, `jhs_computer_prod`와 각 DB 전용 계정을 만들고, 현재 schema/seed SQL을 모두 적용한다.

## 직접 실행

```bash
cd JHSComputer_DataBase
npm run db:apply:dev
npm run db:reset:dev
npm run db:apply:stage
npm run db:apply:prod
```

`db:reset:dev`는 `DB_ENV=production`이거나 DB 이름이 `_dev`로 끝나지 않으면 실행을 거부한다.

## 환경 변수

서버 세팅용은 `.env.server.example`, 로컬 개발 연결용은 `.env.local.example`을 참고한다.

```txt
DB_HOST=data.hollywood.kro.kr
DB_PORT=3306
DB_ROOT_USERNAME=root
DB_ROOT_PASSWORD=change_me_root_password
DB_ENV=development
DB_TARGET=dev

DB_DEV_DATABASE=jhs_computer_dev
DB_DEV_USERNAME=jhs_dev
DB_DEV_PASSWORD=change_me_dev_password

DB_STAGE_DATABASE=jhs_computer_stage
DB_STAGE_USERNAME=jhs_stage
DB_STAGE_PASSWORD=change_me_stage_password

DB_PROD_DATABASE=jhs_computer_prod
DB_PROD_USERNAME=jhs_prod
DB_PROD_PASSWORD=change_me_prod_password
```

## 원칙

- SQL 파일이 DB 구조의 기준이다.
- 백엔드 TypeORM Entity는 이 SQL 기준을 따라간다.
- 로컬 개발 초기화는 `npm run db:reset`으로 한다. 이 명령은 dev DB만 대상으로 한다.
- 운영 반영은 `npm run db:apply:prod`처럼 idempotent SQL만 적용하고, destructive reset은 금지한다.
