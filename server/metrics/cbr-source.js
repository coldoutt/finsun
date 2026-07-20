const CBR_DAILY_RATES_URL = "https://www.cbr.ru/scripts/XML_daily.asp";
const CBR_INFLATION_URL = "https://www.cbr.ru/hd_base/infl/";
const CORS_PROXY_URL = "https://api.allorigins.win/raw?url=";

export async function fetchMetrics() {
  const [ratesResult, inflationResult] = await Promise.allSettled([
    fetchCurrencyRates(),
    fetchInflationRate(),
  ]);

  return {
    rates: ratesResult.status === "fulfilled"
      ? {
          ok: true,
          source: "ЦБ РФ",
          date: ratesResult.value.date,
          usd: ratesResult.value.usd,
          eur: ratesResult.value.eur,
        }
      : {
          ok: false,
          source: "ЦБ РФ",
          error: ratesResult.reason?.message || "Rates unavailable",
        },
    inflation: inflationResult.status === "fulfilled"
      ? {
          ok: true,
          source: "ЦБ РФ",
          period: inflationResult.value.period,
          value: inflationResult.value.value,
        }
      : {
          ok: false,
          source: "ЦБ РФ",
          error: inflationResult.reason?.message || "Inflation unavailable",
        },
    fetchedAt: new Date().toISOString(),
  };
}

async function fetchCurrencyRates() {
  const xmlText = await fetchOfficialText(CBR_DAILY_RATES_URL);
  const date = matchFirst(xmlText, /<ValCurs[^>]*Date="([^"]+)"/i) || "";
  const usd = parseCbrCurrency(xmlText, "R01235");
  const eur = parseCbrCurrency(xmlText, "R01239");

  return { date, usd, eur };
}

function parseCbrCurrency(xmlText, id) {
  const blockMatch = xmlText.match(new RegExp(`<Valute\\s+ID="${id}">([\\s\\S]*?)<\\/Valute>`, "i"));
  if (!blockMatch) throw new Error(`Currency ${id} is missing`);

  const block = blockMatch[1];
  const value = parseRussianNumber(matchFirst(block, /<Value>([^<]+)<\/Value>/i));
  const nominal = parseRussianNumber(matchFirst(block, /<Nominal>([^<]+)<\/Nominal>/i)) || 1;
  if (!Number.isFinite(value)) throw new Error(`Currency ${id} value is missing`);

  return value / nominal;
}

async function fetchInflationRate() {
  const html = await fetchOfficialText(CBR_INFLATION_URL);
  const rows = [...html.matchAll(/<tr[\s\S]*?>([\s\S]*?)<\/tr>/gi)];

  for (const rowMatch of rows) {
    const cells = [...rowMatch[1].matchAll(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi)]
      .map((match) => normalizeText(stripTags(match[2])))
      .filter(Boolean);

    if (cells.length < 2) continue;

    const period = cells.find((cell) => /\d{2}\.\d{2}\.\d{4}|\d{4}/.test(cell)) || cells[0];
    const valueCell = [...cells].reverse().find((cell) => /-?\d+([,.]\d+)?/.test(cell));
    const value = parseRussianNumber(valueCell);
    if (Number.isFinite(value) && value > -100 && value < 100) {
      return { value, period };
    }
  }

  throw new Error("Inflation value is missing");
}

async function fetchOfficialText(url) {
  const urls = [url, `${CORS_PROXY_URL}${encodeURIComponent(url)}`];
  let lastError = null;

  for (const targetUrl of urls) {
    try {
      const response = await fetch(targetUrl, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Official data is unavailable");
}

function matchFirst(value, pattern) {
  return value.match(pattern)?.[1] || "";
}

function stripTags(value) {
  return String(value || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

function normalizeText(value) {
  return decodeHtmlEntities(String(value || "")).replace(/\s+/g, " ").trim();
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function parseRussianNumber(value) {
  if (value === null || value === undefined) return Number.NaN;
  const normalized = String(value)
    .replace(/\s/g, "")
    .replace(/[^\d,.-]/g, "")
    .replace(",", ".");
  return Number.parseFloat(normalized);
}
