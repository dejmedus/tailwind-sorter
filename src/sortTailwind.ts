import {
  createApplyRegex,
  createRegex,
  dynamicSyntaxMarkers,
} from "./lib/regex";

/**
 * Sorts the tailwind classes in the given file text based on the provided sort config.
 *
 * @param text - The file text to be sorted.
 * @param sortConfig - The sort config object that maps style classes to their sort order index.
 * @param pseudoClasses - An array of pseudo classes to sort by.
 * @returns The file text with sorted style classes.
 */
export default function sortTailwind(
  text: string,
  sortConfig: { [key: string]: number },
  pseudoClasses: string[]
) {
  const applyRegex = createApplyRegex();
  text = text.replace(applyRegex, (match, classesGroup) => {
    return sortFoundTailwind(match, classesGroup, sortConfig, pseudoClasses);
  });

  const regex = createRegex();
  text = text.replace(
    regex,
    (
      match,
      g1,
      g2,
      doubleQuotesGroup,
      singleQuotesGroup,
      backtickQuotesGroup
    ) => {
      const quotesGroup =
        singleQuotesGroup || doubleQuotesGroup || backtickQuotesGroup;

      return sortFoundTailwind(match, quotesGroup, sortConfig, pseudoClasses);
    }
  );

  return text;
}

/**
 * Sorts tailwind found by regex.
 *
 * @param match - The full match found by regex. ex: class="bg-blue-500 text-white"
 * @param classesStr - The tailwind classes. ex: bg-blue-500 text-white
 * @param sortConfig - The sort config object that maps style classes to their sort order index.
 * @param pseudoClasses - An array of pseudo classes to sort by.
 */
function sortFoundTailwind(
  match: string,
  classesStr: string,
  sortConfig: { [key: string]: number },
  pseudoClasses: string[]
) {
  if (!classesStr || !classesStr.includes(" ")) {
    return match;
  }

  const groupContainsDynamicSyntax = dynamicSyntaxMarkers.some((syntax) =>
    classesStr.includes(syntax)
  );

  if (groupContainsDynamicSyntax) {
    return match;
  }

  const unsortedClasses = classesStr
    .split(/\s+/)
    .filter((className) => className.trim() !== "");

  if (!unsortedClasses.length) {
    return match;
  }

  const sortedClasses = unsortedClasses.sort(
    (aClass: string, bClass: string) => {
      const a = findLongestMatch(aClass, sortConfig);
      const b = findLongestMatch(bClass, sortConfig);

      // assign each class its sortConfig index, add .5 if it's a pseudo class,
      // and default to Number.MAX_VALUE so classes not in sortConfig are placed at the end
      const aIsPseudo = aClass.includes(":");
      const bIsPseudo = bClass.includes(":");

      // nullish coalescing https://www.typescriptlang.org/play/?#example/nullish-coalescing
      const aIndex =
        (aIsPseudo ? sortConfig[a] + 0.5 : sortConfig[a]) ?? Number.MAX_VALUE;
      const bIndex =
        (bIsPseudo ? sortConfig[b] + 0.5 : sortConfig[b]) ?? Number.MAX_VALUE;

      if (aIndex === bIndex) {
        // if same index, sort alphabetically
        //  unless they are pseudo classes, then sort by pseudo config
        if (aIsPseudo && bIsPseudo) {
          const aPseudo = pseudoClasses.find((c) => aClass.includes(c));
          const bPseudo = pseudoClasses.find((c) => bClass.includes(c));
          if (aPseudo && bPseudo) {
            return (
              pseudoClasses.indexOf(aPseudo) - pseudoClasses.indexOf(bPseudo)
            );
          }
        }
        return aClass.localeCompare(bClass);
      }

      return aIndex - bIndex;
    }
  );

  const sortedClassesStr = sortedClasses.join(" ");

  return match.replace(classesStr, sortedClassesStr);
}

/**
 * Finds the matching style class in sortConfig. eg. overflow-x-12 returns overflow-x-
 *
 * @param styleClass - The style class to find a match for. (overflow-x-12)
 * @param sortConfig - The sort config object.
 * @returns The longest matching sortConfig key. (overflow-x-)
 */
function findLongestMatch(
  styleClass: string,
  sortConfig: { [key: string]: number }
) {
  let longestMatch = "";
  for (const key in sortConfig) {
    if (styleClass.includes(key) && key.length > longestMatch.length) {
      longestMatch = key;
    }
  }
  return longestMatch;
}
