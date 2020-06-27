export function capitalize(string) {
  return `${string[0].toUpperCase()}${string.slice(1)}`;
}

export function getTypesString(types) {
  return types
    .map((type) => type.type.name)
    .join(' / ')
    .toUpperCase();
}
