const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const root = __dirname;
const dataFile = path.join(root, "finance-data.json");
const port = 8780;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);

    if (url.pathname === "/api/data" && request.method === "GET") {
      await sendData(response);
      return;
    }

    if (url.pathname === "/api/data" && request.method === "POST") {
      await saveData(request, response);
      return;
    }

    if (request.method !== "GET") {
      sendText(response, 405, "Method not allowed");
      return;
    }

    await sendStatic(url.pathname, response);
  } catch (error) {
    console.error(error);
    sendText(response, 500, "Server error");
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.log(`Finance app is already running: http://127.0.0.1:${port}/`);
    process.exit(0);
    return;
  }
  throw error;
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Finance app: http://127.0.0.1:${port}/`);
  console.log(`Data file: ${dataFile}`);
});

async function sendData(response) {
  try {
    const data = await fs.readFile(dataFile, "utf8");
    sendJson(response, 200, JSON.parse(data));
  } catch (error) {
    if (error.code === "ENOENT") {
      sendJson(response, 200, { records: [], currentRows: [] });
      return;
    }
    throw error;
  }
}

async function saveData(request, response) {
  const body = await readBody(request);
  const parsed = JSON.parse(body);
  if (!Array.isArray(parsed.records)) {
    sendText(response, 400, "Bad data");
    return;
  }

  const pretty = `${JSON.stringify(parsed, null, 2)}\n`;
  const tempFile = `${dataFile}.tmp`;
  await fs.writeFile(tempFile, pretty, "utf8");
  await fs.rename(tempFile, dataFile);
  sendJson(response, 200, { ok: true });
}

async function sendStatic(pathname, response) {
  const requested = pathname === "/" ? "index.html" : decodeURIComponent(pathname.slice(1));
  const filePath = path.normalize(path.join(root, requested));
  if (!filePath.startsWith(root)) {
    sendText(response, 403, "Forbidden");
    return;
  }

  try {
    const data = await fs.readFile(filePath);
    const type = mimeTypes[path.extname(filePath)] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": type });
    response.end(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      sendText(response, 404, "Not found");
      return;
    }
    throw error;
  }
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 5_000_000) {
        request.destroy();
        reject(new Error("Request too large"));
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function sendJson(response, status, value) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(value));
}

function sendText(response, status, text) {
  response.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  response.end(text);
}
