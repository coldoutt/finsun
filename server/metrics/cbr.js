import { config } from "../config.js";
import { fetchMetrics } from "./cbr-source.js";

let metricsCache = {
  value: null,
  fetchedAt: 0,
};

export async function getCachedMetrics() {
  const now = Date.now();
  if (metricsCache.value && now - metricsCache.fetchedAt < config.metricsCacheMs) {
    return metricsCache.value;
  }

  const value = await fetchMetrics();
  metricsCache = {
    value,
    fetchedAt: now,
  };
  return value;
}
