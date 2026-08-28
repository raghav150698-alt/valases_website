import { mkdirSync, writeFileSync } from "node:fs";

const outputDir = new URL("../public/video/app-screens/", import.meta.url);
mkdirSync(outputDir, { recursive: true });

const pages = await fetch("http://127.0.0.1:9222/json").then((response) => response.json());
const page = pages.find((item) => item.url.includes("127.0.0.1:8888"));
if (!page) throw new Error("The local Valases app is not open in the recording browser.");

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve) => { socket.onopen = resolve; });

let commandId = 0;
const pending = new Map();
socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (!message.id) return;
  const request = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) request.reject(new Error(message.error.message));
  else request.resolve(message.result);
};

const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++commandId;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const evaluate = async (expression) => {
  const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
};
const capture = async (name) => {
  const image = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  writeFileSync(new URL(`${name}.png`, outputDir), Buffer.from(image.data, "base64"));
};

await send("Page.enable");
await send("Runtime.enable");

await capture("01-sign-in");

const auth = await fetch("http://127.0.0.1:8000/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "video.provider@example.com", password: "DemoPass123!" }),
}).then(async (response) => {
  if (!response.ok) throw new Error(`Demo login failed: ${await response.text()}`);
  return response.json();
});

await evaluate(`(() => {
  sessionStorage.setItem("valases-session", JSON.stringify({ state: ${JSON.stringify({ token: auth.access_token, role: auth.role })}, version: 0 }));
  window.location.assign("http://127.0.0.1:8888/assessment/");
  return true;
})()`);
await wait(2800);
await capture("02-hiring-overview");

const clickTab = async (label) => evaluate(`(() => {
  const target = [...document.querySelectorAll("button")].find((button) => button.textContent.trim() === ${JSON.stringify(label)});
  target?.click();
  return Boolean(target);
})()`);

await clickTab("Pipeline");
await wait(900);
await capture("03-candidate-pipeline");

await clickTab("Onboarding");
await wait(900);
await capture("04-onboarding-workspace");

await send("Page.navigate", { url: "http://127.0.0.1:5178/candidate.html?apply_org=northstar-labs&apply_job=PDA-01" });
await wait(3200);
await capture("05-public-application");

await send("Page.navigate", { url: "http://127.0.0.1:8888/assessment/?embedded=1&tool=excel" });
await wait(3200);
await evaluate(`document.querySelector(".assessment-fullscreen-overlay")?.remove(); true`);
await capture("06-assessment-workspace");

console.log("Captured real product screens: sign-in, hiring overview, pipeline, onboarding, public application, assessment.");
socket.close();
