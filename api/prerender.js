export default async function handler(req, res) {
  const PRERENDER_TOKEN = process.env.PRERENDER_TOKEN || 'TCgx9MijlwMxRLwUgAIC';
  
  // 從 query 參數取得路徑（由 vercel.json rewrite 傳入）
  let path = req.query.path;
  
  // 處理路徑格式
  if (Array.isArray(path)) {
    path = path.join('/');
  }
  if (!path || path.trim() === "") {
    path = "/";
  }
  // 確保路徑以 / 開頭
  if (!path.startsWith('/')) {
    path = '/' + path;
  }

  const host = req.headers["host"];
  const fullUrl = `https://${host}${path}`;

  const userAgent = req.headers["user-agent"] || "";
  const botPattern = /bot|crawl|slurp|spider|bing|google|duckduck|baidu|yandex|sogou|exabot|facebot|ia_archiver/i;

  console.log(`[Prerender] UA: ${userAgent}`);
  console.log(`[Prerender] Path: ${path}`);
  console.log(`[Prerender] Full URL: ${fullUrl}`);

  // if (botPattern.test(userAgent)) {
    // 爬蟲 → fetch prerender.io
    try {
      const response = await fetch(`https://service.prerender.io/${fullUrl}`, {
        headers: { "X-Prerender-Token": PRERENDER_TOKEN },
      });
      
      if (!response.ok) {
        throw new Error(`Prerender.io responded with ${response.status}`);
      }
      
      const html = await response.text();
      console.log(`[Prerender] Success: ${fullUrl}`);

      res.setHeader("Content-Type", "text/html");
      res.status(200).send(html);
      
    } catch (err) {
      console.error("[Prerender] Fetch failed:", err);
      
      // 發生錯誤時，重導向到原始頁面
      res.redirect(307, path);
    }
  // } else {
  //   // 一般使用者 → 重導向到實際頁面
  //   console.log(`[Prerender] Non-bot request, redirect to: ${path}`);
  //   res.redirect(307, path);
  // }
}