export default function sortTailwind(
  text: string,
  sortConfig: { [key: string]: number }
) {
  const regex = /class(Name)?=["']([^"']*)["']/g;
  const newText = text.replace(regex, (match, p1, p2) => {
    const originalClasses = p2.split(/\s+/);
    const classGroups: { [key: string]: string[] } = {};
    for (const cls of originalClasses) {
      const parts = cls.split(":");
      const baseClass = parts.pop() || "";
      const pseudoClass = parts.join(":");
      if (!classGroups[baseClass]) {
        classGroups[baseClass] = [];
      }
      classGroups[baseClass].push(pseudoClass);
    }
    const sortedClasses = [];
    for (const baseClass of Object.keys(classGroups).sort((a, b) => {
      const aPrefix = findLongestPrefix(a, sortConfig);
      const bPrefix = findLongestPrefix(b, sortConfig);
      if (!aPrefix) {
        console.error(`Class not found in sortConfig: ${a}`);
      }
      if (!bPrefix) {
        console.error(`Class not found in sortConfig: ${b}`);
      }
      const aIndex = sortConfig[aPrefix] || Number.MAX_VALUE;
      const bIndex = sortConfig[bPrefix] || Number.MAX_VALUE;
      return aIndex - bIndex;
    })) {
      const pseudoClasses = classGroups[baseClass];
      pseudoClasses.sort();
      for (const pseudoClass of pseudoClasses) {
        sortedClasses.push(
          pseudoClass ? `${pseudoClass}:${baseClass}` : baseClass
        );
      }
    }
    return match.replace(p2, sortedClasses.join(" "));
  });

  return newText;
}

function findLongestPrefix(str: string, sortConfig: { [key: string]: number }) {
  let longestPrefix = "";
  for (const prefix in sortConfig) {
    if (str.startsWith(prefix) && prefix.length > longestPrefix.length) {
      longestPrefix = prefix;
    }
  }
  return longestPrefix;
}
