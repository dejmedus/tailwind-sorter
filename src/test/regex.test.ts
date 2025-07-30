import * as assert from "assert";
import { restore } from "sinon";

import { createRegex } from "../lib/regex";
import createConfigStub from "./_createConfigStub";

function findMatch(fullString: string) {
  const regex = createRegex();

  let match = regex.exec(fullString);
  let group = match?.[5] || match?.[4] || match?.[3] || null;

  return group;
}

function checkEquals(fullString: string, correctMatch: string) {
  const group = findMatch(fullString);

  if (!group) {
    assert.fail("No matching string");
  }

  assert.strictEqual(group, correctMatch);
}

suite("Correct Regex", () => {
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

  test("Svelte w multiple class:", () => {
    checkEquals(
      `<div class:isActive={isActive} class:hasError={hasError} class:disabled={isDisabled} class="bg-blue-400 text-white bg-blue-500">`,
      `bg-blue-400 text-white bg-blue-500`
    );
  });

  test("Arbitrary Variables", () => {
    checkEquals(
      `<div class="mt-[calc(theme(spacing.4)+10px)]"></div>`,
      `mt-[calc(theme(spacing.4)+10px)]`
    );

    checkEquals(
      `<div class="clip-path-[polygon(0%_0%,100%_0%,100%_100%,0%_100%)]"></div>`,
      `clip-path-[polygon(0%_0%,100%_0%,100%_100%,0%_100%)]`
    );

    checkEquals(
      `<div class="blur-[calc(1rem+2px)]"></div>`,
      `blur-[calc(1rem+2px)]`
    );
  });
});

suite("Custom Prefixes", () => {
  test(`Newline twMerge(`, () => {
    checkEquals(
      `const classes = {
  container: twMerge(
    "flex flex-col items-stretch mt-4 text-[20px] lg:text-red-500"
  ),
};`,
      "flex flex-col items-stretch mt-4 text-[20px] lg:text-red-500"
    );
  });

  test(`twMerge(`, () => {
    checkEquals(
      `<div blah blah blah twMerge("relative before:rounded-full before:content-[''] before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl") blah >`,
      "relative before:rounded-full before:content-[''] before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl"
    );
  });

  test(`Inside brackets twMerge(`, () => {
    checkEquals(
      `<aside className={twMerge('fixed bottom-0 right-0 p-4')}>`,
      "fixed bottom-0 right-0 p-4"
    );
  });

  test(`Multiline brackets twMerge(`, () => {
    checkEquals(
      `className={twMerge(
        "relative h-full font-sans antialiased", 
        inter.className
        )}>`,
      "relative h-full font-sans antialiased"
    );
  });

  test(`Complex twMerge(`, () => {
    checkEquals(
      "twMerge(`lg:grid-cols-[1fr,auto] grid-cols-2`)",
      "lg:grid-cols-[1fr,auto] grid-cols-2"
    );
  });

  test(`cn(`, () => {
    checkEquals(
      `  <table
    ref={ref}
    className={cn("w-full caption-bottom text-sm", className)}
    {...props}
  />;`,
      "w-full caption-bottom text-sm"
    );
  });

  test(`Single class cn(`, () => {
    checkEquals(
      `className={cn("[&_tr]:border-b", className)} `,
      "[&_tr]:border-b"
    );
  });

  test(`Newline cn(`, () => {
    checkEquals(
      `   className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}`,
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
    );
  });

  test(`clsx(`, () => {
    checkEquals(
      `<div blah blah blah clsx('relative before:rounded-full before:content-[""] before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl') blah >`,
      'relative before:rounded-full before:content-[""] before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl'
    );
  });

  test(`Newline clsx(`, () => {
    checkEquals(
      `<span
        className={clsx(
          "px-2 items-center rounded-full inline-flex py-1 text-sm",
          {
            "bg-gray-100 text-gray-500": status === "pending",
            "bg-green-500 text-white": status === "paid",
          }
        )}
      ></span>`,
      "px-2 items-center rounded-full inline-flex py-1 text-sm"
    );
  });

  test(`Whitespace clsx(`, () => {
    checkEquals(
      `clsx(   'text-base          bg-blue-500          ')`,
      "text-base          bg-blue-500          "
    );
  });

  test(`Multi cva(`, () => {
    checkEquals(
      `cva('text-white bg-blue-500', { 'bg-blue-700 text-gray-100': isHovering })`,
      "text-white bg-blue-500"
    );
  });
});

