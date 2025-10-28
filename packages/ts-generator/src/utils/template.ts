export function renderTemplate(
  template: string,
  data: Record<string, string>
): string {
  return template.replace(/{{(\w+)}}/g, (match, key) => {
    return data[key] ?? match;
  });
}
