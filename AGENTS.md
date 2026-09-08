# JHSComputer2

정효성 TV 기반 PC 견적·구매 플랫폼. NestJS + TypeORM + MySQL + Next.js + Docker 홈서버 배포.

프로젝트 전체 컨텍스트는 `CONTEXT.md`를 먼저 읽어라.

## Agent skills

### Issue tracker

Issues live in GitHub Issues on `github.com/junans0boi/JHSComputer2`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` at the repo root plus `docs/adr/`. See `docs/agents/domain.md`.

## Mandatory feature-change workflow

For every feature addition, behavior change, or non-trivial bug fix, follow this order before implementation:

1. **Wayfinder map** — For work that spans more than one focused session, create or continue one GitHub issue labelled `wayfinder:map`; use child issues for unresolved decisions and keep blocking edges explicit.
2. **Requirements alignment and domain documentation** — Run `grill-with-docs` (`grilling` + `domain-modeling`) first. Ask the decision frontier, use the project glossary, and update `CONTEXT.md` and an ADR when a hard-to-reverse or surprising trade-off is settled.
3. **Specification** — Run `to-spec`. Write the user-facing problem, extensive user stories, implementation decisions, testing decisions, and out-of-scope items, then publish the spec to GitHub with `ready-for-agent`.
4. **Ticket decomposition** — Run `to-tickets`. Split the spec into demoable vertical tracer bullets, publish one issue per ticket, and record real blocking relationships.
5. **Implementation** — Run `implement` from the approved frontier. Use `tdd` at agreed public seams, run focused typechecks/tests continuously, and run the full validation suite before handoff.
6. **Independent review** — Run `code-review` against the agreed fixed point before committing. Report Standards and Spec findings separately and resolve material findings before the commit.
7. **Architecture maintenance** — Run `improve-codebase-architecture` at the start/end of each multi-ticket effort and whenever repeated friction appears. Produce the required visual report, then grill the selected deepening opportunity before changing architecture.

Do not begin implementation while the required map/spec/ticket decisions are unresolved. If the user delegates decisions, use the documented recommended option and record that decision instead of silently skipping the stage. Preserve unrelated dirty-worktree changes; never reset or discard them. Every new session must re-read `CONTEXT.md`, relevant `docs/adr/` files, the active Wayfinder map, and the current ticket before continuing.
