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
  "aspnetcorerazor",
];

/**
 * Retrieves custom included languages from the workspace configuration
 * and appends the list of supported language identifiers
 *
 * @returns An array containing languages to sort
 */
export default function getLanguages() {
  const config = workspace.getConfiguration("tailwindSorter");
  const includedLanguages = config.get("includeLanguages", []);

  return [...languages, ...includedLanguages];
}
