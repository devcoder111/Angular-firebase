export function setStateProperties<T>(state: T, properties: Partial<T>): T {
  return Object.assign({}, state, properties);
}
