import * as vscode from "vscode";
import classesConfig from "./lib/classesConfig";

export default function getClassesMap() {
  // get config from workspace or use default properties and sort order
  const config = vscode.workspace.getConfiguration("tailwindSorter");

  let categories: { [category: string]: string[] } = config.get(
    "categories",
    {}
  );
  const categoryOrder: { [category: string]: string[] } = config.get(
    "categoryOrder",
    {}
  );
  let sortOrder: string[] = categoryOrder.sortOrder;
  const pseudoClassesOrder: { [category: string]: string[] } = config.get(
    "pseudoClassesOrder",
    {}
  );
  let pseudoSortOrder: string[] = pseudoClassesOrder.sortOrder;

  // ensure valid config files - categories in sort order must exist in categories list
  let validConfig = Object.keys(categories).length === sortOrder.length;

  if (validConfig) {
    for (let i = 0; i < sortOrder.length; i++) {
      if (!Object.keys(categories).includes(sortOrder[i])) {
        validConfig = false;
        console.error("Tailwind Sorter: No category ", sortOrder[i], " found.");

        break;
      }
    }
  }

  // if config is invalid, use defaults
  if (!validConfig || !pseudoSortOrder) {
    console.error(
      "Tailwind Sorter: Invalid configuration. Please check settings. Using default sort order."
    );
    categories = classesConfig.categories;
    sortOrder = classesConfig.order.sortOrder;
    pseudoSortOrder = classesConfig.pseudoOrder.sortOrder;
  }

  let classesMap: { [property: string]: number } = {};
  let index = 0;
  for (let i = 0; i < sortOrder.length; i++) {
    for (let j = 0; j < categories[sortOrder[i]].length; j++) {
      classesMap[categories[sortOrder[i]][j]] = index++;
    }
  }
  return { classesMap, pseudoSortOrder };
}

export function defaultClassesMap() {
  // this is just for testing purposes
  const categories: { [category: string]: string[] } = classesConfig.categories;
  const sortOrder = classesConfig.order.sortOrder;
  const pseudoSortOrder = classesConfig.pseudoOrder.sortOrder;

  let classesMap: { [property: string]: number } = {};
  let index = 0;
  for (let i = 0; i < sortOrder.length; i++) {
    for (let j = 0; j < categories[sortOrder[i]].length; j++) {
      classesMap[categories[sortOrder[i]][j]] = index++;
    }
  }
  return { classesMap, pseudoSortOrder };
}
