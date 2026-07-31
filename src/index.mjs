import { validateEntity } from "./validate-entity.mjs";
import { validateEvidence } from "./validate-evidence.mjs";
import { validatePromptPanel } from "./prompt-panel.mjs";

export { validateEntity, validateEvidence, validatePromptPanel };

export function validateManifest(manifest, options = {}) {
  const errors = [];
  if (manifest?.schemaVersion !== "1.0") errors.push("schemaVersion must equal 1.0");
  errors.push(...validateEntity(manifest?.organization));
  const evidenceResult = validateEvidence(manifest?.evidence, options);
  errors.push(...evidenceResult.errors, ...validatePromptPanel(manifest?.promptPanel));
  return { valid: errors.length === 0, errors, warnings: evidenceResult.warnings, counts: { evidence: Array.isArray(manifest?.evidence) ? manifest.evidence.length : 0, prompts: Array.isArray(manifest?.promptPanel) ? manifest.promptPanel.length : 0 } };
}

