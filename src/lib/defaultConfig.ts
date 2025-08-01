// default configuration comes from package.json contributes configuration

export const defaultConfig = {
  categoryOrder: {
    sortOrder: [
      "box",
      "flex",
      "grid",
      "bg-visual",
      "margins",
      "borders",
      "sizing",
      "typography",
      "transformations",
      "other",
    ],
  },
  pseudoClassesOrder: {
    sortOrder: [
      "data-",
      "aria-",
      "supports-",
      "not-supports-",
      "portrait",
      "landscape",
      "ltr",
      "rtl",
      "min-3xs",
      "3xs",
      "max-3xs",
      "min-2xs",
      "2xs",
      "max-2xs",
      "min-xs",
      "xs",
      "max-xs",
      "min-sm",
      "sm",
      "max-sm",
      "min",
      "md",
      "max-md",
      "min-lg",
      "lg",
      "max-lg",
      "min-xl",
      "xl",
      "max-xl",
      "min-2xl",
      "2xl",
      "max-2xl",
      "min-3xl",
      "3xl",
      "max-3xl",
      "min-4xl",
      "4xl",
      "max-4xl",
      "min-5xl",
      "5xl",
      "max-5xl",
      "min-6xl",
      "6xl",
      "max-6xl",
      "min-7xl",
      "7xl",
      "max-7xl",
      "starting",
      "before",
      "after",
      "hover",
      "focus",
      "selection",
      "active",
      "open",
      "visited",
      "inert",
      "invalid",
      "disabled",
      "dark",
      "first",
      "first-line",
      "first-letter",
      "last",
      "even",
      "odd",
      "nth-",
      "nth-last-",
      "placeholder",
      "file",
      "marker",
      "backdrop",
      "focus-within",
      "motion-",
      "contrast-",
      "group-",
      "peer-",
      "*",
    ],
  },
  categories: {
    box: [
      "sr-only",
      "not-sr-only",
      "@container",
      "group",
      "group-has-",
      "peer",
      "peer-has-",
      "hidden",
      "invisible",
      "visible",
      "collapse",
      "block",
      "inline",
      "inline-block",
      "inline-flex",
      "inline-grid",
      "flow-root",
      "contents",
      "table",
      "inline-table",
      "table-",
      "top",
      "right",
      "bottom",
      "left",
      "z-",
      "float",
      "clear",
      "isolate",
      "isolation-auto",
      "box-border",
      "box-content",
      "static",
      "fixed",
      "absolute",
      "relative",
      "sticky",
      "inset-",
    ],
    grid: [
      "grid",
      "grid-cols",
      "grid-rows",
      "grid-flow-row",
      "grid-flow-col",
      "grid-auto-rows",
      "grid-auto-cols",
      "grid-",
      "col-span",
      "col-start",
      "col-end",
      "row-span",
      "row-start",
      "row-end",
      "auto-cols",
      "auto-rows",
      "columns-",
      "columns-3xs",
      "columns-2xs",
      "columns-xs",
      "columns-sm",
      "columns-md",
      "columns-lg",
      "columns-xl",
      "columns-2xl",
      "columns-3xl",
      "columns-4xl",
      "columns-5xl",
      "columns-6xl",
      "columns-7xl",
    ],
    flex: [
      "flex",
      "flex-row",
      "flex-row-reverse",
      "flex-col",
      "flex-col-reverse",
      "flex-wrap",
      "flex-wrap-reverse",
      "flex-nowrap",
      "flex-initial",
      "flex-grow",
      "flex-grow-",
      "flex-shrink",
      "flex-shrink-",
      "flex-basis",
      "flex-",
      "justify-",
      "justify-items-",
      "justify-self-",
      "items-",
      "content-normal",
      "content-center",
      "content-start",
      "content-end",
      "content-between",
      "content-around",
      "content-evenly",
      "content-baseline",
      "content-stretch",
      "self-",
      "place-items-",
      "place-content-",
      "place-self-",
      "gap-",
      "space-x",
      "space-y",
      "order-",
    ],
    "bg-visual": [
      "box-decoration-",
      "bg-",
      "bg-clip-",
      "bg-gradient",
      "bg-linear",
      "bg-conic",
      "bg-radial",
      "from-",
      "via-",
      "to-",
      "bg-origin-",
      "bg-opacity",
      "bg-cover",
      "bg-contain",
      "bg-repeat",
      "bg-repeat-",
      "bg-no-repeat",
      "bg-none",
      "bg-center",
      "bg-top",
      "bg-right",
      "bg-bottom",
      "bg-left",
      "bg-fixed",
      "bg-local",
      "bg-scroll",
      "opacity-",
      "shadow",
      "text-shadow",
      "drop-shadow-",
      "backdrop-",
      "backdrop-blur-",
      "backdrop-brightness-",
      "backdrop-contrast-",
      "backdrop-grayscale",
      "backdrop-grayscale-",
      "backdrop-hue-rotate-",
      "backdrop-invert",
      "backdrop-invert-",
      "backdrop-opacity",
      "backdrop-saturate-",
      "backdrop-sepia",
      "backdrop-sepia-",
      "blur-",
      "filter-",
      "brightness-",
      "grayscale",
      "grayscale-",
      "hue-rotate-",
      "invert",
      "invert-",
      "saturate-",
      "sepia",
      "sepia-",
      "fill-",
      "stroke-",
      "forced-color-adjust-",
    ],
    margins: [
      "m-",
      "mx-",
      "my-",
      "ms-",
      "me-",
      "mt-",
      "mr-",
      "mb-",
      "ml-",
      "p-",
      "px-",
      "py-",
      "ps-",
      "pe-",
      "pt-",
      "pr-",
      "pb-",
      "pl-",
    ],
    borders: [
      "border",
      "border-",
      "border-t",
      "border-r",
      "border-b",
      "border-l",
      "border-solid",
      "border-dashed",
      "border-dotted",
      "border-double",
      "border-opacity",
      "border-none",
      "rounded",
      "rounded-",
      "rounded-s-",
      "rounded-t-",
      "rounded-r-",
      "rounded-b-",
      "rounded-l-",
      "rounded-se-",
      "rounded-ee-",
      "rounded-es-",
      "rounded-tl-",
      "rounded-tl",
      "rounded-tr",
      "rounded-bl",
      "rounded-br",
      "outline",
      "outline-",
      "outline-offset-",
      "divide-x",
      "divide-y",
      "divide-solid",
      "divide-dashed",
      "divide-dotted",
      "divide-double",
      "divide-hidden",
      "divide-none",
      "divide-",
      "ring",
      "ring-",
      "ring-inset",
      "ring-offset",
    ],
    sizing: [
      "w-",
      "w-3xs",
      "w-2xs",
      "w-xs",
      "w-sm",
      "w-md",
      "w-lg",
      "w-xl",
      "w-2xl",
      "w-3xl",
      "w-4xl",
      "w-5xl",
      "w-6xl",
      "w-7xl",
      "min-w-",
      "min-w-3xs",
      "min-w-2xs",
      "min-w-xs",
      "min-w-sm",
      "min-w-md",
      "min-w-lg",
      "min-w-xl",
      "min-w-2xl",
      "min-w-3xl",
      "min-w-4xl",
      "min-w-5xl",
      "min-w-6xl",
      "min-w-7xl",
      "max-w-",
      "max-w-3xs",
      "max-w-2xs",
      "max-w-xs",
      "max-w-sm",
      "max-w-md",
      "max-w-lg",
      "max-w-xl",
      "max-w-2xl",
      "max-w-3xl",
      "max-w-4xl",
      "max-w-5xl",
      "max-w-6xl",
      "max-w-7xl",
      "h-",
      "min-h-",
      "max-h-",
      "size-",
      "object-",
      "aspect-",
      "overflow-",
      "overflow-x-",
      "overflow-y-",
      "overscroll-",
      "overscroll-x-",
      "overscroll-y-",
    ],
    typography: [
      "font-",
      "font-sans",
      "font-serif",
      "font-mono",
      "font-thin",
      "font-extralight",
      "font-light",
      "font-normal",
      "font-medium",
      "font-semibold",
      "font-bold",
      "font-extrabold",
      "font-black",
      "font-stretch-",
      "normal-nums",
      "ordinal",
      "slashed-zero",
      "lining-nums",
      "oldstyle-nums",
      "proportional-nums",
      "tabular-nums",
      "diagonal-fractions",
      "stacked-fractions",
      "text-",
      "text-xs",
      "text-sm",
      "text-base",
      "text-lg",
      "text-xl",
      "text-2xl",
      "text-3xl",
      "text-4xl",
      "text-5xl",
      "text-6xl",
      "text-7xl",
      "text-8xl",
      "text-9xl",
      "text-left",
      "text-center",
      "text-right",
      "text-justify",
      "text-start",
      "text-end",
      "text-opacity",
      "decoration-",
      "underline",
      "underline-",
      "no-underline",
      "overline",
      "line-through",
      "antialiased",
      "subpixel-antialiased",
      "break-",
      "truncate",
      "text-ellipsis",
      "text-clip",
      "italic",
      "capitalize",
      "uppercase",
      "lowercase",
      "normal-case",
      "indent-",
      "line-clamp-",
      "text-wrap",
      "text-nowrap",
      "text-balance",
      "text-pretty",
      "align-baseline",
      "align-top",
      "align-middle",
      "align-bottom",
      "align-text-top",
      "align-text-bottom",
      "content-",
      "align-sub",
      "align-super",
      "leading-",
      "leading",
      "tracking-",
      "tracking-tighter",
      "tracking-tight",
      "tracking-normal",
      "tracking-wide",
      "tracking-wider",
      "tracking-widest",
      "whitespace-",
      "hyphens-none",
      "hyphens-manual",
      "hyphens-auto",
    ],
    transformations: [
      "transform-",
      "rotate-",
      "rotate-x-",
      "rotate-y-",
      "rotate-z-",
      "scale-",
      "scale-x-",
      "scale-y-",
      "scale-z-",
      "skew-",
      "skew-x-",
      "skew-y-",
      "perspective-",
      "perspective-origin-",
      "origin-",
      "transition",
      "transition-",
      "translate-",
      "animate-",
      "duration-",
      "ease-linear",
      "ease-in",
      "ease-out",
      "ease-in-out",
      "ease-initial",
      "ease-",
      "delay-",
      "ease-linear",
      "backface-",
    ],
    other: [
      "accent-",
      "appearance-",
      "caret-",
      "scheme-",
      "field-sizing-",
      "resize",
      "resize-",
      "scroll-",
      "snap-",
      "touch-",
      "cursor-",
      "pointer-events-",
      "select-",
      "will-change-",
      "border-collapse",
      "border-separate",
      "border-spacing-",
      "table-auto",
      "table-fixed",
      "caption-top",
      "caption-bottom",
      "list-",
      "list-type-",
      "list-position-",
      "list-image-",
    ],
  },
};

export const defaultCategories: { [category: string]: string[] } =
  defaultConfig.categories;

export const defaultSortOrder = defaultConfig.categoryOrder.sortOrder;

export const defaultPseudoSortOrder =
  defaultConfig.pseudoClassesOrder.sortOrder;

export const defaultCustomPrefixes = ["twMerge(", "clsx(", "cva(", "cn("];
export const defaultSortOnSave = true;
