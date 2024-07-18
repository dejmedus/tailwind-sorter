import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import sortTailwind from "../sortTailwind";
import { defaultClassesMap } from "./defaultClassMap";

suite("Sorting", () => {
  const { classesMap, pseudoSortOrder } = defaultClassesMap();

  test('Correct sort class=""', () => {
    const sortedString = `<div class="flex flex-col flex-1 items-center before:content-[''] after:content-[''] gap-20 bg-black lg:bg-pink hover:bg-purple bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 w-full font-sans font-semibold" blah blah`;
    const unsortedString = `<div class="font-semibold after:content-[''] flex-1 flex-col gap-20 lg:bg-pink hover:bg-purple bg-gradient-to-r from-green-300 bg-black via-blue-500 to-purple-600 flex w-full font-sans before:content-[''] items-center" blah blah`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Correct sort className=''", () => {
    const sortedString = `<div className='flex flex-col flex-1 items-center before:content-[""] after:content-[""] gap-20 bg-black lg:bg-pink hover:bg-purple bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 w-full font-sans font-semibold' blah blah`;
    const unsortedString = `<div className='font-semibold after:content-[""] flex-1 flex-col gap-20 lg:bg-pink hover:bg-purple bg-gradient-to-r from-green-300 bg-black via-blue-500 to-purple-600 flex w-full font-sans before:content-[""] items-center' blah blah`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("One word sort", () => {
    const sortedString = `<div className='flex' blah blah`;
    const unsortedString = `<div className='flex' blah blah`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Repeat classes", () => {
    const sortedString = `<div className="top-0 left-0 left-0 left-10 lg:static fixed flex justify-center"`;
    const unsortedString = `<div className="top-0 left-10 left-0 lg:static fixed flex justify-center left-0"`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Only pseudo classes", () => {
    const sortedString = `<div class="group-hover:text-blue-500 focus-within:ring focus-within:ring-blue-200" blah blah`;
    const unsortedString = `<div class="focus-within:ring-blue-200 group-hover:text-blue-500 focus-within:ring" blah blah`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Arbitrary values", () => {
    const sortedString = `<div className='bg-[#1a1a1a] w-[100px] h-[calc(100%-1rem)]' blah blah`;
    const unsortedString = `<div className='h-[calc(100%-1rem)] w-[100px] bg-[#1a1a1a]' blah blah`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Negative margins", () => {
    const sortedString = `<div className='z-10 -mt-5 -mb-5' blah blah`;
    const unsortedString = `<div className='-mb-5 z-10 -mt-5' blah blah`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Style vars", () => {
    const sortedString = `<div class="bg-[var(--my-color)] text-black"></div>`;
    const unsortedString = `<div class="text-black bg-[var(--my-color)]"></div>`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Angular syntax", () => {
    const sortedString = `<div class="bg-blue-500 text-white"`;
    const unsortedString = `<div class="text-white bg-blue-500"`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Elixir syntax", () => {
    const sortedString = `
    def card(assigns) do
      ~L"""
      <div class="bg-blue-500 text-white">
        <.card_header {assigns} />
        <.card_body {assigns} />
        <.card_footer {assigns} />
      </div>
      """
    end
    `;
    const unsortedString = `
    def card(assigns) do
      ~L"""
      <div class="text-white bg-blue-500">
        <.card_header {assigns} />
        <.card_body {assigns} />
        <.card_footer {assigns} />
      </div>
      """
    end
    `;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Phoenix syntax", () => {
    const sortedString = `<span class="bg-blue-500 text-white" id="counter"><%= @counter %></span>`;
    const unsortedString = `<span class="text-white bg-blue-500" id="counter"><%= @counter %></span>`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Tailwind merge concat strings", () => {
    // https://github.com/dcastil/tailwind-merge

    const sortedString =
      "const classes = {\n" +
      "      container: twMerge('flex flex-col'),\n" +
      "    }";
    const unsortedString =
      "const classes = {\n" +
      "      container: twMerge('flex-col flex'),\n" +
      "    }";

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Tailwind merge multi strings", () => {
    const sortedString =
      "twMerge('bg-red hover:bg-dark-red', 'p-3 bg-[#B91C1C]')";

    const unsortedString =
      "twMerge('hover:bg-dark-red bg-red', 'p-3 bg-[#B91C1C]')";

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Tailwind merge `", () => {
    const sortedString = "twMerge(`grid-cols-2 lg:grid-cols-[1fr,auto]`)";

    const unsortedString = "twMerge(`lg:grid-cols-[1fr,auto] grid-cols-2`)";

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("clsx multi", () => {
    // https://github.com/lukeed/clsx#readme
    // ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]

    const sortedString = `clsx('bg-blue-500 text-base', { 'bg-blue-700 text-gray-100': isHovering })`;
    const unsortedString = `clsx('text-base bg-blue-500', { 'bg-blue-700 text-gray-100': isHovering })`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("clsx", () => {
    const sortedString = `clsx('bg-blue-500 text-base')`;
    const unsortedString = `clsx('text-base bg-blue-500')`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("clsx kitchen sink", () => {
    const sortedString = `clsx('bg-pink-500 text-black', [1 && 'bar', { baz:false, bat:null }, ['hello', ['world']]], 'cya')`;
    const unsortedString = `clsx('text-black bg-pink-500', [1 && 'bar', { baz:false, bat:null }, ['hello', ['world']]], 'cya')`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("cva syntax multi", () => {
    // https://cva.style/docs
    // const component = cva("base", options);
    // ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    // ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]

    const sortedString = `cva('bg-blue-500 text-white', { 'bg-blue-700 text-gray-100': isHovering })`;
    const unsortedString = `cva('text-white bg-blue-500', { 'bg-blue-700 text-gray-100': isHovering })`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("cva", () => {
    const sortedString = `const cardBase = cva("bg-pink-500 text-black"], {
      variants: {
        shadow: {
          md: "drop-shadow-md",
          lg: "drop-shadow-lg",
          xl: "drop-shadow-xl",
        },
      },
    })`;
    const unsortedString = `const cardBase = cva("text-black bg-pink-500"], {
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

  // test("twin macro", () => {
  //   // https://github.com/ben-rogerson/twin.macro

  //   const sortedString =
  //     'const Input = () => <input tw="border hover:border-black" />';
  //   const unsortedString =
  //     'const Input = () => <input tw="hover:border-black border" />';

  //   assert.strictEqual(
  //     sortTailwind(unsortedString, classesMap, pseudoSortOrder),
  //     sortedString
  //   );
  // });
});

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

  test("Vue.js syntax", () => {
    const sortedString = `<div class="bg-blue-500 text-white"`;
    const unsortedString = `<div class="text-white bg-blue-500"`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  // test("Dynamic Vue.js syntax", () => {
  //   const sortedString = `:class="{ 'bg-blue-500': isActive, 'text-white': isActive }"`;
  //   const unsortedString = `:class="{ 'text-white': isActive, 'bg-blue-500': isActive }"`;

  //   assert.strictEqual(
  //     sortTailwind(unsortedString, classesMap, pseudoSortOrder),
  //     sortedString
  //   );
  // });

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

  // test("Nunjucks syntax: keep proper brackets", () => {
  //   const sortedString = `<div class="bg-blue text-lg appear appear-video-playing case-video-container waiting {{ widget.size }} {{ widget.marginTop }} {{ widget.marginBottom }}"`;
  //   const unsortedString = `<div class="bg-blue {{ widget.size }}  case-video-container {{ widget.marginTop }} {{ widget.marginBottom }} waiting appear appear-video-playing text-lg "`;

  //   assert.strictEqual(
  //     sortTailwind(unsortedString, classesMap, pseudoSortOrder),
  //     sortedString
  //   );
  // });

  // test("Nunjucks syntax, only brackets", () => {
  //   const sortedString = `<div class="{{ widget.size }} {{ widget.marginTop }} {{ widget.marginBottom }}"`;
  //   const unsortedString = `<div class="{{ widget.size }} {{ widget.marginTop }} {{ widget.marginBottom }}"`;

  //   assert.strictEqual(
  //     sortTailwind(unsortedString, classesMap, pseudoSortOrder),
  //     sortedString
  //   );
  // });

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
    const sortedString = `<div class:isActive="text-white bg-blue-500"`;
    const unsortedString = `<div class:isActive="text-white bg-blue-500"`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Svelte dynamic syntax: do not change", () => {
    const sortedString = `<div class:isActive={isActive ? "text-white bg-blue-500" : "text-gray-500 bg-white"}`;
    const unsortedString = `<div class:isActive={isActive ? "text-white bg-blue-500" : "text-gray-500 bg-white"}`;

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

  test("cva dynamic: do not sort", () => {
    const sortedString = `cva({ 'bg-blue-700 text-gray-100': isHovering })`;
    const unsortedString = `cva({ 'bg-blue-700 text-gray-100': isHovering })`;

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
