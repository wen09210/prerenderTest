import type { VercelRequest, VercelResponse } from '@vercel/node';

const PRERENDER_TOKEN = process.env.PRERENDER_TOKEN || '';

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!PRERENDER_TOKEN) {
      console.error('PRERENDER_TOKEN is not set');
      res.status(500).send('PRERENDER_TOKEN is not set');
      return;
    }
    const url = req.url || '/';
    const prerenderUrl = `https://service.prerender.io${url}`;
    res.setHeader('X-Prerender-Token', PRERENDER_TOKEN);
    res.redirect(prerenderUrl);
  } catch (err) {
    console.error('Prerender function error:', err);
    res.status(500).send('Internal Server Error');
  }
}
