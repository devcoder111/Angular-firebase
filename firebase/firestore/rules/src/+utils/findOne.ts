export function findOne<T>(map: { [key: string]: any }, filter: { [key: string]: any }): T {
  const ids = Object.keys(map);
  for (let id of ids) {
    if (Object.keys(filter).every(key => map[id][key] === filter[key])) {
      return { id, ...map[id] };
    }
  }
  throw new Error(
    `Item not found.\nFilter:\n${JSON.stringify(filter, null, 2)}\nMap:\n${JSON.stringify(filter, null, 2)}`,
  );
}
