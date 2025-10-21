export function pascalCase(str: string): string {
  const camelCase = str.replace(/[-_\s]+(.)?/g, (_, c) =>
    c ? c.toUpperCase() : ""
  );
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
}
