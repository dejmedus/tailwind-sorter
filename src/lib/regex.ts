import { log } from "console";

/**
 * Creates a regex pattern to select style classes after a prefix inside '' "" or ``
 *
 *
 * @returns The regex pattern
 */
export function createRegex() {
  // custom prefix must be a string + ( or =
  const customPrefixes = ["twMerge(", "clsx(", "tw=", "cva("];

  const escapedPrefixes = customPrefixes
    .map((prefix) => prefix.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"))
    .join("|");

  const prefixes = `(${escapedPrefixes}|class=|className=)`;

  // (?<=\\s|^) - prefix should be preceded by a space or the start of the string
  // "([^"\(<{>]*)" - matches everything inside quotes group unless there is dynamic syntax inside
  const regexStr = `(?<=\\s|^)${prefixes}("([^"\(<{>]*)"|'([^'\(<{>]*)'|\`([^\`\(<{>]*)\`)`;

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
