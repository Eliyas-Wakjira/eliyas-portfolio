import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);

console.log("App folder:", process.cwd());
console.log("Script location:", import.meta.url);

const packagePaths = require.resolve.paths("express") ?? [];
let found = false;

for (const folder of packagePaths) {
  const packageFile = path.join(folder, "express", "package.json");
  if (!existsSync(packageFile)) continue;

  const info = JSON.parse(readFileSync(packageFile, "utf8"));
  console.log("Express found at:", packageFile);
  console.log("Package name:", info.name);
  found = true;
}

if (!found) console.log("Express package.json was not found in Node's lookup paths.");

try {
  await import("express");
  console.log("Express import: OK");
} catch (error) {
  console.log("Express import error:", error.code, error.message);
}
