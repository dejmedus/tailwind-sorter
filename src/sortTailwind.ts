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

  const classes = classesStr
    .split(/\s+/)
    .filter((className) => className.trim() !== "");

  if (!classes.length) {
    return match;
  }

  const { unsortedClasses, ignoredClasses } = classes.reduce(
    (acc, className) => {
      const match = findLongestMatch(className, sortConfig);

      match
        ? acc.unsortedClasses.push(className)
        : acc.ignoredClasses.push(className);

      return acc;
    },
    { unsortedClasses: [] as string[], ignoredClasses: [] as string[] }
  );

  const sortedClasses = unsortedClasses.sort(
    (aClass: string, bClass: string) => {
      const a = findLongestMatch(aClass, sortConfig);
      const b = findLongestMatch(bClass, sortConfig);

      const aIsPseudo = aClass.includes(":");
      const bIsPseudo = bClass.includes(":");

      const aIsNotVariant = aClass.includes("not-");
      const bIsNotVariant = bClass.includes("not-");

      const aOffset = aIsPseudo
        ? aIsNotVariant
          ? 0.75
          : 0.5
        : aIsNotVariant
        ? 0.25
        : 0;

      const bOffset = bIsPseudo
        ? bIsNotVariant
          ? 0.75
          : 0.5
        : bIsNotVariant
        ? 0.25
        : 0;

      // assign each class its sortConfig index and add offset
      // 0.25: not- class, 0.5: pseudo class, 0.75: not- pseudo class
      const aIndex = sortConfig[a] + aOffset;
      const bIndex = sortConfig[b] + bOffset;

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

  const sortedClassesStr = [...sortedClasses, ...ignoredClasses].join(" ");

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
