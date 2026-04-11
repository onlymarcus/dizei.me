import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { createServer } from "node:http";

const rootArg = process.argv[2] ?? "out";
const port = Number(process.argv[3] ?? 4173);
const root = resolve(process.cwd(), rootArg);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const cleaned = decoded === "/" ? "/index.html" : decoded;
  const fullPath = normalize(join(root, cleaned));
  return fullPath.startsWith(root) ? fullPath : null;
}

const server = createServer((req, res) => {
  const filePath = safePath(req.url ?? "/");

  if (!filePath || !existsSync(filePath) || statSync(filePath).isDirectory()) {
    res.statusCode = 404;
    res.end("Not found");
    return;
  }

  const ext = extname(filePath).toLowerCase();
  res.setHeader("Content-Type", mimeTypes[ext] ?? "application/octet-stream");
  createReadStream(filePath).pipe(res);
});

server.listen(port, () => {
  console.log(`Static preview running at http://localhost:${port}`);
});
