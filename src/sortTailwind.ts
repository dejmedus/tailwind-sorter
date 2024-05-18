import dynamicSyntaxMarkers from "./lib/dynamicSyntax";

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
  // look for " class=" or " className=" and ignore complex syntax
  const regex = /\sclass(Name)?=("([^"]*)"|'([^']*)')/g;

  const newText = text.replace(
    regex,
    (match, g1, g2, doubleQuotesGroup, singleQuotesGroup) => {
      const quotesGroup = singleQuotesGroup || doubleQuotesGroup;

      const groupContainsDynamicSyntax = dynamicSyntaxMarkers.some((syntax) =>
        quotesGroup.includes(syntax)
      );

      if (
        !quotesGroup ||
        !quotesGroup.includes(" ") ||
        groupContainsDynamicSyntax
      ) {
        return match;
      }

      // remove all dynamic classes from sort
      const { classesToSort, unchangingClasses } =
        getUnchangingClasses(quotesGroup);

      const unsortedClasses = classesToSort
        .split(/\s+/)
        .filter((className) => className.trim() !== "");

      if (!unsortedClasses.length) {
        return match;
      }

      const sortedClasses = unsortedClasses.sort(
        (aClass: string, bClass: string) => {
          const a = findLongestMatch(aClass, sortConfig);
          const b = findLongestMatch(bClass, sortConfig);

          // assign each class its sortConfig index, add .5 if it's a pseudo class, and default to Number.MAX_VALUE so classes not in sortConfig are placed at the end
          const aIsPseudo = aClass.includes(":");
          const bIsPseudo = bClass.includes(":");
          const aIndex = aIsPseudo
            ? sortConfig[a] + 0.5
            : sortConfig[a] || Number.MAX_VALUE;
          const bIndex = bIsPseudo
            ? sortConfig[b] + 0.5
            : sortConfig[b] || Number.MAX_VALUE;

          if (aIndex === bIndex) {
            // if same index, sort alphabetically
            //  unless they are pseudo classes, then sort by pseudo config
            if (aIsPseudo && bIsPseudo) {
              const aPseudo = pseudoClasses.find((c) => aClass.includes(c));
              const bPseudo = pseudoClasses.find((c) => bClass.includes(c));
              if (aPseudo && bPseudo) {
                return (
                  pseudoClasses.indexOf(aPseudo) -
                  pseudoClasses.indexOf(bPseudo)
                );
              }
            }
            return aClass.localeCompare(bClass);
          }

          return aIndex - bIndex;
        }
      );

      const newString = unchangingClasses
        ? sortedClasses.join(" ") + " " + unchangingClasses
        : sortedClasses.join(" ");

      return match.replace(quotesGroup, newString);
    }
  );

  return newText;
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

/**
 * Separates classes we don't want to sort from those we do.
 *
 * @param text - The text to extract classes we don't want to sort.
 * @returns The classes to sort and the classes we wont sort.
 */
function getUnchangingClasses(text: string) {
  if (!text.includes("{")) {
    return { classesToSort: text, unchangingClasses: "" };
  }

  let brackets = Array.from(text.matchAll(/{{.*?}}|{.*?}/g));

  if (brackets.length === 0) {
    return { classesToSort: text, unchangingClasses: "" };
  }

  let joinedString = brackets.map((match) => match[0]).join(" ");

  text = text.replaceAll(/{{.*?}}/g, "");
  text = text.replaceAll(/{.*?}/g, "");

  return { classesToSort: text, unchangingClasses: joinedString };
}
