import { isPlaceholder } from "./validate-entity.mjs";

export function validatePromptPanel(panel) {
  const errors = [];
  if (panel === undefined) return errors;
  if (!Array.isArray(panel)) return ["promptPanel must be an array"];
  const ids = new Set();
  for (const [index, item] of panel.entries()) {
    const path = `promptPanel[${index}]`;
    if (isPlaceholder(item?.id)) errors.push(`${path}.id is required`);
    else if (ids.has(item.id)) errors.push(`${path}.id duplicates ${item.id}`);
    else ids.add(item.id);
    if (isPlaceholder(item?.class)) errors.push(`${path}.class is required`);
    if (isPlaceholder(item?.prompt)) errors.push(`${path}.prompt is required`);
    else if (!item.prompt.trim().endsWith("?")) errors.push(`${path}.prompt must be a complete question ending in ?`);
  }
  return errors;
}

