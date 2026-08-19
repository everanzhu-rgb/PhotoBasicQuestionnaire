import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the photography questionnaire cover", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="zh-CN">/i);
  assert.match(html, /<title>拍摄前信息与偏好问卷<\/title>/i);
  assert.match(html, /在见面之前/);
  assert.match(html, /先认识此刻的你/);
  assert.match(html, /开始填写/);
  assert.match(html, /所有照片与回答只在当前浏览器中整理/);
  assert.doesNotMatch(html, /codex-preview|loading skeleton|Your site is taking shape/i);
});

test("keeps production metadata and Cloudflare deployment settings", async () => {
  const [layout, packageJson, viteConfig] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../vite.config.ts", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /title:\s*"拍摄前信息与偏好问卷"/);
  assert.match(packageJson, /"name": "photo-basic-questionnaire"/);
  assert.match(packageJson, /"deploy":/);
  assert.match(viteConfig, /name: "photo-basic-questionnaire"/);
  assert.match(viteConfig, /pattern: "photobasicquestionnaire\.everanz\.com"/);
  assert.match(viteConfig, /custom_domain: true/);

  await assert.rejects(access(new URL("app/_sites-preview", projectRoot)));
});
