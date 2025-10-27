import { promises as fs } from "fs";
import path from "path";

const templatesDir = path.resolve(__dirname, "../templates");

export async function loadTemplate(
  templateName: string,
  data: Record<string, string>
): Promise<string> {
  const templatePath = path.join(templatesDir, templateName);
  const templateContent = await fs.readFile(templatePath, "utf-8");

  return templateContent.replace(/{{(\w+)}}/g, (match, key) => {
    return data[key] || match;
  });
}
