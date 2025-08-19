import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("X-Debug", "rewrite-hit");
  res.status(200).json({
    message: "✅ Rewrite triggered",
    userAgent: req.headers["user-agent"],
    originalUrl: req.url
  });
}
