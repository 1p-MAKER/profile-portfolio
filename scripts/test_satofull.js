// Native fetch is available in Node 18+

async function test() {
    const url = 'https://www.satofull.jp/products/detail.php?product_id=1488880';
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const html = await res.text();
        console.log('Status:', res.status);

        const getMetaContent = (prop) => {
            const regex = new RegExp(`<meta property="${prop}" content="([^"]*)"`, 'i');
            const match = html.match(regex);
            if (match) return match[1];

            const regex2 = new RegExp(`<meta name="${prop}" content="([^"]*)"`, 'i');
            const match2 = html.match(regex2);
            return match2 ? match2[1] : null;
        };

        console.log('og:title:', getMetaContent('og:title'));
        console.log('og:image:', getMetaContent('og:image'));
        console.log('og:site_name:', getMetaContent('og:site_name'));
        console.log('title tag:', (html.match(/<title>([^<]*)<\/title>/i) || [])[1]);

        // Log a chunk of HTML to see if there are encoding issues or different quotes
        console.log('Head chunk:', html.substring(0, 2000));

    } catch (e) {
        console.error(e);
    }
}

test();
