// api/prerender.js
export default async function handler(req, res) {
  const { url } = req.query;
  const PRERENDER_TOKEN = process.env.PRERENDER_TOKEN || 'TCgx9MijlwMxRLwUgAIC';
  const userAgent = req.headers['user-agent'] || '';

  // 常見爬蟲 UA 關鍵字
  const botPattern = /bot|crawl|slurp|spider|bing|google|duckduck|baidu|yandex|sogou|exabot|facebot|ia_archiver/i;

  if (botPattern.test(userAgent)) {
    // 是爬蟲，代理到 prerender.io
    try {
      const response = await fetch(`https://service.prerender.io/${url}`, {
        headers: {
          'X-Prerender-Token': PRERENDER_TOKEN
        }
      });
      const html = await response.text();
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(html);
    } catch {
      res.status(500).json({ error: 'Prerender failed' });
    }
  } else {
    // 一般使用者，直接導回原始頁面
    res.writeHead(302, { Location: url });
    res.end();
  }
}