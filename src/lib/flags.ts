export function flagPath(isoCode: string): string {
  return `/flags/4x3/${isoCode.toLowerCase()}.svg`;
}
