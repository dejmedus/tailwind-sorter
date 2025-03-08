import * as assert from "assert";

import sortTailwind from "../sortTailwind";
import { defaultClassesMap } from "./_defaultClassMap";

suite("Ignore sorting", () => {
  const { classesMap, pseudoSortOrder } = defaultClassesMap();

  test("Dynamic styles class={` ternary ': do not change", () => {
    const sortedString =
      "<div class={`button ${isActive ? 'button-active' : 'button-inactive'}`}";
    const unsortedString =
      "<div class={`button ${isActive ? 'button-active' : 'button-inactive'}`}";

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test('Dynamic styles class={` ternary ": do not change', () => {
    const sortedString =
      '<div class={`button ${isActive ? "button-active" : "button-inactive"}`}';
    const unsortedString =
      '<div class={`button ${isActive ? "button-active" : "button-inactive"}`}';

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Dynamic styles className={`: do not change", () => {
    const sortedString =
      "<div className={`flex items-center gap-1.5 rounded-lg border-2 px-3 py-1.5 ${buttonClasses.DEFAULT}`}";
    const unsortedString =
      "<div className={`flex items-center gap-1.5 rounded-lg border-2 px-3 py-1.5 ${buttonClasses.DEFAULT}`}";

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Dynamic Vue.js syntax: do not change", () => {
    const sortedString = `<div :class="{ 'text-white': isActive, 'bg-blue-500': isActive }"`;
    const unsortedString = `<div :class="{ 'text-white': isActive, 'bg-blue-500': isActive }"`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Vue.js :class array: do not change", () => {
    const sortedString = `<div :class="[{ 'bg-red-500': !isActive, 'bg-blue-500': isActive }, 'text-white']`;
    const unsortedString = `<div :class="[{ 'bg-red-500': !isActive, 'bg-blue-500': isActive }, 'text-white']`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Conditional Angular syntax: do not change", () => {
    const sortedString = `<div [class.text-white]="isPrimary" [class.bg-blue-500]="isPrimary"`;
    const unsortedString = `<div [class.text-white]="isPrimary" [class.bg-blue-500]="isPrimary"`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Dynamic Angular: do not change", () => {
    const sortedString = `<div class="'bg-' + (isActive ? 'green' : 'red') + '-500'"></div>`;
    const unsortedString = `<div class="'bg-' + (isActive ? 'green' : 'red') + '-500'"></div>`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Nunjucks syntax: do not change", () => {
    const sortedString = `<div class="bg-blue {{ widget.size }}  case-video-container {{ widget.marginTop }} {{ widget.marginBottom }} waiting appear appear-video-playing text-lg"`;
    const unsortedString = `<div class="bg-blue {{ widget.size }}  case-video-container {{ widget.marginTop }} {{ widget.marginBottom }} waiting appear appear-video-playing text-lg"`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("HTMX syntax: do not change", () => {
    const sortedString = `<div data-htmx-class="bg-blue-500:text-white:bg-gray-300"`;
    const unsortedString = `<div data-htmx-class="bg-blue-500:text-white:bg-gray-300"`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  const isActive = true;
  test("HTMX dynamic syntax: do not change", () => {
    const sortedString = `<div data-htmx-class="${
      isActive
        ? "bg-blue-500:text-white:bg-gray-300"
        : "bg-white:text-gray-500:bg-blue-300"
    }"`;
    const unsortedString = `<div data-htmx-class="${
      isActive
        ? "bg-blue-500:text-white:bg-gray-300"
        : "bg-white:text-gray-500:bg-blue-300"
    }"`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Alpine.js syntax: do not change", () => {
    const unsortedString = `<div x-data="{ isPrimary: true, isActive: true }"`;
    const sortedString = `<div x-data="{ isPrimary: true, isActive: true }"`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Alpine.js dynamic syntax: do not change", () => {
    const unsortedString = `<div x-bind:class="basketItem.quantity  === 1 ? 'bg-slate-200' : ''"`;
    const sortedString = `<div x-bind:class="basketItem.quantity  === 1 ? 'bg-slate-200' : ''"`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Svelte syntax: do not change", () => {
    const sortedString = `<div class:isActive="bg-blue-400 text-white bg-blue-500"`;
    const unsortedString = `<div class:isActive="bg-blue-400 text-white bg-blue-500"`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Svelte dynamic syntax: do not change", () => {
    const sortedString = `<div class:isActive={isActive ? "bg-blue-400 text-white bg-blue-500" : "text-gray-500 bg-white"}`;
    const unsortedString = `<div class:isActive={isActive ? "bg-blue-400 text-white bg-blue-500" : "text-gray-500 bg-white"}`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Svelte dynamic styles: do not change", () => {
    const sortedString = `<div class:isActive={isActive} class="bg-{color}-400 text-white">`;
    const unsortedString = `<div class:isActive={isActive} class="bg-{color}-400 text-white">`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Svelte multiple dynamic class: do not change", () => {
    const sortedString = `<div class:isActive={isActive} class="bg-blue-400 text-white {isDisabled ? 'opacity-50' : ''}">`;
    const unsortedString = `<div class:isActive={isActive} class="bg-blue-400 text-white {isDisabled ? 'opacity-50' : ''}">`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Elixir dynamic syntax: do not change", () => {
    const sortedString = `
    <li class={"#{case item.status do
      :pending -> "bg-yellow-100"
      :completed -> "bg-green-100"
      :in_progress -> "bg-blue-100"
    end} p-2 mb-2"}>
    `;
    const unsortedString = `
    <li class={"#{case item.status do
      :pending -> "bg-yellow-100"
      :completed -> "bg-green-100"
      :in_progress -> "bg-blue-100"
    end} p-2 mb-2"}>
    `;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Phoenix dynamic syntax <%=: do not change", () => {
    const sortedString = `<button class="mt-5 px-4 py-2 <%= @button_color %> text-white rounded hover:<%= @button_hover_color %>"></button>`;
    const unsortedString = `<button class="mt-5 px-4 py-2 <%= @button_color %> text-white rounded hover:<%= @button_hover_color %>"></button>`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Phoenix dynamic syntax brackets: do not change", () => {
    const sortedString = `<span class={if @counter > 5, do: "text-2xl text-red-500", else: "text-2xl text-gray-500"} id="counter">`;
    const unsortedString = `<span class={if @counter > 5, do: "text-2xl text-red-500", else: "text-2xl text-gray-500"} id="counter">`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Tailwind merge vars only: do not change", () => {
    const sortedString =
      "<button {...props} className={twMerge(BTN_PRIMARY_CLASSNAMES, props.className)} />";

    const unsortedString =
      "<button {...props} className={twMerge(BTN_PRIMARY_CLASSNAMES, props.className)} />";

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Tailwind merge dynamic: do not change", () => {
    const sortedString = `<div
            className={twMerge(
                TYPOGRAPHY_STYLES_LABEL_SMALL,
                'grid w-max gap-2',
                forceHover ? 'bg-gray-200' : ['bg-white', !disabled && 'hover:bg-gray-200'],
                isMuted && 'text-gray-600',
                className,
            )}
        >`;

    const unsortedString = `<div
            className={twMerge(
                TYPOGRAPHY_STYLES_LABEL_SMALL,
                'grid w-max gap-2',
                forceHover ? 'bg-gray-200' : ['bg-white', !disabled && 'hover:bg-gray-200'],
                isMuted && 'text-gray-600',
                className,
            )}
        >`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("clsx dynamic syntax: do not change", () => {
    const sortedString = `clsx({ foo:true }, { bar:false }, null, { '--foobar':'hello' })`;
    const unsortedString = `clsx({ foo:true }, { bar:false }, null, { '--foobar':'hello' })`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("cva array: do not sort", () => {
    const sortedString = `const cardBase = cva(["card", "border-solid", "border-slate-300", "rounded"], {
      variants: {
        shadow: {
          md: "drop-shadow-md",
          lg: "drop-shadow-lg",
          xl: "drop-shadow-xl",
        },
      },
    })`;
    const unsortedString = `const cardBase = cva(["card", "border-solid", "border-slate-300", "rounded"], {
      variants: {
        shadow: {
          md: "drop-shadow-md",
          lg: "drop-shadow-lg",
          xl: "drop-shadow-xl",
        },
      },
    })`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("PHP Symfony cva; do not sort", () => {
    const unsortedString = `{% set buttonVariants = cva({
    base: 'inline-flex items-center justify-center gap-2 w-fit whitespace-nowrap rounded-md text-sm font-medium transition-colors',
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        },
    },
}) %}`;
    const sortedString = unsortedString;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("cva dynamic: do not sort", () => {
    const sortedString = `cva({ 'bg-blue-700 text-gray-100': isHovering })`;
    const unsortedString = `cva({ 'bg-blue-700 text-gray-100': isHovering })`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("React dynamic apply: do not change", () => {
    const sortedString = `<style jsx>{\`.btn { @apply bg-\${color} text-white; }\`}</style>`;
    const unsortedString = `<style jsx>{\`.btn { @apply bg-\${color} text-white; }\`}</style>`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Vue dynamic apply: do not change", () => {
    const sortedString = `<style>.btn { @apply bg-{{ color }} text-{{ textColor }}; }</style>`;
    const unsortedString = `<style>.btn { @apply bg-{{ color }} text-{{ textColor }}; }</style>`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Elixir/Phoenix dynamic apply: do not change", () => {
    const sortedString = `<style>.btn { @apply bg-<%= @color %> text-white; }</style>`;
    const unsortedString = `<style>.btn { @apply bg-<%= @color %> text-white; }</style>`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("SCSS dynamic apply: do not change", () => {
    const sortedString = `.btn { @apply bg-#{$base-color}-#{$shade + 100} text-white; }`;
    const unsortedString = `.btn { @apply bg-#{$base-color}-#{$shade + 100} text-white; }`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Astro dynamic apply: do not change", () => {
    const sortedString = `<style>.btn { @apply bg-{color} text-white; }</style>`;
    const unsortedString = `<style>.btn { @apply bg-{color} text-white; }</style>`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("CSS variables: do not change", () => {
    const sortedString = `.btn { @apply bg-var(--color) text-white; }`;
    const unsortedString = `.btn { @apply bg-var(--color) text-white; }`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("SCSS dynamic: do not change", () => {
    const sortedString = `.btn { @apply bg-#{map-get($theme, primary)} text-#{map-get($theme, text)}; }`;
    const unsortedString = `.btn { @apply bg-#{map-get($theme, primary)} text-#{map-get($theme, text)}; }`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Comments: do not change", () => {
    const unsortedString = `
    .btn {
      @apply bg-blue-500 /* comment */ text-white;
    }`;
    const sortedString = `
    .btn {
      @apply bg-blue-500 /* comment */ text-white;
    }`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Multiline apply comments: do not change", () => {
    const unsortedString = `
    .btn {
      @apply bg-blue-500 /* primary color */
             text-white /* text color */;
    }`;
    const sortedString = `
    .btn {
      @apply bg-blue-500 /* primary color */
             text-white /* text color */;
    }`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Apply without semicolon", () => {
    const unsortedString = `
    .btn {
      background-color: blue;
      @apply hover:bg-blue-700 bg-blue-500
      border: 1px solid black;
    }
    `;
    const sortedString = `
    .btn {
      background-color: blue;
      @apply hover:bg-blue-700 bg-blue-500
      border: 1px solid black;
    }
    `;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Multiline apply", () => {
    const unsortedString = `
    .btn {
      background-color: blue;
      @apply hover:bg-blue-700 
      bg-blue-500
      text-pink-500;
      border: 1px solid black;
    }
    `;
    const sortedString = `
    .btn {
      background-color: blue;
      @apply hover:bg-blue-700 
      bg-blue-500
      text-pink-500;
      border: 1px solid black;
    }
    `;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  // test("twin macro dynamic syntax: do not change", () => {
  //   const sortedString = `<div tw="hover:(text-black underline) focus:(text-blue-500 underline)" />`;
  //   const unsortedString = `<div tw="hover:(text-black underline) focus:(text-blue-500 underline)" />`;

  //   assert.strictEqual(
  //     sortTailwind(unsortedString, classesMap, pseudoSortOrder),
  //     sortedString
  //   );
  // });
});

suite("Misc. Ignore syntax", () => {
  const { classesMap, pseudoSortOrder } = defaultClassesMap();

  test("JS/TS dynamic syntax ${}: do not change", () => {
    const color = "blue";
    const sortedString = `<div class="bg-${color}-500">Hello, world!</div>`;
    const unsortedString = `<div class="bg-${color}-500">Hello, world!</div>`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("PHP dynamic syntax <?php ?>: do not change", () => {
    const sortedString = `<div class="<?php echo "bg-$color-500"; ?>">Hello, world!</div>`;
    const unsortedString = `<div class="<?php echo "bg-$color-500"; ?>">Hello, world!</div>`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("PHP dynamic syntax <?= ?>: do not change", () => {
    const sortedString = `<?php
$isActive = true;
$bgClass = $isActive ? 'bg-green-500' : 'bg-red-500';
?>

<div class="p-4 <?= $bgClass ?> text-white rounded-lg">
    <?= $isActive ? 'Active' : 'Inactive' ?>
</div>`;
    const unsortedString = `<?php
$isActive = true;
$bgClass = $isActive ? 'bg-green-500' : 'bg-red-500';
?>

<div class="p-4 <?= $bgClass ?> text-white rounded-lg">
    <?= $isActive ? 'Active' : 'Inactive' ?>
</div>`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Django dynamic syntax {% %}: do not change", () => {
    const sortedString = `<div class="bg-{% color %}-500">Hello, world!</div>`;
    const unsortedString = `<div class="bg-{% color %}-500">Hello, world!</div>`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Jinja dynamic syntax {{ }}: do not change", () => {
    const sortedString = `<div class="bg-{{ color }}-500">Hello, world!</div>`;
    const unsortedString = `<div class="bg-{{ color }}-500">Hello, world!</div>`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Ruby ERB dynamic syntax <% %>: do not change", () => {
    const sortedString = `<div class="<%= "bg-#{color}-500" %>">Hello, world!</div>`;
    const unsortedString = `<div class="<%= "bg-#{color}-500" %>">Hello, world!</div>`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("ASP.NET dynamic syntax <% %>: do not change", () => {
    const sortedString = `<div class="<%= $"bg-{color}-500" %>">Hello, world!</div>`;
    const unsortedString = `<div class="<%= $"bg-{color}-500" %>">Hello, world!</div>`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });
});
