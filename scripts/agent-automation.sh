#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

run_compuzone_full() {
  npm run crawl:compuzone:full -w @jhs-computer/agent
}

sync_compuzone_db() {
  npm run sync:compuzone:db -w @jhs-computer/agent -- --dir=../project/samples/compuzone/merged-for-db
}

sync_kjwwang_benchmark_db() {
  npm run parse:kjwwang:html -w @jhs-computer/agent
  npm run sync:kjwwang:benchmark-db -w @jhs-computer/agent -- --reset
}

sync_wanggapc_builds_db() {
  npm run crawl:wanggapc:html -w @jhs-computer/agent -- --limit=30 --delay-ms=1200 --out=../project/samples/wanggapc/html-30
  latest_dir="$(ls -td project/samples/wanggapc/html-30/* | head -1)"
  node JHSComputer_Agent/wanggapc/parse-products.mjs --input="$latest_dir" --out=project/samples/wanggapc/parsed-30
  npm run sync:wanggapc:builds-db -w @jhs-computer/agent
}

run_all_sync() {
  sync_compuzone_db
  sync_kjwwang_benchmark_db
  sync_wanggapc_builds_db
}

print_menu() {
  cat <<'MENU'

JHSComputer Agent Automation
1) Compuzone 전체 크롤링
2) Compuzone 상품 DB 적재
3) KJWWANG 게임 FPS DB 재적재
4) WANGGAPC 추천 PC 수집/DB 적재
5) DB 적재 전체 실행(Compuzone + KJWWANG + WANGGAPC)
6) 종료
MENU
}

if [[ "${1:-}" != "" ]]; then
  case "$1" in
    crawl-compuzone) run_compuzone_full ;;
    sync-compuzone) sync_compuzone_db ;;
    sync-benchmark) sync_kjwwang_benchmark_db ;;
    sync-wanggapc) sync_wanggapc_builds_db ;;
    sync-all) run_all_sync ;;
    *) echo "Unknown command: $1"; exit 1 ;;
  esac
  exit 0
fi

while true; do
  print_menu
  read -r -p "번호 선택: " choice
  case "$choice" in
    1) run_compuzone_full ;;
    2) sync_compuzone_db ;;
    3) sync_kjwwang_benchmark_db ;;
    4) sync_wanggapc_builds_db ;;
    5) run_all_sync ;;
    6) exit 0 ;;
    *) echo "잘못된 선택입니다." ;;
  esac
done
