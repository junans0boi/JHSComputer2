import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const productNo = request.nextUrl.searchParams.get('productNo');
  if (!productNo || !/^\d+$/.test(productNo)) {
    return NextResponse.json({ error: 'productNo required' }, { status: 400 });
  }

  const urls = [
    `https://www.compuzone.co.kr/product/product_detail.htm?ProductNo=${productNo}`,
    `https://www.compuzone.co.kr/product/product_detail_ajax.php?actype=getProductDetail&productNo=${productNo}`,
    `https://www.compuzone.co.kr/product/product_detail_ajax.php?actype=getGraphicProductDetail&productNo=${productNo}`,
    `https://www.compuzone.co.kr/product/product_detail_ajax.php?actype=getIworksProductDetail&productNo=${productNo}`,
  ];

  const htmlParts: string[] = [];
  try {
    for (const url of urls) {
      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
          Referer: 'https://www.compuzone.co.kr/',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'ko-KR,ko;q=0.9',
        },
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        htmlParts.push(await res.text());
      }
    }
  } catch {
    return NextResponse.json({ images: [] });
  }

  const pattern =
    /https?:\/\/image\d*\.compuzone\.co\.kr\/img\/(?:product_img_detail|pr_early_image)\/[^"'\s>)]+\.(?:jpg|jpeg|png|gif|webp)/gi;
  const matches = htmlParts.join('\n').match(pattern) ?? [];
  const images = [...new Set(matches)];

  return NextResponse.json({ images });
}
