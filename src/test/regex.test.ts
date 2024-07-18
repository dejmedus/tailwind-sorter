import * as assert from "assert";
import { createRegex } from "../lib/regex";

function findMatch(fullString: string) {
  const regex = createRegex();

  let match = regex.exec(fullString);
  let group = match?.[5] || match?.[4] || match?.[3] || null;

  return group;
}

suite("Correct Regex", () => {
  function checkEquals(fullString: string, correctMatch: string) {
    const group = findMatch(fullString);

    if (!group) {
      assert.fail("No matching string");
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

suite("Custom Prefixes", () => {
  function checkEquals(fullString: string, correctMatch: string) {
    const group = findMatch(fullString);

    if (!group) {
      assert.fail("No matching string");
    }

    assert.strictEqual(group, correctMatch);
  }

  test(`twMerge(`, () => {
    checkEquals(
      `<div blah blah blah twMerge("relative before:rounded-full before:content-[''] before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl") blah >`,
      "relative before:rounded-full before:content-[''] before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl"
    );
  });

  test(`Complex twMerge(`, () => {
    checkEquals(
      "twMerge(`lg:grid-cols-[1fr,auto] grid-cols-2`)",
      "lg:grid-cols-[1fr,auto] grid-cols-2"
    );
  });

  test(`clsx(`, () => {
    checkEquals(
      `<div blah blah blah clsx('relative before:rounded-full before:content-[""] before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl') blah >`,
      'relative before:rounded-full before:content-[""] before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl'
    );
  });

  test(`Multi cva(`, () => {
    checkEquals(
      `cva('text-white bg-blue-500', { 'bg-blue-700 text-gray-100': isHovering })`,
      "text-white bg-blue-500"
    );
  });

  test(`twMerge()`, () => {
    checkEquals(
      "<div blah blah blah twMerge(`relative before:rounded-full before:content-[''] before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl`) blah >",
      "relative before:rounded-full before:content-[''] before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl"
    );
  });
});

suite("No Match", () => {
  function hasMatch(fullString: string, hasMatch: boolean) {
    const group = findMatch(fullString);

    assert.equal(!!group, hasMatch);
  }

  test(`Ignore dynamic PHP`, () => {
    hasMatch(
      '<div class="<?php echo "bg-$color-500"; ?>">IGNORE THIS ONE</div>',
      false
    );
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
});
