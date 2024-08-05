import * as vscode from "vscode";

/**
 * Creates a regex pattern to select style classes after a prefix inside '' "" or ``
 *
 *
 * @returns The regex pattern
 */
export function createRegex() {
  const config = vscode.workspace.getConfiguration("tailwindSorter");

  // custom prefix should be a string + ( or =
  // defaults: ["twMerge(", "clsx(", "tw=", "cva("];
  let customPrefixes: string[] = config.get("customPrefixes", []);

  const escapedPrefixes = customPrefixes
    .map((prefix) => prefix.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"))
    .join("|");

  const prefixes = `(${escapedPrefixes}|class=|className=)`;

  // regex101 example: https://regex101.com/r/IfViQ8/1
  // (?<=\\s|{|^) prefix should be preceded by a space, bracket, or the start of the string
  // \\s* may have spaces/newlines after the prefix
  // "([^"?<{>]*)" matches everything inside quotes group unless there is dynamic syntax inside
  const regexStr = `(?<=\\s|{|^)${prefixes}\\s*("([^"?<{>]*)"|'([^'?<{>]*)'|\`([^\`?<{>]*)\`)`;

  return new RegExp(regexStr, "g");
}

export const dynamicSyntaxMarkers = [
  "${",
  "{",
  "}",
  "{{",
  "}}",
  // elixir
  "<%=",
  "%>",
  // PHP
  "<?php",
  "?>",
  // django
  "{%",
  "%}",
  // ruby
  "<%",
  "%>",
  // ASP.NET
  "<%",
  "%>",
];
