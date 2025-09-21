export function updateArrayProperty(
  target: any,
  property: string,
  value: any[],
) {
  target[property] = Array.from(
    new Set([...(target[property] || []), ...value]),
  );
  return target;
}