suite("Non-Default Custom Prefixes", () => {
  teardown(() => {
    restore();
  });

  test("Potato :)", () => {
    createConfigStub({ customPrefixes: ["potato="] });

    checkEquals(
      `potato=   'text-base          bg-blue-500          '`,
      "text-base          bg-blue-500          "
    );
  });

  // https://symfony.com/doc/current/form/tailwindcss.html
  test("PHP Symfony form plugin", () => {
    createConfigStub({ customPrefixes: ["label_class|default("] });

    checkEquals(
      `{%- set label_class = label_class|default('bg-blue-500 text-white') -%}`,
      "bg-blue-500 text-white"
    );
  });

  test("Rails erb helper tags", () => {
    createConfigStub({ customPrefixes: ["class:"] });

    checkEquals(
      `<%= link_to 'New Frog', new_frog_path, class: 'bg-blue-500 text-white' %>`,
      "bg-blue-500 text-white"
    );
  });

  test("Ruby class in parenthesis", () => {
    createConfigStub({ customPrefixes: ["class:"] });

    checkEquals(
      `tag.svg(class: "size-full -rotate-90"`,
      "size-full -rotate-90"
    );
  });

  test("Rails rb view component helper tags", () => {
    createConfigStub({ customPrefixes: ["class:"] });

    checkEquals(
      `link_to 'New Frog', new_frog_path, class: 'bg-blue-500 text-white'`,
      "bg-blue-500 text-white"
    );
  });

  test("Rails rb view component special syntax", () => {
    createConfigStub({ customPrefixes: ["has_dom_class -> {"] });

    checkEquals(
      `has_dom_class -> { 'bg-blue-500 text-white' }`,
      "bg-blue-500 text-white"
    );
  });
});

suite("No Match", () => {
  function hasMatch(fullString: string, hasMatch: boolean) {
    const group = findMatch(fullString);

    assert.equal(!!group, hasMatch);
  }

  test(`Ignore dynamic PHP <?php`, () => {
    hasMatch(
      '<div class="<?php echo "bg-$color-500"; ?>">IGNORE THIS ONE</div>',
      false
    );
  });

  test(`Ignore dynamic PHP Blade $attributes`, () => {
    hasMatch(
      `<button {{ $attributes->merge(['class' => 'text-white bg-blue-500 ']) }}>
          {{ $slot }}
      </button>`,
      false
    );
  });

  test(`Ignore dynamic PHP Blade {{ }}`, () => {
    hasMatch(`<div class="alert alert-{{ $type }}">`, false);
  });

  test(`Ignore dynamic PHP <?= `, () => {
    hasMatch('<div class="<?= $themeClass ?> p-6 rounded-lg">', false);
  });

  test(`Ignore dynamic Razor @( `, () => {
    hasMatch(
      `<div class="p-4 @(isActive ? 'bg-green-200' : 'bg-gray-200')">`,
      false
    );
  });

  test("Ignore dynamic Svelte", () => {
    hasMatch("<div class:isActive={isActive}>", false);
  });

  test(`Ignore dynamic twMerge`, () => {
    hasMatch(
      "<div blah blah blah twMerge(`relative before:rounded-full ${IGNORE DYNAMIC STYLING} before:content-[''] before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl`) blah >",
      false
    );
  });

  test(`Ignore dynamic elixr`, () => {
    hasMatch(
      '<div class="<%= $"bg-{color}-500" %>">IGNORE THIS ONE</div>',
      false
    );
  });

  test(`Ignore dynamic`, () => {
    hasMatch(
      '<div class="<%= $"bg-{color}-500" %>">IGNORE THIS ONE</div>',
      false
    );
  });

  test(`Ignore dynamic rust yew`, () => {
    hasMatch('<div class={css!("color: red;")}>{"Hello World!"}</div>', false);
    hasMatch(
      '<div key={idx} class={classes!("game-cellule", cellule_status)}></div>',
      false
    );
  });

  test(`Ignore dynamic rust leptos`, () => {
    hasMatch(
      '<button class=("button-20", move || count() % 2 == 1) >"Click Me"</button>',
      false
    );
    hasMatch("<div class:red=move || count() % 2 == 1 ></div>", false);
    hasMatch("<div class=style::jumbotron/>", false);
  });

  test(`Ignore cn function`, () => {
    hasMatch(
      `export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}`,
      false
    );
  });
});
