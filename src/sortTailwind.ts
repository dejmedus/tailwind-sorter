export default function sortTailwind(
  text: string,
  sortConfig: { [key: string]: number },
  pseudoClasses: string[]
) {
  const regex = /class(Name)?=("([^"]*)"|'([^']*)')/g;

  const newText = text.replace(
    regex,
    (match, g1, g2, doubleQuotesGroup, singleQuotesGroup) => {
      const quotesGroup = singleQuotesGroup || doubleQuotesGroup;

      // remove all dynamic classes from sort
      const { originalString, unsortedClasses } =
        getUnsortedClasses(quotesGroup);

      const originalClasses = originalString
        .split(/\s+/)
        .filter((className) => className.trim() !== "");

      if (!originalClasses.length) {
        // if there is nothing to sort, return the original string
        // same as return match;
        return match.replace(quotesGroup, unsortedClasses);
      }

      const sortedClasses = originalClasses.sort(
        (aClass: string, bClass: string) => {
          const a = findLongestMatch(aClass, sortConfig);
          const b = findLongestMatch(bClass, sortConfig);
          // if (!a) {
          //   console.error(`Class not found in sortConfig: ${aClass}`);
          // }
          // if (!b) {
          //   console.error(`Class not found in sortConfig: ${bClass}`);
          // }
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
            //  unless they are pseudo classes, then sort by pseudo config or default: sm, md, lg, xl, 2xl, hover, focus, active, visited, disabled, dark, first, last, odd, even, group-over, group-focus, motion-safe, motion-reduce
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

      const newString = unsortedClasses
        ? sortedClasses.join(" ") + " " + unsortedClasses
        : sortedClasses.join(" ");

      return match.replace(quotesGroup, newString);
    }
  );

  return newText;
}

function findLongestMatch(str: string, sortConfig: { [key: string]: number }) {
  let longestMatch = "";
  for (const key in sortConfig) {
    if (str.includes(key) && key.length > longestMatch.length) {
      longestMatch = key;
    }
  }
  return longestMatch;
}

function getUnsortedClasses(text: string) {
  // const doubleBrackets = text.matchAll(/{{.*?}}/g);
  // const singleBrackets = text.matchAll(/{.*?}/g);
  // console.log(
  //   "doubleBrackets:",
  //   doubleBrackets,
  //   "singleBrackets:",
  //   singleBrackets
  // );

  if (!text.includes("{")) {
    return { originalString: text, unsortedClasses: "" };
  }

  let brackets = Array.from(text.matchAll(/{{.*?}}|{.*?}/g));

  if (brackets.length === 0) {
    return { originalString: text, unsortedClasses: "" };
  }

  let joinedString = brackets.map((match) => match[0]).join(" ");

  text = text.replaceAll(/{{.*?}}/g, "");
  text = text.replaceAll(/{.*?}/g, "");

  // console.log("text:", text, "unsorted:", joinedString);
  return { originalString: text, unsortedClasses: joinedString };
}
