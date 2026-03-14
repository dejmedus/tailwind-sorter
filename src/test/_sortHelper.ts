import sortTailwind from "../sortTailwind";
import { defaultClassesMap } from "./_defaultClassMap";

const sortHelper = (unsortedStr: string) => {
    const { classesMap, pseudoSortOrder, sectionOrder } = defaultClassesMap();
    return sortTailwind(unsortedStr, classesMap, pseudoSortOrder, sectionOrder);
};

export default sortHelper;