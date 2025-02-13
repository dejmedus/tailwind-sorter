<div align="center">
<h1>Tailwind Sorter</h1>
</div>

Automatically sort Tailwind classes on save. Use your preferred sort order to keep your classes organized.

![Demo](https://github.com/dejmedus/gifs/blob/main/tailwind-sorter-demo.gif?raw=true)

## Extension Settings

Custom sort order and categories can be configured in settings.

1. Open settings
   - Click the gear icon in the bottom left corner, or
   - Navigate to `File > Preferences > Settings`
2. Search for "Tailwind Sorter" in the search bar at the top of the settings window.
3. Modify the settings according to your preferences:
   - `Tailwind Sorter: Category Order`: The order categories will be sorted.
   - `Tailwind Sorter: Categories`: Which style classes will belong to which category and in what order.
   - `Tailwind Sorter: Pseudo Classes Order`: How pseudo-classes should be ordered.
   - `Tailwind Sorter: Custom Prefixes`: Prefixes that identify class strings other than the default `class=` and `className=`.


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

**Custom Prefixes**: Tailwind Sorter checks for `class=` and `className=` as well as any custom prefixes defined in settings. Default custom prefixes include: `twMerge(`, `cva(`, and `clsx(`


#### Sorting

The extension sorts:

Any string that is preceded by a prefix and does not include dynamic syntax
   
  - *Strings:* `""` `''` ` `` `
  - *Prefixes:* `Custom prefixes` `class=`  `className=`
  - *Dynamic Syntax:* `?` `<` `{`

Single line `@apply` rules ending with a semicolon that do not include dynamic syntax (`@` `/` `{`)

#### Language Support

Currently, Tailwind Sorter supports `.html`, `.jsx`, `.tsx`, `.ex`, `.heex`, `.svelte`, `.vue`, `php`, `.rs`, `.css`, `.scss`, and `.astro` files. If you would like to see support for an additional language, please open an issue (or submit a PR).

#### With Prettier

If you don't need control over the sort order, [the prettier plugin](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier) is recommended.

- Using prettier-plugin-tailwindcss alongside Tailwind Sorter causes classes to "flash" on save.
- To prevent this, remove `prettier-plugin-tailwindcss` from `plugins: []` in your prettier config file and reload window.

