# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root — 프로젝트 전체 컨텍스트 (사업 배경, 기술 스택, 현재 상태, DB 설계, API 구성)
- **`docs/adr/`**: read ADRs that touch the area you're about to work in.

If any of these files don't exist, **proceed silently**.

## File structure

Single-context repo:

```
/
├── CONTEXT.md
├── CLAUDE.md
├── AGENTS.md
├── docs/adr/
│   └── *.md
├── JHSComputer_DataBase/
├── JHSComputer_Server/
├── JHSComputer_Frontend/
└── JHSComputer_Agent/
```

## Use the glossary's vocabulary

When your output names a domain concept, use the term as defined in `CONTEXT.md`. Key terms for this repo:

- **표준 부품** (`parts`): 견적에 사용하는 정규화된 부품 단위
- **공급처 상품** (`supplier_products`): 컴퓨존·다나와 등 외부 판매 단위
- **견적** (`quotes`): live 상태 (최신 가격 반영)
- **주문** (`orders`): snapshot 상태 (주문 시점 고정)
- **추천 구성** (`recommendation_posts`): 검수된 빌드 콘텐츠

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly:

> _Contradicts ADR-00X (...), but worth reopening because…_
