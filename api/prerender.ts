import type { VercelRequest, VercelResponse } from '@vercel/node';

const PRERENDER_TOKEN = process.env.PRERENDER_TOKEN || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!PRERENDER_TOKEN) {
      console.error('PRERENDER_TOKEN is not set');
      res.status(500).send('PRERENDER_TOKEN is not set');
      return;
    }
    const userAgent = req.headers['user-agent'] || '';
    const isBot = /bot|crawler|spider|crawling/i.test(userAgent);

    if (isBot) {
      const url = req.url || '/';
      const prerenderUrl = `https://service.prerender.io${url}`;
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
