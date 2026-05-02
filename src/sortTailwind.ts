import { SortOptions } from "./types";
import {
  createApplyRegex,
  createRegex,
  colonRegex,
  dynamicSyntaxMarkers,
  parenthesis
} from "./lib/regex";

/**
 * Sorts the tailwind classes in the given file text based on the provided sort config.
 *
 * @param text - The file text to be sorted.
 * @param sortOptions - The sort mode and config.
 */
export default function sortTailwind(text: string, sortOptions: SortOptions) {
  const applyRegex = createApplyRegex();
  text = text.replace(applyRegex, (match, classesGroup) => {
    return sortFoundTailwind(match, classesGroup, sortOptions);
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

      return sortFoundTailwind(match, quotesGroup, sortOptions);
    }
  );

  return text;
}

/**
 * Sorts tailwind found by regex.
 *
 * @param match - The full match found by regex. ex: class="bg-blue-500 text-white"
 * @param classesStr - The tailwind classes. ex: bg-blue-500 text-white
 * @param sortOptions - The sort mode and config.
 */
function sortFoundTailwind(
  match: string,
  classesStr: string,
  sortOptions: SortOptions
) {
  if (!classesStr || !classesStr.includes(" ")) {
    return match;
  }

  const groupContainsDynamicSyntax = dynamicSyntaxMarkers.some(
    (syntax) => classesStr.includes(syntax) || parenthesis.test(classesStr)
  );

  if (groupContainsDynamicSyntax) {
    return match;
  }

  if (sortOptions.mode === "official") {
    const sortedClasses = sortOptions.sorter.sortClassAttributes([
      classesStr
    ])[0];

    return match.replace(classesStr, sortedClasses);
  }

  const { classesMap, pseudoSortOrder, sectionOrder } = sortOptions;

  const classes = classesStr
    .split(/\s+/)
    .filter((className) => className.trim() !== "");

  if (!classes.length) {
    return match;
  }

  const base = sectionOrder.indexOf("classes") * 1000;
  const pseudoIndex = sectionOrder.indexOf("pseudoClasses");
  const bases = {
    class: base,
    pseudo: pseudoIndex !== -1 ? pseudoIndex * 1000 : base,
    custom: sectionOrder.indexOf("customClasses") * 1000
  };

  const sortedClasses = classes.sort((aClass: string, bClass: string) => {
    const [aIndex, aIsPseudo] = findIndex(aClass, bases, classesMap, classes);
    const [bIndex, bIsPseudo] = findIndex(bClass, bases, classesMap, classes);

    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }

    if (aIsPseudo && bIsPseudo) {
      // sort pseudo classes by config order
      return comparePseudoClasses(aClass, bClass, pseudoSortOrder);
    }

    // otherwise sort alphabetically
    return aClass.localeCompare(bClass);
  });

  return match.replace(classesStr, sortedClasses.join(" "));
}

/**
 * Finds sort index of a given class
 *
 * @param aClass - The style class to find an index for. (overflow-x-12)
 * @param bases - The map of base offset numbers for classes, pseudo classes, custom classes
 * @param sortConfig - The sort config object.
 * @param classes - The array of classes being sorted.
 * @returns sort index, if class is a pseudo class (hover:)
 */
function findIndex(
  aClass: string,
  bases: { [key: string]: number },
  sortConfig: { [key: string]: number },
  classes: string[]
): [number, boolean] {
  const match = findLongestMatch(aClass, sortConfig);

  if (!match) {
    const customIndex = bases.custom + classes.indexOf(aClass);
    return [customIndex, false];
  }

  const baseClass = aClass?.split(colonRegex).pop() || aClass;
  const isPseudo = baseClass !== aClass;
  const isNotVariant = baseClass.includes("not-");

  const offset = isPseudo
    ? isNotVariant
      ? bases.pseudo + 0.75
      : bases.pseudo + 0.5
    : isNotVariant
      ? bases.class + 0.25
      : bases.class + 0;

  // assign each class its sortConfig index and add offset
  // 0.25: not- class, 0.5: pseudo class, 0.75: not- pseudo class
  return [sortConfig[match] + offset, isPseudo];
}

/**
 * Finds the matching style class in sortConfig. eg. overflow-x-12 returns overflow-x-
 *
 * @param styleClass - The style class to find a match for. (overflow-x-12)
 * @param sortConfig - The sort config object.
 * @returns The longest matching sortConfig key. (overflow-x-)
 */
export function findLongestMatch(
  styleClass: string,
  sortConfig: { [key: string]: number }
) {
  const baseClass = styleClass.split(colonRegex).pop() || styleClass;

  let longestMatch = "";
  for (const key in sortConfig) {
    if (baseClass === key) {
      return key;
    }

    // escape chars that could mess with regex
    const escapedKey = key.replace(/[-[\]\\]/g, "\\$&");

    // can match keys:
    // starting with `-`, or `!`,
    // ending with `-` or `/`
    // ex: invert matches -invert/ but not -inverted/
    // w lookahead https://regex101.com/r/io1gzM/5
    // without https://regex101.com/r/DEWLfo/2
    const lookahead = key.endsWith("-") ? "" : "(?=[-/]|$)";
    const validSection = new RegExp(`(?<=^|[-!])${escapedKey}${lookahead}`);

    const keyInStyleClass =
      validSection.test(baseClass) ||
      // allow _ prefix for ignored classes
      baseClass.startsWith("_" + key);

    if (keyInStyleClass && key.length > longestMatch.length) {
      longestMatch = key;
    }
  }
  return longestMatch;
}

/**
 * Compares two Tailwind classes with pseudo variants to determine their sort order
 *
 * @param aClass - The first class to compare (hover:bg-blue-500)
 * @param bClass - The second class to compare (focus:bg-green-500)
 * @param pseudoClasses - Order to sort pseudo classes by
 * @returns A comparison value to use in a sort function
 */
function comparePseudoClasses(
  aClass: string,
  bClass: string,
  pseudoClasses: string[]
) {
  let aPseudoChain = aClass.split(colonRegex);
  let bPseudoChain = bClass.split(colonRegex);

  const chainLen = Math.min(aPseudoChain.length, bPseudoChain.length);

  for (let i = 0; i < chainLen; i++) {
    let aPseudoClass = aPseudoChain[i];
    let bPseudoClass = bPseudoChain[i];

    let aPseudo = pseudoClasses.find((c) => aPseudoClass.includes(c));
    let bPseudo = pseudoClasses.find((c) => bPseudoClass.includes(c));

    if (pseudoClasses.includes("support-")) {
      if (aPseudoClass.includes("support-")) {
        aPseudo = "support-";
      }
      if (bPseudoClass.includes("support-")) {
        bPseudo = "support-";
      }
    }

    if (pseudoClasses.includes("group-")) {
      if (aPseudoClass.includes("group-")) {
        aPseudo = "group-";
      }
      if (bPseudoClass.includes("group-")) {
        bPseudo = "group-";
      }
    }

    if (pseudoClasses.includes("peer-")) {
      if (aPseudoClass.includes("peer-")) {
        aPseudo = "peer-";
      }
      if (bPseudoClass.includes("peer-")) {
        bPseudo = "peer-";
      }
    }

    if (aPseudo && bPseudo) {
      if (aPseudo === bPseudo) {
        continue;
      }

      return pseudoClasses.indexOf(aPseudo) - pseudoClasses.indexOf(bPseudo);
    }
  }

  // otherwise sort alphabetically
  return aClass.localeCompare(bClass);
}
