export function without(items: object[], obj: any): object[] {
  const index = items.indexOf(obj);
  return index > -1 ? [...items.slice(0, index), ...items.slice(index + 1)] : items;
}
