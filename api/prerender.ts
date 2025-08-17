import type { VercelRequest, VercelResponse } from '@vercel/node';

const PRERENDER_TOKEN = 'TCgx9MijlwMxRLwUgAIC';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const prerenderUrl = `https://service.prerender.io${req.url}`;
  res.setHeader('X-Prerender-Token', PRERENDER_TOKEN);
  res.redirect(prerenderUrl);
}
