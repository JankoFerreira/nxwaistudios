import { chromium } from "playwright";

const viewports = [
  [375, 812],
  [430, 932],
  [768, 1024],
  [1024, 768],
  [1440, 900],
  [1920, 1080],
];

const baseUrl = "http://127.0.0.1:4174";
const browser = await chromium.launch();
const results = [];

for (const [width, height] of viewports) {
  const page = await browser.newPage({ viewport: { width, height } });
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.locator("h1").waitFor({ state: "visible" });

  if (width <= 760) {
    await page.locator(".menu-button").click();
  }

  await page.locator('a[href="#what-we-build"]').first().click();
  await page.locator("#what-we-build").waitFor({ state: "visible" });

  if (width <= 760) {
    await page.locator(".menu-button").click();
  }

  await page.locator('a[href="#butchershub"]').first().click();
  await page.locator("#butchershub").waitFor({ state: "visible" });

  if (width <= 760) {
    await page.locator(".menu-button").click();
  }

  await page.locator('a[href="#contact"]').first().click();
  await page.locator("#contact").waitFor({ state: "visible" });

  if (width <= 760) {
    await page.locator(".menu-button").click();
    const bodyOverflow = await page.evaluate(() => getComputedStyle(document.body).overflow);
    await page.keyboard.press("Escape");
    results.push({ viewport: `${width}x${height}`, mobileMenuBodyOverflow: bodyOverflow });
  }

  await page.locator('button[type="submit"]').click();
  const validationMessage = await page.locator('[role="alert"]').first().textContent();

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload({ waitUntil: "networkidle" });
  const reducedMotionApplied = await page.evaluate(
    () => getComputedStyle(document.documentElement).scrollBehavior === "auto",
  );

  const title = await page.title();
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  const favicon = await page.locator('link[rel="icon"]').getAttribute("href");

  results.push({
    viewport: `${width}x${height}`,
    title,
    canonical,
    favicon,
    validationMessage,
    reducedMotionApplied,
    consoleErrors,
  });

  await page.close();
}

const staticChecks = {};
for (const path of [
  "/robots.txt",
  "/sitemap.xml",
  "/brand/favicon.svg",
  "/brand/ferion-og-image.svg",
  "/privacy.html",
]) {
  const response = await fetch(`${baseUrl}${path}`);
  staticChecks[path] = response.status;
}

await browser.close();

console.log(JSON.stringify({ results, staticChecks }, null, 2));
