<div align="center">
<h1>Tailwind Sorter</h1>
</div>

Automatically sort Tailwind classes on save. Use your preferred sort order to keep your classes organized.

## Extension Settings

Custom sort order and categories can be configured in settings.

1. Open settings
   - Click the gear icon in the bottom left corner, or
   - Press `Ctrl+` (Windows/Linux) / `Cmd+` (Mac).
2. Search for "Tailwind Sorter" in the search bar at the top of the settings window.
3. Modify the settings according to your preferences:
   - `Tailwind Sorter: Category Order`: Defines the order that categories will be sorted.
   - `Tailwind Sorter: Categories`: Defines which style classes will belong to which category and in what order.
   - `Tailwind Sorter: Pseudo Classes Order`: Defines how pseudo-classes should be ordered.

**The default category order is**: box model, grid, flexbox, background, margins and padding, borders, width and height, typography, transformations, and other`.

**The default order for pseudo-classes order is**: screens (sm, md, lg, xl, 2xl), before and after pseudo-elements, states (hover, focus, active, visited, disabled), dark mode, child selectors (first, last, odd, even), group states (group-over, group-focus), and motion preferences (motion-safe, motion-reduce).

Category example:

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

<!-- ## Release Notes

### 1.0.0

Initial release
-->
