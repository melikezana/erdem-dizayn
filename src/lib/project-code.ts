const PROJECT_CODE_PATTERN = /^ERD-\d{5}$/;

export function normalizeProjectCode(value: string) {
  const compact = value.trim().replace(/[\s-]+/g, "").toUpperCase();
  const match = compact.match(/^ERD(\d{5})$/);

  if (match) {
    return `ERD-${match[1]}`;
  }

  return value.trim().replace(/\s+/g, "").toUpperCase();
}

export function isValidProjectCode(value: string) {
  return PROJECT_CODE_PATTERN.test(normalizeProjectCode(value));
}
