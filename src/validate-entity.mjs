const placeholderPattern = /\b(?:tbd|todo|lorem ipsum|replace me|coming soon)\b|^—$/i;

export function isHttps(value) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function isPlaceholder(value) {
  return typeof value !== "string" || !value.trim() || placeholderPattern.test(value.trim());
}

export function validateEntity(organization) {
  const errors = [];
  if (!organization || typeof organization !== "object") {
    return ["organization must be an object"];
  }
  for (const field of ["name", "primaryCategory", "serviceArea"]) {
    if (isPlaceholder(organization[field])) errors.push(`organization.${field} is required and cannot be a placeholder`);
  }
  if (!isHttps(organization.canonicalUrl)) errors.push("organization.canonicalUrl must be an HTTPS URL");
  if (organization.canonicalUrl && !organization.canonicalUrl.endsWith("/")) errors.push("organization.canonicalUrl must end with /");
  for (const field of ["locality", "region", "country"]) {
    if (isPlaceholder(organization.location?.[field])) errors.push(`organization.location.${field} is required`);
  }
  if (organization.sameAs && (!Array.isArray(organization.sameAs) || organization.sameAs.some((url) => !isHttps(url)))) {
    errors.push("organization.sameAs must contain only HTTPS URLs");
  }
  return errors;
}

