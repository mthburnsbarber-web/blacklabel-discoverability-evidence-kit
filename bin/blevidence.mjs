#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { validateManifest } from "../src/index.mjs";

const args = process.argv.slice(2);
const input = args.find((arg) => !arg.startsWith("--"));
const jsonOutput = args.includes("--json");
if (!input) {
  console.error("Usage: blevidence <manifest.json|https-url> [--json]");
  process.exit(2);
}

const source = input.startsWith("https://")
  ? await fetch(input).then(async (response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status} loading ${input}`);
      return response.text();
    })
  : await readFile(resolve(input), "utf8");

const result = validateManifest(JSON.parse(source));
if (jsonOutput) console.log(JSON.stringify(result, null, 2));
else {
  console.log(result.valid ? "VALID discoverability evidence manifest" : "INVALID discoverability evidence manifest");
  console.log(`Evidence records: ${result.counts.evidence}; prompt records: ${result.counts.prompts}`);
  for (const error of result.errors) console.error(`ERROR ${error}`);
  for (const warning of result.warnings) console.warn(`WARN ${warning}`);
}
process.exitCode = result.valid ? 0 : 1;

