export default function sortTailwind(
  text: string,
  sortConfig: { [key: string]: number }
) {
  const regex = /class(Name)?=("([^"]*)"|'([^']*)')/g;

  const newText = text.replace(
    regex,
    (match, g1, g2, doubleQuotesGroup, singleQuotesGroup) => {
      const originalString = singleQuotesGroup || doubleQuotesGroup;
      const originalClasses = originalString.split(/\s+/);

      const sortedClasses = originalClasses.sort(
        (aClass: string, bClass: string) => {
          const a = findLongestMatch(aClass, sortConfig);
          const b = findLongestMatch(bClass, sortConfig);
          if (!a) {
            console.error(`Class not found in sortConfig: ${aClass}`);
          }
          if (!b) {
            console.error(`Class not found in sortConfig: ${bClass}`);
          }
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
            //  unless they are pseudo classes, then sort by sm, md, lg, xl, 2xl, hover, focus, active, visited, disabled, dark, first, last, odd, even, group-over, group-focus, motion-safe, motion-reduce
            if (aIsPseudo && bIsPseudo) {
              const pseudoClasses = [
                "sm",
                "md",
                "lg",
                "xl",
                "2xl",
                "before",
                "after",
                "hover",
                "focus",
                "active",
                "visited",
                "disabled",
                "dark",
                "first",
                "last",
                "odd",
                "even",
                "group-over",
                "group-focus",
                "motion-safe",
                "motion-reduce",
              ];
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

      return match.replace(originalString, sortedClasses.join(" "));
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
