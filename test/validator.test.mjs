import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { validateManifest } from "../src/index.mjs";

test("example manifest is valid", async () => {
  const manifest = JSON.parse(await readFile(new URL("../examples/blacklabel-manifest.json", import.meta.url), "utf8"));
  const result = validateManifest(manifest, { now: new Date("2026-07-30T12:00:00Z") });
  assert.equal(result.valid, true, result.errors.join("\n"));
  assert.equal(result.counts.evidence, 1);
  assert.equal(result.counts.prompts, 3);
});

test("rejects placeholder claims and insecure evidence URLs", () => {
  const manifest = {
    schemaVersion: "1.0",
    organization: { name: "Example", canonicalUrl: "https://example.com/", primaryCategory: "software company", location: { locality: "Mobile", region: "Alabama", country: "US" }, serviceArea: "United States" },
    evidence: [{ id: "bad", kind: "case-study", url: "http://example.com/case", reviewedAt: "2026-07-30", claims: [{ statement: "TBD", sourceUrl: "http://example.com", verifiedAt: "2026-07-30" }] }]
  };
  const result = validateManifest(manifest, { now: new Date("2026-07-30T12:00:00Z") });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("HTTPS")));
  assert.ok(result.errors.some((error) => error.includes("placeholder")));
});

test("rejects duplicate evidence and prompt identifiers", () => {
  const baseClaim = { statement: "A valid supported statement.", sourceUrl: "https://example.com/source", verifiedAt: "2026-07-30" };
  const manifest = {
    schemaVersion: "1.0",
    organization: { name: "Example", canonicalUrl: "https://example.com/", primaryCategory: "software company", location: { locality: "Mobile", region: "Alabama", country: "US" }, serviceArea: "United States" },
    evidence: [
      { id: "same", kind: "case-study", url: "https://example.com/one", reviewedAt: "2026-07-30", claims: [baseClaim] },
      { id: "same", kind: "dataset", url: "https://example.com/two", reviewedAt: "2026-07-30", claims: [baseClaim] }
    ],
    promptPanel: [
      { id: "same", class: "category", prompt: "Who builds software?" },
      { id: "same", class: "local", prompt: "Who builds software here?" }
    ]
  };
  const result = validateManifest(manifest, { now: new Date("2026-07-30T12:00:00Z") });
  assert.equal(result.valid, false);
  assert.ok(result.errors.filter((error) => error.includes("duplicates")).length >= 2);
});

