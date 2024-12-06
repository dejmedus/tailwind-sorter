// for testing purposes
import {
  defaultCategories,
  defaultSortOrder,
  defaultPseudoSortOrder,
} from "../lib/defaultConfig";

export function defaultClassesMap() {
  let classesMap: { [property: string]: number } = {};

  let index = 0;
  defaultSortOrder.forEach((category) => {
    defaultCategories[category].forEach((className) => {
      classesMap[className] = index++;
    });
  });

  return { classesMap, pseudoSortOrder: defaultPseudoSortOrder };
}
