import sortTailwind from "../sortTailwind";
import getClassesMap from "../getClassesMap";

const sortHelper = (unsortedStr: string) => {
  const { classesMap, pseudoSortOrder, sectionOrder } = getClassesMap();

  return sortTailwind(unsortedStr, {
    mode: "extension",
    classesMap,
    pseudoSortOrder,
    sectionOrder
  });
};

const officialSortHelper = (unsortedStr: string, sorter: any) => {
  return sortTailwind(unsortedStr, {
    mode: "official",
    sorter
  });
};

export { officialSortHelper };
export default sortHelper;
