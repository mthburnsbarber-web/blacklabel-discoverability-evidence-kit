import { isHttps, isPlaceholder } from "./validate-entity.mjs";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function validateDate(value, field, now, errors) {
  if (!datePattern.test(value ?? "") || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    errors.push(`${field} must be an ISO YYYY-MM-DD date`);
    return;
  }
  if (Date.parse(`${value}T00:00:00Z`) > now.getTime()) errors.push(`${field} cannot be in the future`);
}

export function validateEvidence(records, { now = new Date(), staleDays = 365 } = {}) {
  const errors = [];
  const warnings = [];
  if (!Array.isArray(records) || records.length === 0) return { errors: ["evidence must contain at least one record"], warnings };
  const ids = new Set();
  const urls = new Set();
  for (const [index, record] of records.entries()) {
    const path = `evidence[${index}]`;
    if (isPlaceholder(record?.id)) errors.push(`${path}.id is required`);
    else if (ids.has(record.id)) errors.push(`${path}.id duplicates ${record.id}`);
    else ids.add(record.id);
    if (isPlaceholder(record?.kind)) errors.push(`${path}.kind is required`);
    if (!isHttps(record?.url)) errors.push(`${path}.url must be an HTTPS URL`);
    else if (urls.has(record.url)) errors.push(`${path}.url duplicates ${record.url}`);
    else urls.add(record.url);
    validateDate(record?.reviewedAt, `${path}.reviewedAt`, now, errors);
    if (datePattern.test(record?.reviewedAt ?? "")) {
      const ageDays = (now.getTime() - Date.parse(`${record.reviewedAt}T00:00:00Z`)) / 86400000;
      if (ageDays > staleDays) warnings.push(`${path} has not been reviewed in ${Math.floor(ageDays)} days`);
    }
    if (!Array.isArray(record?.claims) || record.claims.length === 0) {
      errors.push(`${path}.claims must contain at least one claim`);
      continue;
    }
    for (const [claimIndex, claim] of record.claims.entries()) {
      const claimPath = `${path}.claims[${claimIndex}]`;
      if (isPlaceholder(claim?.statement)) errors.push(`${claimPath}.statement is required and cannot be a placeholder`);
      if (!isHttps(claim?.sourceUrl)) errors.push(`${claimPath}.sourceUrl must be an HTTPS URL`);
      if (claim?.methodologyUrl && !isHttps(claim.methodologyUrl)) errors.push(`${claimPath}.methodologyUrl must be an HTTPS URL`);
      validateDate(claim?.verifiedAt, `${claimPath}.verifiedAt`, now, errors);
    }
  }
  return { errors, warnings };
}

