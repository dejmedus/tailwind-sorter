import * as assert from "assert";
import * as sinon from "sinon";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import sortTailwind from "../sortTailwind";
import { defaultClassesMap } from "./_defaultClassMap";
import createConfigStub from "./_createConfigStub";

suite("Sorting", () => {
  const { classesMap, pseudoSortOrder } = defaultClassesMap();

  teardown(() => {
    sinon.restore();
  });

  test('Correct sort class=""', () => {
    const sortedString = `<div class="flex flex-col flex-1 items-center gap-20 bg-black lg:bg-pink hover:bg-purple bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 w-full font-sans font-semibold before:content-[''] after:content-['']" blah blah`;
    const unsortedString = `<div class="font-semibold after:content-[''] flex-1 flex-col gap-20 lg:bg-pink hover:bg-purple bg-gradient-to-r from-green-300 bg-black via-blue-500 to-purple-600 flex w-full font-sans before:content-[''] items-center" blah blah`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Correct sort className=''", () => {
    const sortedString = `<div className='flex flex-col flex-1 items-center gap-20 bg-black lg:bg-pink hover:bg-purple bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 w-full font-sans font-semibold before:content-[""] after:content-[""]' blah blah`;
    const unsortedString = `<div className='font-semibold after:content-[""] flex-1 flex-col gap-20 lg:bg-pink hover:bg-purple bg-gradient-to-r from-green-300 bg-black via-blue-500 to-purple-600 flex w-full font-sans before:content-[""] items-center' blah blah`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Non tailwind classes with - sort to end", () => {
    const sortedString = `<div className='relative flex justify-center self-center lg:self-start -ml-5 lg:ml-0 w-[375px] lg:w-[568px] h-[375px] lg:h-[568px] custom shape-wrapper'`;
    const unsortedString = `<div className='lg:self-start -ml-5 relative justify-center custom self-center lg:ml-0 shape-wrapper w-[375px] lg:w-[568px] h-[375px] lg:h-[568px] flex'`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Non tailwind classes keep their sort order", () => {
    const sortedString = `<div class="flex flex-col flex-1 carrot banana apple" blah blah`;
    const unsortedString = `<div class="flex-col carrot flex-1 banana flex apple" blah blah`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Non tailwind classes w duplicates keep their sort order", () => {
    const sortedString = `<div class="flex flex-col flex-1 banana carrot-1 carrot-1 hover:carrot apple" blah blah`;
    const unsortedString = `<div class="banana carrot-1 flex-col carrot-1 hover:carrot flex-1 apple flex" blah blah`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Non tailwind classes w prefix keep their sort order", () => {
    const sortedString = `<div class="tw:px-4 tw-text-2xl foo bar"><div>`;
    const unsortedString = `<div class="foo bar tw-text-2xl tw:px-4"><div>`;

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

  test("Repeat classes w pseudos", () => {
    const sortedString = `<div className="top-0 hover:lg:left-0 hover:lg:left-0 hover:lg:left-10 lg:static fixed flex justify-center"`;
    const unsortedString = `<div className="top-0 hover:lg:left-10 hover:lg:left-0 lg:static fixed flex justify-center hover:lg:left-0"`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Only pseudo classes", () => {
    const sortedString = `<div class="focus-within:ring focus-within:ring-blue-200 group-hover:text-blue-500" blah blah`;
    const unsortedString = `<div class="focus-within:ring-blue-200 group-hover:text-blue-500 focus-within:ring" blah blah`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("-not pseudo classes", () => {
    const sortedString = `<div class="bg-indigo-600 hover:not-lg:bg-indigo-700 hover:not-xl:bg-indigo-700 hover:not-focus:bg-indigo-700"`;
    const unsortedString = `<div class="hover:not-xl:bg-indigo-700 bg-indigo-600 hover:not-focus:bg-indigo-700 hover:not-lg:bg-indigo-700"`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  // https://tailwindcss.com/docs/hover-focus-and-other-states#supports
  test("supports- with []", () => {
    const sortedString = `<div class="supports-[display:flex]:flex supports-[display:grid]:grid supports-backdrop-filter:bg-black/25">`;
    const unsortedString = `<div class="supports-backdrop-filter:bg-black/25 supports-[display:flex]:flex supports-[display:grid]:grid">`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Complex arbitrary []", () => {
    const sortedString = `<div class="[&:nth-child(3)]:bg-blue-500 [&>*:not(:first-child)]:mt-2">`;
    const unsortedString = `<div class="[&>*:not(:first-child)]:mt-2 [&:nth-child(3)]:bg-blue-500">`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("-not variants with pseudo classes", () => {
    const sortedString = `<div class="4xl:not-disabled:bg-pink-400 5xl:not-disabled:bg-blue-500 max-6xl:not-disabled:bg-green-500">`;
    const unsortedString = `<div class="max-6xl:not-disabled:bg-green-500 5xl:not-disabled:bg-blue-500 4xl:not-disabled:bg-pink-400">`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Screen size pseudo classes", () => {
    const sortedString = `<div class="sm:hover:bg-blue-500 md:visited:bg-red-600 md:group-hover:bg-red-500 lg:focus-within:bg-green-500">`;
    const unsortedString = `<div class="md:visited:bg-red-600 lg:focus-within:bg-green-500 sm:hover:bg-blue-500 md:group-hover:bg-red-500">`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("group-", () => {
    const sortedString = `<div class="hover:bg-pink-500 focus-within:bg-green-500 group-hover:bg-blue-500"`;
    const unsortedString = `<div class="group-hover:bg-blue-500 focus-within:bg-green-500 hover:bg-pink-500"`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Group and peer variants", () => {
    const sortedString = `<div class="2xl:hover:bg-blue-400 hover:bg-blue-500 group-hover:bg-pink-500 peer-hover:bg-yellow-500">`;
    const unsortedString = `<div class="peer-hover:bg-yellow-500 2xl:hover:bg-blue-400 group-hover:bg-pink-500 hover:bg-blue-500">`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Group/ and group-hover/", () => {
    const sortedString = `<a class="group/edit invisible group-hover/item:visible" href="tel:{person.phone}">`;
    const unsortedString = `<a class="group-hover/item:visible invisible group/edit" href="tel:{person.phone}">`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Data and aria attributes", () => {
    const sortedString = `<div class="data-[open=true]:bg-blue-500 aria-[expanded=true]:bg-green-500 hover:bg-red-500">`;
    const unsortedString = `<div class="hover:bg-red-500 aria-[expanded=true]:bg-green-500 data-[open=true]:bg-blue-500">`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Chained container queries", () => {
    const sortedString = `<div class="flex @sm:@max-md:flex-col @sm:@max-lg:flex-col"`;
    const unsortedString = `<div class="@sm:@max-lg:flex-col @sm:@max-md:flex-col flex"`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Container queries", () => {
    const sortedString = `<div class="flex @sm:flex @md:flex @lg:flex text-black group-hover:text-blue-500"`;
    const unsortedString = `<div class="@lg:flex group-hover:text-blue-500 flex @md:flex @sm:flex text-black"`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("@container w arbitrary values", () => {
    const sortedString = `<div class="@container max-[600px]:bg-sky-300 min-[320px]:text-center">`;
    const unsortedString = `<div class="min-[320px]:text-center max-[600px]:bg-sky-300 @container">`;

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

  test("Arbitrary values with dynamic content", () => {
    const sortedString = `<div class="content-['Time:_12:30_PM'] before:content-[attr(data:time)]">`;
    const unsortedString = `<div class="before:content-[attr(data:time)] content-['Time:_12:30_PM']">`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Special characters in arbitrary []", () => {
    const sortedString = `<div class="grid-cols-[minmax(0,_1fr)_50px] w-[calc(100%-theme('spacing.2'))]">`;
    const unsortedString = `<div class="w-[calc(100%-theme('spacing.2'))] grid-cols-[minmax(0,_1fr)_50px]">`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Multiple negative values", () => {
    const sortedString = `<div class="-inset-x-4 -m-2 -skew-y-3 -translate-y-full">`;
    const unsortedString = `<div class="-skew-y-3 -translate-y-full -m-2 -inset-x-4">`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Fractional values", () => {
    const sortedString = `<div class="gap-x-1/2 grid grid-cols-[1fr,2fr] w-2/3 translate-x-1/2">`;
    const unsortedString = `<div class="translate-x-1/2 w-2/3 gap-x-1/2 grid-cols-[1fr,2fr] grid">`;

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

  test("Custom boolean data attributes", () => {
    const sortedString = `<div data-current class="bg-black opacity-75 data-current:opacity-100">`;
    const unsortedString = `<div data-current class="data-current:opacity-100 bg-black opacity-75">`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("not variant", () => {
    const sortedString = `<div class="bg-black hover:opacity-100 not-hover:opacity-75">`;
    const unsortedString = `<div class="not-hover:opacity-75 hover:opacity-100 bg-black">`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("not variant w prefix", () => {
    const sortedString = `<div class="tw:bg-black tw-hover:opacity-100 tw-not-hover:opacity-75 banana apple">`;
    const unsortedString = `<div class="banana tw-not-hover:opacity-75 apple tw-hover:opacity-100 tw:bg-black">`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("sizes", () => {
    const sortedString = `<div class="w-1/12 w-xs w-md hover:w-md w-2xl">`;
    const unsortedString = `<div class="w-md w-xs w-2xl w-1/12 hover:w-md">`;

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

  test("PHP Laravel syntax", () => {
    const sortedString = `<button wire:click="increment" class="bg-blue-500 text-white">
        Increment Count
    </button>`;
    const unsortedString = `<button wire:click="increment" class="text-white bg-blue-500">
        Increment Count
    </button>`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("PHP syntax", () => {
    const sortedString = `<button class="bg-blue-500 text-white" onclick="<?php echo $link; ?>"><?php echo $label; ?></button>`;
    const unsortedString = `<button class="text-white bg-blue-500" onclick="<?php echo $link; ?>"><?php echo $label; ?></button>`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("PHP Symfony Twig syntax", () => {
    const sortedString = `{% block sidebar %}
       <a href="{{ path('homepage') }}" class="block px-4">Home</a>
{% endblock %}`;
    const unsortedString = `{% block sidebar %}
       <a href="{{ path('homepage') }}" class="px-4 block">Home</a>
{% endblock %}`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Svelte syntax", () => {
    const sortedString = `<div class:isActive={isActive && !isDisabled} class="bg-blue-400 bg-blue-500 text-white">`;
    const unsortedString = `<div class:isActive={isActive && !isDisabled} class="bg-blue-400 text-white bg-blue-500">`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Rails erb helper tag", () => {
    createConfigStub({ customPrefixes: ["class:"] });

    const sortedString = `<%= f.label :name, class: "bg-blue-400 bg-blue-500 text-white" %>`;
    const unsortedString = `<%= f.label :name, class: "bg-blue-500 text-white bg-blue-400" %>`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Rails erb helper tag with ()", () => {
    createConfigStub({ customPrefixes: ["class:"] });

    const sortedString = `<%= form_with(model: @user, class: 'bg-pink-500 text-white') do |f| %>`;
    const unsortedString = `<%= form_with(model: @user, class: 'text-white bg-pink-500') do |f| %>`;

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

  test("allow _ prefix for ignored classes", () => {
    const sortedString = `<div class="flex _flex-col justify-center gap-6 bg-white _shadow-2xl p-8 border _hover:border-yellow-400 rounded-4xl w-lg custom_flex">`;
    const unsortedString = `<div class="_shadow-2xl justify-center custom_flex gap-6 _hover:border-yellow-400 bg-white _flex-col p-8 border flex rounded-4xl w-lg">`;

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
      background-color: blue;
    }
    `;
    const sortedString = `
    .btn {
      @apply bg-blue-500 hover:bg-blue-700;
      background-color: blue;
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
    const unsortedString = `<style class='text-white bg-black'>
      .btn {
        @apply py-2 px-4;
      }
      </style>`;
    const sortedString = `<style class='bg-black text-white'>
      .btn {
        @apply px-4 py-2;
      }
      </style>`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("mixed CSS and @apply", () => {
    const unsortedString = `
    .btn {
      position: relative;
      transition: all 0.2s;
      @apply text-white bg-blue-500;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }`;
    const sortedString = `
    .btn {
      position: relative;
      transition: all 0.2s;
      @apply bg-blue-500 text-white;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("css variables", () => {
    const unsortedString = `
    .card {
      --card-padding: 1rem;
      --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      
      @apply flex-1 flex text-gray-800;
      padding: var(--card-padding);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      
      &:hover {
        @apply text-white bg-blue-500;
        transform: translateY(-2px);
      }
  
      @media (min-width: 768px) {
        @apply px-6 py-4;
        --card-padding: 1.5rem;
      }
    }`;
    const sortedString = `
    .card {
      --card-padding: 1rem;
      --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      
      @apply flex flex-1 text-gray-800;
      padding: var(--card-padding);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      
      &:hover {
        @apply bg-blue-500 text-white;
        transform: translateY(-2px);
      }
  
      @media (min-width: 768px) {
        @apply px-6 py-4;
        --card-padding: 1.5rem;
      }
    }`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("realistic component styles", () => {
    const unsortedString = `
    .input-group {
      position: relative;
      display: flex;
      
      .input {
        @apply py-2 flex-1 text-gray-700;
        border: 1px solid #e2e8f0;
        transition: border-color 0.15s ease-in-out;
        
        &::placeholder {
          color: #a0aec0;
          opacity: 1;
        }
        
        &:focus {
          @apply py-2 flex-1 text-gray-700;
          border-color: #3b82f6;
        }
      }
      
      .icon {
        @apply flex items-center px-3 text-gray-500;
        background-color: #f7fafc;
        border: 1px solid #e2e8f0;
        border-left: none;
      }
    }`;
    const sortedString = `
    .input-group {
      position: relative;
      display: flex;
      
      .input {
        @apply flex-1 py-2 text-gray-700;
        border: 1px solid #e2e8f0;
        transition: border-color 0.15s ease-in-out;
        
        &::placeholder {
          color: #a0aec0;
          opacity: 1;
        }
        
        &:focus {
          @apply flex-1 py-2 text-gray-700;
          border-color: #3b82f6;
        }
      }
      
      .icon {
        @apply flex items-center px-3 text-gray-500;
        background-color: #f7fafc;
        border: 1px solid #e2e8f0;
        border-left: none;
      }
    }`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("nested @apply with @if", () => {
    const unsortedString = `
    $theme: 'dark';
    .btn {
      @apply py-2 px-4;
      @if $theme == 'dark' {
        @apply text-white bg-gray-800;
        #{&}:hover {
          @apply bg-gray-700 text-gray-100;
        }
      }
    }`;
    const sortedString = `
    $theme: 'dark';
    .btn {
      @apply px-4 py-2;
      @if $theme == 'dark' {
        @apply bg-gray-800 text-white;
        #{&}:hover {
          @apply bg-gray-700 text-gray-100;
        }
      }
    }`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("@apply with custom @", () => {
    const unsortedString = `
    @layer components {
      .btn {
        @apply text-white bg-blue-500;
        border: none;
      }
    }
    @responsive {
      .card {
        border: 1px solid white;
        @apply py-2 px-4;
      }
    }`;
    const sortedString = `
    @layer components {
      .btn {
        @apply bg-blue-500 text-white;
        border: none;
      }
    }
    @responsive {
      .card {
        border: 1px solid white;
        @apply px-4 py-2;
      }
    }`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("mixed class formats", () => {
    const unsortedString = `
    <div 
      class="text-sm flex-1"
      :class="{ 'text-white bg-blue-500': isActive }"
      [ngClass]="{'py-2 px-4': isPadded}"
      className={clsx('hover:bg-blue-600 bg-blue-500 hover:text-white', className)}>
    </div>`;
    const sortedString = `
    <div 
      class="flex-1 text-sm"
      :class="{ 'text-white bg-blue-500': isActive }"
      [ngClass]="{'py-2 px-4': isPadded}"
      className={clsx('bg-blue-500 hover:bg-blue-600 hover:text-white', className)}>
    </div>`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });
});
