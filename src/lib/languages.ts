import { workspace } from "vscode";

const languages = [
  "html",
  "javascriptreact",
  "typescriptreact",
  "ejs",
  "astro",
  "svelte",
  "vue",
  "mdx",
  "django-html",
  "php",
  "blade",
  "blade.php",
  "twig",
  "elixir",
  "phoenix-heex",
  "ruby",
  "erb",
  "liquid",
  "rust",
  "css",
  "scss",
  "razor",
  "aspnetcorerazor"
];

/**
 * Retrieves custom included languages from the workspace configuration
 * and appends the list of supported language identifiers
 *
 * @returns An array containing languages to sort
 */
export default function getLanguages() {
  const config = workspace.getConfiguration("tailwindSorter");
  const includedLanguages = config.get<string[]>("includeLanguages", []);
  const excludeLanguages = config.get<string[]>("excludeLanguages", []);

  return [...languages, ...includedLanguages].filter(
    (lang) => !excludeLanguages.includes(lang)
  );
}

/**
 * Create a glob pattern from a simplified path
 *
 * @param path the path to glob
 * @returns A normalized glob pattern
 */
export function normalize(path: string): string {
  return path.endsWith("/") ? `**/${path}**` : path;
}
