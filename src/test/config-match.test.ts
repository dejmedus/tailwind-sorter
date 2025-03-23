import * as assert from "assert";

import { findLongestMatch } from "../sortTailwind";
import { defaultClassesMap } from "./_defaultClassMap";

suite("Find Config Match", () => {
  const { classesMap } = defaultClassesMap();

  test("carrots", () => {
    assert.strictEqual(findLongestMatch("carrots", classesMap), "");
  });

  test("banana-icecream", () => {
    assert.strictEqual(findLongestMatch("banana-icecream", classesMap), "");
  });

  test("shape-wrapper", () => {
    assert.strictEqual(findLongestMatch("shape-wrapper", classesMap), "");
  });

  test("custom_flex", () => {
    assert.strictEqual(findLongestMatch("custom_flex", classesMap), "");
  });

  test("_custom_flex", () => {
    assert.strictEqual(findLongestMatch("_custom_flex", classesMap), "");
  });

  test("pe-4", () => {
    assert.strictEqual(findLongestMatch("pe-4", classesMap), "pe-");
  });

  test("_ prefix for ignored classes", () => {
    assert.strictEqual(findLongestMatch("_ml-5", classesMap), "ml-");
  });

  test("_ prefix for ignored classes w pseudos", () => {
    assert.strictEqual(findLongestMatch("_hover:ml-5", classesMap), "ml-");
  });

  test("-ml-5", () => {
    assert.strictEqual(findLongestMatch("-ml-5", classesMap), "ml-");
  });

  test("list-type-bananas", () => {
    assert.strictEqual(
      findLongestMatch("list-type-bananas", classesMap),
      "list-type-"
    );
  });

  test("tw-list-type-bananas", () => {
    assert.strictEqual(
      findLongestMatch("tw-list-type-bananas", classesMap),
      "list-type-"
    );
  });

  test("tw-not-list-type-bananas", () => {
    assert.strictEqual(
      findLongestMatch("tw-not-list-type-bananas", classesMap),
      "list-type-"
    );
  });

  test("lg:w-[568px]", () => {
    assert.strictEqual(findLongestMatch("lg:w-[568px]", classesMap), "w-");
  });

  test("hover:not-lg:w-[568px]", () => {
    assert.strictEqual(
      findLongestMatch("hover:not-lg:w-[568px]", classesMap),
      "w-"
    );
  });

  test("hover:list-type-bananas", () => {
    assert.strictEqual(
      findLongestMatch("hover:list-type-bananas", classesMap),
      "list-type-"
    );
  });

  test("! important", () => {
    assert.strictEqual(
      findLongestMatch("hover:!bg-blue-500", classesMap),
      "bg-"
    );
  });

  test("fractions", () => {
    assert.strictEqual(findLongestMatch("w-1/2", classesMap), "w-");
  });

  test("multiple pseudos", () => {
    assert.strictEqual(
      findLongestMatch("hover:focus:bg-blue-500", classesMap),
      "bg-"
    );
  });

  // https://tailwindcss.com/blog/tailwindcss-v3-3#new-line-height-shorthand-for-font-size-utilities
  test("line height shorthand", () => {
    assert.strictEqual(
      findLongestMatch("text-sm/[17px]", classesMap),
      "text-sm"
    );
  });

  test("container queries with @", () => {
    assert.strictEqual(
      findLongestMatch("@lg/main:text-sm", classesMap),
      "text-sm"
    );
  });

  test("arbitrary [] with /", () => {
    assert.strictEqual(
      findLongestMatch("list-image-[url(/carrot.png)]", classesMap),
      "list-image-"
    );
  });

  test("css vars", () => {
    assert.strictEqual(
      findLongestMatch("bg-(--brand-color)", classesMap),
      "bg-"
    );
  });

  // https://tailwindcss.com/docs/hover-focus-and-other-states#differentiating-nested-groups
  test("group-", () => {
    assert.strictEqual(
      findLongestMatch("group-hover:text-blue-500", classesMap),
      "text-"
    );
  });

  // https://tailwindcss.com/docs/hover-focus-and-other-states#differentiating-nested-groups
  test("group/", () => {
    assert.strictEqual(findLongestMatch("group/banana", classesMap), "group");
  });

  test("group-[]", () => {
    assert.strictEqual(
      findLongestMatch("group-[:nth-of-type(3)_&]:block", classesMap),
      "block"
    );
  });

  // https://tailwindcss.com/docs/responsive-design#max-width-container-queries
  test("container query with dynamic syntax", () => {
    assert.strictEqual(findLongestMatch("@[618px]:flex", classesMap), "flex");
  });

  test("data attribute selectors", () => {
    assert.strictEqual(
      findLongestMatch("data-[open=true]:bg-blue-500", classesMap),
      "bg-"
    );
  });

  test("supports-", () => {
    assert.strictEqual(
      findLongestMatch("supports-[display:block]:grid", classesMap),
      "grid"
    );
  });

  test("arbitrary [] class", () => {
    assert.strictEqual(
      findLongestMatch("before:content-[attr(data:time)]", classesMap),
      "content-"
    );

    assert.strictEqual(
      findLongestMatch("content-['Time:_12:30_PM']", classesMap),
      "content-"
    );

    assert.strictEqual(
      findLongestMatch("[&_p]:text-gray-500", classesMap),
      "text-"
    );
  });

  test("arbitrary [] pseudos", () => {
    assert.strictEqual(
      findLongestMatch("[&>*:not(:first-child)]:mt-2", classesMap),
      "mt-"
    );

    assert.strictEqual(
      findLongestMatch("[&:nth-child(3)]:bg-blue-500", classesMap),
      "bg-"
    );
  });
});
