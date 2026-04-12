#!/usr/bin/env node
/**
 * IndexNow ping script for Bing Copilot instant indexing.
 * Usage: node scripts/indexnow-ping.mjs https://livix.es/blog/slug1 https://livix.es/blog/slug2
 */
const KEY = "a02d1f3919e649d59bfda0dd9ec318b1";
const HOST = "livix.es";

const urls = process.argv.slice(2);
if (!urls.length) {
  console.log("Usage: node scripts/indexnow-ping.mjs url1 url2 ...");
  process.exit(0);
}

const body = JSON.stringify({ host: HOST, key: KEY, urlList: urls });

try {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body,
  });
  console.log(`IndexNow: ${res.status} ${res.statusText} (${urls.length} URLs)`);
} catch (err) {
  console.error(`IndexNow error: ${err.message}`);
  process.exit(1);
}
