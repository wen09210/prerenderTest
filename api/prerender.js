export default async function handler(req, res) {
  const PRERENDER_TOKEN = process.env.PRERENDER_TOKEN || 'TCgx9MijlwMxRLwUgAIC';
  
  let path = req.url.replace(/^\/api\/prerender/, "");

  // 如果 path 是空字串，就補成 "/"
  if (!path || path.trim() === "") {
    path = "/";
  }

  const host = req.headers["host"];
  const fullUrl = `https://${host}${path}`;

  const userAgent = req.headers["user-agent"] || "";
  const botPattern =
    /bot|crawl|slurp|spider|bing|google|duckduck|baidu|yandex|sogou|exabot|facebot|ia_archiver/i;

  console.log(`[Prerender] UA: ${userAgent}`);
  console.log(`[Prerender] Full URL: ${fullUrl}`);

  if (botPattern.test(userAgent)) {
    // 爬蟲 → fetch prerender.io
    try {
      const response = await fetch(`https://service.prerender.io/${fullUrl}`, {
        headers: { "X-Prerender-Token": PRERENDER_TOKEN },
      });
      const html = await response.text();

      console.log(`[Prerender] Success: ${fullUrl}`);

      res.setHeader("Content-Type", "text/html");
      res.status(200).send(html);
    } catch (err) {
      console.error("[Prerender] Fetch failed:", err);
      res.status(500).send("Prerender fetch failed");
    }
  } else {
    // 一般使用者 → 回 SPA (其實不會進來，因為 rewrite 只針對 bot)
    console.log(`[Prerender] Non-bot request, bypass: ${fullUrl}`);
    res.status(200).send("OK");
  }
}