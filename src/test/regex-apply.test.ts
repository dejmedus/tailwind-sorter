import * as assert from "assert";
import { createApplyRegex } from "../lib/regex";

function findMatch(fullString: string) {
  const regex = createApplyRegex();

  const match = regex.exec(fullString);
  const group = match?.[1] || null;

  return group;
}

suite("Correct Apply Regex", () => {
  function checkEquals(fullString: string, correctMatch: string) {
    const group = findMatch(fullString);

    if (!group) {
      assert.fail("No matching string");
    }

    assert.strictEqual(group, correctMatch);
  }

  test("CSS apply", () => {
    checkEquals(
      `.btn {
        @apply bg-blue-500 text-white;
      }`,
      `bg-blue-500 text-white`
    );
  });

  test("CSS nested", () => {
    checkEquals(
      `.btn {
        .inner {
          @apply bg-blue-500 text-white;
        }
      }`,
      `bg-blue-500 text-white`
    );
  });

  test("Vue template apply", () => {
    checkEquals(
      `<template>
        <div class="btn">
          <style scoped>
            .btn {
              @apply bg-blue-500 text-white;
            }
          </style>
        </div>
      </template>`,
      `bg-blue-500 text-white`
    );
  });

  test("JSX apply", () => {
    checkEquals(
      `<style jsx>{\`
        .btn {
          @apply bg-blue-500 text-white;
        }
      \`}</style>`,
      `bg-blue-500 text-white`
    );
  });

  test("Style tag apply", () => {
    checkEquals(
      `
      <style>
        .btn {
          @apply bg-blue-500 text-white;
        }
      </style>
      `,
      `bg-blue-500 text-white`
    );
  });

  test("SCSS apply", () => {
    checkEquals(
      `$primary: blue-500;
      .btn {
        &:hover {
          @apply bg-blue-500 text-white;
        }
      }`,
      `bg-blue-500 text-white`
    );
  });

  test("Apply with newlines", () => {
    checkEquals(
      `.btn {
        @apply bg-blue-500
               text-white;
      }`,
      `bg-blue-500
               text-white`
    );
  });
});
