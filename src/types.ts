export type SortOptions =
  | {
      mode: "extension";
      classesMap: {
        [property: string]: number;
      };
      pseudoSortOrder: string[];
      sectionOrder: string[];
    }
  | { mode: "official"; sorter: any };
