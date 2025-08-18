import type { VercelRequest, VercelResponse } from '@vercel/node';

const PRERENDER_TOKEN = process.env.PRERENDER_TOKEN || 'TCgx9MijlwMxRLwUgAIC';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!PRERENDER_TOKEN) {
      console.error('PRERENDER_TOKEN is not set');
      res.status(500).send('PRERENDER_TOKEN is not set');
      return;
    }
    const userAgent = req.headers['user-agent'] || '';
    const isBot = /bot|crawler|spider|crawling/i.test(userAgent);
    console.log('User-Agent:', userAgent);
    console.log('isBot:', isBot);

    if (isBot) {
      // 取得 query string 的 url 參數，預設為首頁
      const url = (req.query && req.query.url) ? String(req.query.url) : '/';
      const prerenderUrl = `https://service.prerender.io${url}`;
      console.log('Proxying to:', prerenderUrl);
      const prerenderRes = await fetch(prerenderUrl, {
        headers: {
          'X-Prerender-Token': PRERENDER_TOKEN,
        },
      });
      const body = await prerenderRes.text();
      res.status(prerenderRes.status).send(body);
    } else {
      res.status(404).send('Not Found');
    }
  } catch (err) {
    console.error('Prerender function error:', err);
    res.status(500).send('Internal Server Error');
  }
}
