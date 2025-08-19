
// api/prerender.js
export default async function handler(req, res) {
  const { url } = req.query
  const PRERENDER_TOKEN = process.env.PRERENDER_TOKEN || 'TCgx9MijlwMxRLwUgAIC';

  try {
    const response = await fetch(`https://service.prerender.io/${url}`, {
      headers: {
        'X-Prerender-Token': PRERENDER_TOKEN
      }
    })
    
    const html = await response.text()
    res.setHeader('Content-Type', 'text/html')
    res.status(200).send(html)
  } catch {
    res.status(500).json({ error: 'Prerender failed' })
  }
}