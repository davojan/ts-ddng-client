export function toBool(value: any): boolean {
  return value === 't' || value === 'true' || value === 'yes'
    ? true
    : value === 'f' || value === 'false' || value === 'no' ? false : Boolean(value)
}
