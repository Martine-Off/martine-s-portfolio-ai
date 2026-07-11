import { chromium } from "playwright-core";
import { existsSync } from "fs";

const executablePaths = [
  process.env.CHROME_PATH,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
].filter(Boolean);

let execPath = executablePaths.find((p) => existsSync(p));

const browser = await chromium.launch({
  executablePath: execPath,
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
page.on("console", (msg) => console.log("CONSOLE:", msg.type(), msg.text()));
page.on("pageerror", (err) => console.log("PAGEERROR:", err.message));
page.on("requestfailed", (req) => console.log("REQFAILED:", req.url(), req.failure()?.errorText));
page.on("response", (res) => {
  if (res.status() >= 400) console.log("HTTP", res.status(), res.url());
});
await page.goto("http://localhost:8081/projets/agent-conversationnel-simulation-de-relation-client", {
  waitUntil: "networkidle",
  timeout: 60000,
});

// find the h3 titles rendered by BlockTitle, and identify which correspond to quote blocks
const results = await page.evaluate(() => {
  const blockquotes = Array.from(document.querySelectorAll("blockquote"));
  return blockquotes.map((bq) => {
    const container = bq.closest("[id^='block-']") || bq.parentElement;
    const h3 = container ? container.querySelector("h3") : null;
    if (!h3) return { text: bq.textContent?.slice(0, 60), h3: null };
    const cs = getComputedStyle(h3);
    return {
      titleText: h3.textContent,
      quoteExcerpt: bq.textContent?.slice(0, 60),
      fontWeight: cs.fontWeight,
      fontFamily: cs.fontFamily,
      className: h3.className,
    };
  });
});

console.log(JSON.stringify(results, null, 2));
console.log("URL:", page.url());
console.log("TITLE:", await page.title());
console.log("BODY_SNIPPET:", (await page.textContent("body"))?.slice(0, 500));

await page.screenshot({ path: "C:/Users/marti/AppData/Local/Temp/claude/c--Users-marti-Downloads-Martine-s-Portfolio-AI--12-/99a80575-9b03-4cd4-b570-2428c62e789b/scratchpad/quote-page.png", fullPage: true });

await browser.close();
