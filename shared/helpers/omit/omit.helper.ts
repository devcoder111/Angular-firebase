export function omit(obj: any, fields: string[]): any {
  const result = Object.assign({}, obj);
  for (const field of fields) {
    delete result[field];
  }
  return result;
}
