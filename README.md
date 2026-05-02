<div align="center">
<h1>Tailwind Sorter</h1>
</div>

Automatically sort Tailwind classes on save or command. Use your preferred sort order to keep your classes organized.

![Demo](https://github.com/dejmedus/gifs/blob/main/tailwind-sorter-demo.gif?raw=true)

## Extension Settings

Custom sort order and categories can be configured in settings

1. Open settings
   - Click the gear icon in the bottom left corner, or
   - Navigate to `File > Preferences > Settings`
2. Search for "Tailwind Sorter" in the search bar at the top of the settings window
3. Modify the settings according to your preferences:
- [Category Order](vscode://settings/tailwindSorter.categoryOrder): The order class categories will be sorted.
- [Categories](vscode://settings/tailwindSorter.categories): Which style classes will belong to which category and in what order.
- [Pseudo Classes Order](vscode://settings/tailwindSorter.pseudoClassesOrder): How pseudo-classes should be ordered.
- [Section Order](vscode://settings/tailwindSorter.sectionOrder): The order class, pseudo class, and non-Tailwind class sections will be placed after sorting.
- [Custom Prefixes](vscode://settings/tailwindSorter.customPrefixes): Prefixes that identify class strings other than the default `class=` and `className=`.
- [Include Languages](vscode://settings/tailwindSorter.includeLanguages): Language identifiers to add to the list of supported languages. May not sort as expected.
- [Exclude Languages](vscode://settings/tailwindSorter.excludeLanguages): Language identifiers to remove from the list of supported languages. Files with these language identifiers will not be sorted.
- [Ignore Paths](vscode://settings/tailwindSorter.ignorePaths): File paths to ignore. File names matching these glob patterns will not be sorted.
- [Sort on Save](vscode://settings/tailwindSorter.sortOnSave): Whether or not classes should be sorted on save.

**The default category order is**: box model, grid, flex box, background, margins and padding, borders, width and height, typography, transformations, and other.

**The default order for pseudo-classes order is**: screens (sm, md, lg, xl, 2xl), before and after pseudo-elements, states (hover, focus, active, visited, disabled), dark mode, child selectors (first, last, odd, even), group states (group-over, group-focus), and motion preferences (motion-safe, motion-reduce).

**Category example:**

```json
"box": [
      "group",
      "block",
      "relative",
      "top",
      "right",
      "bottom",
      "left",
      "z-",
      "float",
      "clear",
      "box-border",
      "static",
      "fixed",
      "absolute",
      "sticky",
      "inset-",
    ],
```


**The default section order is**: classes (bg, text, etc.) then custom classes (non-Tailwind). By default, pseudo classes (hover:, sm:, etc.) are included in the classes section unless specified otherwise.

- default: `bg-white, md:bg-black, text-pink-500, customCSSclass`
- pseudo classes first: `md:bg-black, bg-white, text-pink-500, customCSSclass`

**Custom Prefixes**: Tailwind Sorter checks for `class=` and `className=` as well as any custom prefixes defined in settings. Default custom prefixes include: `twMerge(`, `cva(`, `clsx(`, and `cn(`

#### Command

- `Tailwind Sorter: Sort`: Sort Tailwind classes in the current file.

#### Sorting

The extension sorts:

Any string that is preceded by a prefix and does not include dynamic syntax
   
  - *Strings:* `""` `''` ` `` `
  - *Prefixes:* `Custom prefixes` `class=`  `className=`
  - *Dynamic Syntax:* `?` `<` `{`

Single line `@apply` rules ending with a semicolon that do not include dynamic syntax (`@` `/` `{`)

#### Language Support

Currently, Tailwind Sorter supports `.html`, `.jsx`, `.tsx`, `.ejs`, `.mdx`, `.ex`, `.heex`, `.twig`, `django-html`, `.svelte`, `.vue`, `.php`, `.blade.php`, `.rb`, `.erb`, `liquid`, `.rs`, `.cshtml`, `.css`, `.scss`, and `.astro` files. If you would like to see support for an additional language, please open an issue (or [submit a PR](/CONTRIBUTING.md)).

Alternatively, you can add additional [language identifiers](./CONTRIBUTING.md#1-add-the-vs-code-language-identifier) to the [Include Languages](vscode://settings/tailwindSorter.includeLanguages) list in settings. Note that sorting may not work as expected

#### With Prettier

If you don't need control over the sort order, [the prettier plugin](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier) is recommended.

- Using prettier-plugin-tailwindcss alongside Tailwind Sorter causes classes to "flash" on save.
- To prevent this, remove `prettier-plugin-tailwindcss` from `plugins: []` in your prettier config file and reload window.

