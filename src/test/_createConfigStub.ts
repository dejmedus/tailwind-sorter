import * as vscode from "vscode";
import * as sinon from "sinon";

import {
  defaultCategories,
  defaultSortOrder,
  defaultPseudoSortOrder,
  defaultCustomPrefixes,
  defaultSortOnSave,
  defaultSectionOrder
} from "../lib/defaultConfig";

export default function createConfigStub(options = {}) {
  const defaults = {
    categories: defaultCategories,
    categoryOrder: { sortOrder: defaultSortOrder },
    pseudoClassesOrder: { sortOrder: defaultPseudoSortOrder },
    customPrefixes: defaultCustomPrefixes,
    sortOnSave: defaultSortOnSave,
    sectionOrder: defaultSectionOrder,
    includeLanguages: [],
    excludeLanguages: [],
    ignorePaths: [],
    useOfficialSort: false
  };

  const config = { ...defaults, ...options };

  return sinon
    .stub(vscode.workspace, "getConfiguration")
    .callsFake((section) => {
      if (section === "tailwindSorter") {
        return {
          get: (key: string) => {
            switch (key) {
              case "categories":
                return config.categories;
              case "categoryOrder":
                return config.categoryOrder;
              case "pseudoClassesOrder":
                return config.pseudoClassesOrder;
              case "customPrefixes":
                return config.customPrefixes;
              case "includeLanguages":
                return config.includeLanguages;
              case "excludeLanguages":
                return config.excludeLanguages;
              case "ignorePaths":
                return config.ignorePaths;
              case "sortOnSave":
                return config.sortOnSave;
              case "sectionOrder":
                return config.sectionOrder;
              case "useOfficialSort":
                return config.useOfficialSort;
              default:
                return undefined;
            }
          }
        } as vscode.WorkspaceConfiguration;
      }
      return {} as vscode.WorkspaceConfiguration;
    });
}
