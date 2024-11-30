import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import sortTailwind from "../sortTailwind";
import { defaultClassesMap } from "./_defaultClassMap";

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

  test("Empty string present", () => {
    const sortedString = `<div className=''></div><div className='flex flex-col' blah blah`;
    const unsortedString = `<div className=''></div><div className='flex-col flex' blah blah`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Multi string types", () => {
    const sortedString = `<div className="flex flex-col"></div><div className='flex flex-col' blah blah`;
    const unsortedString = `<div className="flex-col flex"></div><div className='flex-col flex' blah blah`;

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

  test("Dot in class", () => {
    const sortedString = `class="bg-[url('image.jpg')] text-black"`;
    const unsortedString = `class="text-black bg-[url('image.jpg')]"`;

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

  test("Leptos syntax", () => {
    const sortedString = `<button class="flex flex-row" on:click=on_click>"Welcome to Leptos!"</button>`;
    const unsortedString = `<button class="flex-row flex" on:click=on_click>"Welcome to Leptos!"</button>`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Yew syntax", () => {
    const sortedString = `<button class="bg-blue-500 text-white" onclick={ctx.link().callback(|_| Msg::Random)}>{ "Random" }</button>`;
    const unsortedString = `<button class="text-white bg-blue-500" onclick={ctx.link().callback(|_| Msg::Random)}>{ "Random" }</button>`;

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

  test(`Inside brackets twMerge(`, () => {
    const sortedString = `<aside className={twMerge('flex p-4')}>`;
    const unsortedString = `<aside className={twMerge(' p-4     flex    ')}>`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test(`Inside brackets w space twMerge(`, () => {
    const sortedString = `<aside className={ twMerge('flex p-4')}>`;
    const unsortedString = `<aside className={ twMerge(' p-4     flex    ')}>`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test(`Newline twMerge(`, () => {
    const sortedString = `const classes = {
      container: twMerge(
        "grid-cols-2 lg:grid-cols-[1fr, auto]"
      ),
    };`;
    const unsortedString = `const classes = {
      container: twMerge(
        "lg:grid-cols-[1fr, auto] grid-cols-2"
      ),
    };`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test(`Complex newline clsx(`, () => {
    const sortedString = `<span
        className={clsx(
          "px-2 py-1",
          {
            "bg-gray-100 text-gray-500": status === "pending",
            "bg-green-500 text-white": status === "paid",
          }
        )}
      ></span>`;
    const unsortedString = `<span
        className={clsx(
          "py-1 px-2",
          {
            "bg-gray-100 text-gray-500": status === "pending",
            "bg-green-500 text-white": status === "paid",
          }
        )}
      ></span>`;

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
    const unsortedString = `clsx('text-base           bg-blue-500     ')`;

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
});

suite("@apply Sorting", () => {
  const { classesMap, pseudoSortOrder } = defaultClassesMap();

  test("css", () => {
    const unsortedString = `
    .btn {
      @apply hover:bg-blue-700 bg-blue-500;
    }
    `;
    const sortedString = `
    .btn {
      @apply bg-blue-500 hover:bg-blue-700;
    }
    `;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("nested css", () => {
    const unsortedString = `
    .btn {
    button{@apply hover:bg-blue-700 bg-blue-500;}
    }
    `;
    const sortedString = `
    .btn {
    button{@apply bg-blue-500 hover:bg-blue-700;}
    }
    `;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("nested scss", () => {
    const unsortedString = `
    .card {
      @apply text-white bg-black;
      &__header {
        @apply text-white bg-black;
      }
      &__content {
        @apply py-4 px-6 ;
      }
    }
    `;
    const sortedString = `
    .card {
      @apply bg-black text-white;
      &__header {
        @apply bg-black text-white;
      }
      &__content {
        @apply px-6 py-4;
      }
    }
    `;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("style block", () => {
    const unsortedString = `
    <template>
      <button class="btn">Click me</button>
    </template>
    <style lang="postcss">
    .btn {
      @apply py-2 px-4;
    }
    </style>
    `;
    const sortedString = `
    <template>
      <button class="btn">Click me</button>
    </template>
    <style lang="postcss">
    .btn {
      @apply px-4 py-2;
    }
    </style>
    `;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("multiple applys", () => {
    const unsortedString = `
    .btn {
      @apply flex-1 flex items-center;
      @apply text-white bg-black;
      @apply hover:bg-blue-700 bg-blue-500;
    }
    `;
    const sortedString = `
    .btn {
      @apply flex flex-1 items-center;
      @apply bg-black text-white;
      @apply bg-blue-500 hover:bg-blue-700;
    }
    `;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("media queries", () => {
    const unsortedString = `
    .container {
      @apply text-white bg-black;
      @screen sm {
        @apply text-white bg-black;
      }
      @screen lg {
        @apply text-white bg-black;
      }
    }
    `;
    const sortedString = `
    .container {
      @apply bg-black text-white;
      @screen sm {
        @apply bg-black text-white;
      }
      @screen lg {
        @apply bg-black text-white;
      }
    }
    `;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("pseudo-classes and modifiers", () => {
    const unsortedString = `
    .input {
      @apply py-2 px-4;
      &:focus {
        @apply outline-none py-2;
      }
      &:disabled {
        @apply outline-none py-2;
      }
    }
    `;
    const sortedString = `
    .input {
      @apply px-4 py-2;
      &:focus {
        @apply py-2 outline-none;
      }
      &:disabled {
        @apply py-2 outline-none;
      }
    }
    `;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("complex selectors", () => {
    const unsortedString = `
    .form {
      .label {
        @apply text-white bg-black;
      }
      > .group {
        @apply text-white bg-black;
        + .group {
          @apply text-white bg-black;
        }
      }
    }
    `;
    const sortedString = `
    .form {
      .label {
        @apply bg-black text-white;
      }
      > .group {
        @apply bg-black text-white;
        + .group {
          @apply bg-black text-white;
        }
      }
    }
    `;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("empty lines", () => {
    const unsortedString = `
    .btn {
      @apply text-white
  
             bg-blue-500;
    }`;
    const sortedString = `
    .btn {
      @apply bg-blue-500 text-white;
    }`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("important modifier", () => {
    const unsortedString = `
    .btn {
      @apply text-white !bg-blue-500;
    }`;
    const sortedString = `
    .btn {
      @apply !bg-blue-500 text-white;
    }`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("complex arbitrary values", () => {
    const unsortedString = `
    .btn {
      @apply text-[clamp(1rem,2vw,1.5rem)] bg-[rgb(0,0,0)];
    }`;
    const sortedString = `
    .btn {
      @apply bg-[rgb(0,0,0)] text-[clamp(1rem,2vw,1.5rem)];
    }`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("apply and class sort", () => {
    const unsortedString = `<style lang="postcss" class='text-white bg-black'>
      .btn {
        @apply py-2 px-4;
      }
      </style>`;
    const sortedString = `<style lang="postcss" class='bg-black text-white'>
      .btn {
        @apply px-4 py-2;
      }
      </style>`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });
});
