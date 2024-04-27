import * as vscode from "vscode";
import {
  defaultCategories,
  defaultSortOrder,
  defaultPseudoSortOrder,
} from "./lib/defaultConfig";

/**
 * Retrieves the classes map and pseudo class sort order from the workspace configuration.
 * If the configuration is invalid or missing, default values are used.
 *
 * @returns An object containing the classes map and pseudo class sort order.
 */
export default function getClassesMap() {
  const config = vscode.workspace.getConfiguration("tailwindSorter");

  let categories: { [category: string]: string[] } = config.get(
    "categories",
    {}
  );
  if (!categories || Object.keys(categories).length === 0) {
    categories = defaultCategories;
    console.error(
      "Tailwind Sorter: No categories found in settings. Using default categories."
    );
  }
  const categoryOrder: { [category: string]: string[] } = config.get(
    "categoryOrder",
    {}
  );
  let sortOrder: string[] = categoryOrder.sortOrder || defaultSortOrder;
  if (
    !categoryOrder ||
    !categoryOrder.sortOrder ||
    categoryOrder.sortOrder.length === 0
  ) {
    console.error(
      "Tailwind Sorter: No category order found in settings. Using default category order."
    );
  }
  const pseudoClassesOrder: { [category: string]: string[] } = config.get(
    "pseudoClassesOrder",
    {}
  );
  let pseudoSortOrder: string[] =
    pseudoClassesOrder.sortOrder || defaultPseudoSortOrder;
  if (
    !pseudoClassesOrder ||
    !pseudoClassesOrder.sortOrder ||
    pseudoClassesOrder.sortOrder.length === 0
  ) {
    console.error(
      "Tailwind Sorter: No pseudo class order found in settings. Using default pseudo class order."
    );
  }

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
    categories = defaultCategories;
    sortOrder = defaultSortOrder;
    pseudoSortOrder = defaultPseudoSortOrder;
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
