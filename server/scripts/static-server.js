import { createReadStream } from "fs";
import { access, stat } from "fs/promises";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../../");
const port = 5500;
const backendPort = 3000;

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
};

function resolvePath(urlPath) {
  const cleanPath = decodeURIComponent((urlPath || "/").split("?")[0]);
  const relativePath = cleanPath === "/" ? "index.html" : cleanPath.replace(/^\/+/, "");
  return path.resolve(rootDir, relativePath);
}

const server = http.createServer(async (req, res) => {
  if ((req.url || "").startsWith("/api/")) {
    proxyApiRequest(req, res);
    return;
  }

  const filePath = resolvePath(req.url);
  if (!filePath.startsWith(rootDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    await access(filePath);
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": contentTypes[ext] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

server.listen(port, () => {
  console.log(`Static frontend listening on http://localhost:${port}`);
});

function proxyApiRequest(req, res) {
  const proxyRequest = http.request({
    hostname: "localhost",
    port: backendPort,
    path: req.url,
    method: req.method,
    headers: req.headers,
  }, (proxyResponse) => {
    res.writeHead(proxyResponse.statusCode || 502, proxyResponse.headers);
    proxyResponse.pipe(res);
  });

  proxyRequest.on("error", () => {
    res.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({
      error: "backend_unavailable",
      message: "Backend API is unavailable on localhost:3000.",
    }));
  });

  req.pipe(proxyRequest);
}
