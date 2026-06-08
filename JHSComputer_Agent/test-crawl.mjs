import iconv from 'iconv-lite';

async function test() {
  const url = 'https://www.compuzone.co.kr/product/product_detail_ajax.php?actype=getProductDetail&productNo=1108538';
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const html = iconv.decode(Buffer.from(buffer), 'EUC-KR');
  
  const imgMatch = html.match(/https?:\/\/[^'"]+(product_img_detail|product_detail)[^'"]+/g);
  console.log("Images for 1108538:", imgMatch ? [...new Set(imgMatch)] : "None");
}

test();
