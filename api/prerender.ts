// api/prerender.js
export default async function handler(req, res) {
  const url = req.query.url
  const PRERENDER_TOKEN = process.env.PRERENDER_TOKEN || 'TCgx9MijlwMxRLwUgAIC';

  if (!url) {
    res.status(400).send('Missing url query parameter')
    return
  }

  const userAgent = req.headers['user-agent'] || ''
  const botPattern = /bot|crawl|slurp|spider|bing|google|duckduck|baidu|yandex|sogou|exabot|facebot|ia_archiver/i

  if (botPattern.test(userAgent)) {
    // 爬蟲 → fetch prerender.io
    try {
      const response = await fetch(`https://service.prerender.io/${url}`, {
        headers: { 'X-Prerender-Token': PRERENDER_TOKEN }
      })
      const html = await response.text()
      res.setHeader('Content-Type', 'text/html')
      res.status(200).send(html)
    } catch (err) {
      console.error(err)
      res.status(500).send('Prerender fetch failed')
    }
  } else {
    // 一般使用者 → redirect 原始 SPA
    res.writeHead(307, { Location: url })
    res.end()
  }
}
