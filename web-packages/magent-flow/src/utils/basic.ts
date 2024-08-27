export function classNames(...classes: Array<string>): string {
  return classes.filter(Boolean).join(' ');
}

export function capitalizeFirstLetter(s: string) {
  if (!s) {
    return '';
  }
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
