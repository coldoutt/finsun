import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fetchMetrics } from "../metrics/cbr-source.js";

const outputPath = path.resolve(process.cwd(), "metrics.json");
const previousMetrics = await readPreviousMetrics();
const currentMetrics = await fetchMetrics();
const metrics = {
  rates: currentMetrics.rates.ok ? currentMetrics.rates : previousMetrics?.rates || currentMetrics.rates,
  inflation: currentMetrics.inflation.ok ? currentMetrics.inflation : previousMetrics?.inflation || currentMetrics.inflation,
  fetchedAt: currentMetrics.fetchedAt,
};

if (!metrics.rates.ok && !metrics.inflation.ok) {
  throw new Error("CBR rates and inflation are both unavailable; keeping the previous metrics.json");
}

if (previousMetrics && metricsAreEqual(previousMetrics, metrics)) {
  console.log("CBR values have not changed");
  process.exit(0);
}

await writeFile(outputPath, `${JSON.stringify({ metrics }, null, 2)}\n`, "utf8");
console.log(`Updated ${outputPath}`);

async function readPreviousMetrics() {
  try {
    const value = JSON.parse(await readFile(outputPath, "utf8"));
    return value.metrics || null;
  } catch {
    return null;
  }
}

function metricsAreEqual(previous, next) {
  return JSON.stringify({ rates: previous.rates, inflation: previous.inflation })
    === JSON.stringify({ rates: next.rates, inflation: next.inflation });
}
