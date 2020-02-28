export const listToMap = list =>
  list.reduce((map, item) => {
    map[item.id] = item;
    return map;
  }, {});

export const listToKeys = list => list.map(item => item.id);

export const diffInDays = readAt => {
  const today = new Date().getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  return readAt
    ? Math.round(Math.abs((today - new Date(readAt).getTime()) / oneDay))
    : undefined;
};
