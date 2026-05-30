# 컴퓨존 샘플 수집 데이터

이 폴더는 DB 설계를 확정하기 위한 저빈도 샘플 수집 결과를 저장한다.

## 실행

```bash
npm run crawl:compuzone:samples
npm run crawl:compuzone:samples -- --categories=CPU,GPU --pages=1 --details=2
npm run crawl:compuzone:samples -- --preset=core --pages=1 --details=0 --delay-ms=2000
```

## 원칙

- 기본값은 CPU 1페이지 + 상세 2개만 수집한다.
- 운영용 전체 크롤러가 아니라 DB 구조 확정용 샘플러다.
- 리스트는 `/product/product_list.php` POST 응답을 사용한다.
- 상세 페이지는 상품 가격 검증/스펙 보강 샘플로만 일부 요청한다.
- 외부 사이트 정책, 차단 리스크, 요청 속도 제한은 운영 전 별도 검토한다.
