export function pick(obj: any, fields: string[]): any {
  return fields.reduce((a, c) => ({ ...a, [c]: obj[c] }), {});
}
