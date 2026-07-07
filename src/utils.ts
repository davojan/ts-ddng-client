export function toBool(value: unknown): boolean {
  return value === 't' || value === 'true' || value === 'yes'
    ? true
    : value === 'f' || value === 'false' || value === 'no'
      ? false
      : Boolean(value)
}
