export const sortByField = fieldName => (a, b) =>
  a[fieldName] < b[fieldName] ? -1 : a[fieldName] > b[fieldName] ? 1 : 0;

export const sortByCreatedAt = (order: 'asc' | 'desc') => (a: { createdAt: Date }, b: { createdAt: Date }) =>
  order === 'asc' ? (a.createdAt > b.createdAt ? 1 : -1) : a.createdAt < b.createdAt ? 1 : -1;
