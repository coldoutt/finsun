const owner = process.env.GITHUB_OWNER || "coldoutt";
const repo = process.env.GITHUB_REPO || "finance";
const branch = process.env.GITHUB_BRANCH || "main";
const dataPath = process.env.GITHUB_DATA_PATH || "finance.json";
const token = process.env.GITHUB_TOKEN;

module.exports = async function handler(request, response) {
  setCorsHeaders(request, response);

  if (request.method === "OPTIONS") {
    response.statusCode = 204;
    response.end();
    return;
  }

  if (!token) {
    sendJson(response, 500, { ok: false, error: "GITHUB_TOKEN is not configured" });
    return;
  }

  try {
    if (request.method === "GET") {
      const file = await readGitHubFile();
      sendJson(response, 200, file.data);
      return;
    }

    if (request.method === "POST") {
      const parsed = await parseRequestBody(request);
      if (!Array.isArray(parsed?.records)) {
        sendJson(response, 400, { ok: false, error: "Bad data" });
        return;
      }

      const result = await writeGitHubFile(parsed);
      sendJson(response, 200, { ok: true, pushed: true, commit: result.commit?.sha || null });
      return;
    }

    sendJson(response, 405, { ok: false, error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { ok: false, error: error.message || "Server error" });
  }
};

async function parseRequestBody(request) {
  if (typeof request.body === "string") return JSON.parse(request.body);
  if (request.body && typeof request.body === "object") return request.body;

  const chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.from(chunk));
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function readGitHubFile() {
  const result = await githubRequest("GET", contentUrl({ withRef: true }));
  const text = Buffer.from(result.content.replace(/\n/g, ""), "base64").toString("utf8");
  return {
    data: JSON.parse(text),
    sha: result.sha,
  };
}

async function writeGitHubFile(value) {
  const current = await readGitHubFile().catch((error) => {
    if (error.status === 404) return null;
    throw error;
  });
  const pretty = `${JSON.stringify(value, null, 2)}\n`;
  const body = {
    message: "Save finance data",
    content: Buffer.from(pretty, "utf8").toString("base64"),
    branch,
  };

  if (current?.sha) body.sha = current.sha;

  return githubRequest("PUT", contentUrl(), body);
}

function contentUrl(options = {}) {
  const encodedPath = dataPath
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}`;
  return options.withRef ? `${url}?ref=${encodeURIComponent(branch)}` : url;
}

async function githubRequest(method, url, body) {
  const response = await fetch(url, {
    method,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "finance-dashboard",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const parsed = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const error = new Error(parsed?.message || `GitHub API error: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return parsed;
}

function setCorsHeaders(request, response) {
  const allowedOrigin = process.env.FINANCE_ALLOWED_ORIGIN;
  const origin = request.headers.origin;

  if (allowedOrigin === "*" || (allowedOrigin && origin === allowedOrigin)) {
    response.setHeader("Access-Control-Allow-Origin", origin || "*");
  }

  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(response, status, value) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(value));
}
