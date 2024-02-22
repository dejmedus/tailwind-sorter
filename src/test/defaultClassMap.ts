// for testing purposes
import {
  defaultCategories,
  defaultSortOrder,
  defaultPseudoSortOrder,
} from "../lib/defaultConfig";

export function defaultClassesMap() {
  let classesMap: { [property: string]: number } = {};
  let index = 0;
  for (let i = 0; i < defaultSortOrder.length; i++) {
    for (let j = 0; j < defaultCategories[defaultSortOrder[i]].length; j++) {
      classesMap[defaultCategories[defaultSortOrder[i]][j]] = index++;
    }
  }
  return { classesMap, pseudoSortOrder: defaultPseudoSortOrder };
}
