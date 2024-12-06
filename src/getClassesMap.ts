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
    pseudoSortOrder = defaultPseudoSortOrder;
    console.error(
      "Tailwind Sorter: No pseudo class order found in settings. Using default pseudo class order."
    );
  }

  // ensure valid config files - categories in sort order must exist in categories list
  const categoriesArr = Object.keys(categories);
  let validConfig = categoriesArr.length === sortOrder.length;

  const invalidCategories = sortOrder.filter(
    (category) => !categoriesArr.includes(category)
  );

  if (!validConfig || invalidCategories.length > 0) {
    console.error(
      "Tailwind Sorter: Invalid configuration.",
      invalidCategories.length
        ? `Categories not found: ${invalidCategories.join(", ")}`
        : "Please check settings."
    );
    categories = defaultCategories;
    sortOrder = defaultSortOrder;
    pseudoSortOrder = defaultPseudoSortOrder;
  }

  let classesMap: { [property: string]: number } = {};

  let index = 0;
  sortOrder.forEach((category) => {
    categories[category].forEach((className) => {
      classesMap[className] = index++;
    });
  });

  return { classesMap, pseudoSortOrder };
}
