import type { VercelRequest, VercelResponse } from '@vercel/node';

const PRERENDER_TOKEN = 'TCgx9MijlwMxRLwUgAIC';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const userAgent = req.headers['user-agent'] || '';
  const isBot = /bot|crawler|spider|crawling/i.test(String(userAgent));

  if (isBot) {
    const prerenderUrl = `https://service.prerender.io${req.url}`;
    res.setHeader('X-Prerender-Token', PRERENDER_TOKEN);
    res.redirect(prerenderUrl);
  } else {
    // 不是 bot，正常處理
    res.status(404).send('Not found');
  }
}
