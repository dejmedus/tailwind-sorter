import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import sortTailwind from "../sortTailwind";
import getClassesMap from "../getClassesMap";
import { defaultClassesMap } from "./defaultClassMap";
import * as sinon from "sinon";

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

  // to do, update pseudo class logic
  // test("Pseudo classes", () => {
  //   const sortedString = `className="bg-black hover:bg-black dark:bg-purple-500 dark:hover:bg-white"`;
  //   const unsortedString = `className="dark:bg-purple-500 hover:bg-black bg-black dark:hover:bg-white"`;

  //   assert.strictEqual(
  //     sortTailwind(unsortedString, classesMap, pseudoSortOrder),
  //     sortedString
  //   );
  // });

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

  test("clsx syntax: do not change", () => {
    const sortedString = `clsx('rounded bg-blue-500 px-4 py-2 text-base text-white', { 'bg-blue-700 text-gray-100': isHovering })`;
    const unsortedString = `clsx('rounded bg-blue-500 px-4 py-2 text-base text-white', { 'bg-blue-700 text-gray-100': isHovering })`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("cva syntax: do not change", () => {
    const sortedString = `cva('rounded bg-blue-500 px-4 py-2 text-base text-white', { 'bg-blue-700 text-gray-100': isHovering })`;
    const unsortedString = `cva('rounded bg-blue-500 px-4 py-2 text-base text-white', { 'bg-blue-700 text-gray-100': isHovering })`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("tw syntax: do not change", () => {
    const sortedString = "tw`bg-white p-4 dark:bg-black`";
    const unsortedString = "tw`bg-white p-4 dark:bg-black`";

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

  // array with :class to combine static classes with dynamic ones
  // test("Array with Vue.js :class", () => {
  //   const sortedString = `:class="[{ 'bg-blue-500': isActive, 'bg-red-500': !isActive }, 'text-white']`;
  //   const unsortedString = `:class="[{ 'bg-red-500': !isActive, 'bg-blue-500': isActive }, 'text-white']`;

  //   assert.strictEqual(
  //     sortTailwind(unsortedString, classesMap, pseudoSortOrder),
  //     sortedString
  //   );
  // });
  test("Vue.js :class array: do not change", () => {
    const sortedString = `<div :class="[{ 'bg-red-500': !isActive, 'bg-blue-500': isActive }, 'text-white']`;
    const unsortedString = `<div :class="[{ 'bg-red-500': !isActive, 'bg-blue-500': isActive }, 'text-white']`;

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

  // test("Conditional Classes with Angular-style syntax", () => {
  //   const sortedString = `[class.bg-blue-500]="isPrimary" [class.text-white]="isPrimary"`;
  //   const unsortedString = `[class.text-white]="isPrimary" [class.bg-blue-500]="isPrimary"`;

  //   assert.strictEqual(
  //     sortTailwind(unsortedString, classesMap, pseudoSortOrder),
  //     sortedString
  //   );
  // });
  test("Conditional Angular syntax: do not change", () => {
    const sortedString = `<div [class.text-white]="isPrimary" [class.bg-blue-500]="isPrimary"`;
    const unsortedString = `<div [class.text-white]="isPrimary" [class.bg-blue-500]="isPrimary"`;

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

  test("Phoenix syntax", () => {
    const sortedString = `<span class="bg-blue-500 text-white" id="counter"><%= @counter %></span>`;
    const unsortedString = `<span class="text-white bg-blue-500" id="counter"><%= @counter %></span>`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });
});

suite("Misc. dynamic syntax", () => {
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

suite("Correct Regex", () => {
  function checkEquals(fullString: string, correctMatch: string) {
    const regex = /class(Name)?=("([^"]*)"|'([^']*)')/g;
    let match = regex.exec(fullString);
    let group = match?.[4] || match?.[3] || null;

    if (!match) {
      assert.fail("match is null");
    }
    if (!group) {
      assert.fail("group is null");
    }
    assert.strictEqual(group, correctMatch);
  }

  test(`Correct regex className=''`, () => {
    checkEquals(
      `<div blah blah blah className='relative before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[""]' blah >`,
      'relative before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[""]'
    );
  });

  test(`Correct regex className=""`, () => {
    checkEquals(
      `<div blah blah blah className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]" blah >`,
      "relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"
    );
  });

  test(`Correct regex class=''`, () => {
    checkEquals(
      `<div blah blah blah class='before:content-[""] relative before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl' blah >`,
      'before:content-[""] relative before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl'
    );
  });

  test(`Correct regex class=""`, () => {
    checkEquals(
      `<div blah blah blah class="relative before:rounded-full before:content-[''] before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl" blah >`,
      "relative before:rounded-full before:content-[''] before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl"
    );
  });
});

suite("VS Code Configuration", () => {
  let getConfigurationStub: sinon.SinonStub;

  setup(() => {
    getConfigurationStub = sinon.stub(vscode.workspace, "getConfiguration");
  });

  teardown(() => {
    getConfigurationStub.restore();
  });

  test("getClassesMap respects config", () => {
    getConfigurationStub.returns({
      get: (configName: string) => {
        if (configName === "categories") {
          return {
            category1: ["class1", "class2"],
            category2: ["class3", "class4"],
          };
        }
        if (configName === "categoryOrder") {
          return { sortOrder: ["category1", "category2"] };
        }
        if (configName === "pseudoClassesOrder") {
          return { sortOrder: ["pseudo1", "pseudo2"] };
        }
        return {};
      },
    });

    const { classesMap, pseudoSortOrder } = getClassesMap();

    assert.deepStrictEqual(classesMap, {
      class1: 0,
      class2: 1,
      class3: 2,
      class4: 3,
    });
    assert.deepStrictEqual(pseudoSortOrder, ["pseudo1", "pseudo2"]);
  });
});
