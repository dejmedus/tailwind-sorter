import * as assert from "assert";
import { restore } from "sinon";

import createConfigStub from "./_createConfigStub";
import sortHelper from "./_sortHelper";

suite("Section Order", () => {
  teardown(() => {
    restore();
  });

  test('default ["classes", "customClasses"]', () => {
    createConfigStub({ sectionOrder: ["classes", "customClasses"] });

    const unsortedString = `<div class="hover:bg-blue-500 potato flex bg-black custom text-white lg:text-gray-100">`;
    const sortedString = `<div class="flex bg-black hover:bg-blue-500 text-white lg:text-gray-100 potato custom">`;

    assert.strictEqual(sortHelper(unsortedString), sortedString);
  });

  test('["customClasses", "classes"]', () => {
    createConfigStub({ sectionOrder: ["customClasses", "classes"] });

    const unsortedString = `<div class="hover:bg-blue-500 flex custom bg-black text-white potato lg:text-gray-100">`;
    const sortedString = `<div class="custom potato flex bg-black hover:bg-blue-500 text-white lg:text-gray-100">`;

    assert.strictEqual(sortHelper(unsortedString), sortedString);
  });

  test('["classes", "pseudoClasses"]', () => {
    createConfigStub({
      sectionOrder: ["classes", "pseudoClasses", "customClasses"]
    });

    const unsortedString = `<div class="flex flex-col md:flex-row justify-between gap-4 p-4 md:p-8 bg-background">`;
    const sortedString = `<div class="flex flex-col justify-between gap-4 bg-background p-4 md:flex-row md:p-8">`;

    assert.strictEqual(sortHelper(unsortedString), sortedString);
  });

  test('["classes", "pseudoClasses", "customClasses"]', () => {
    createConfigStub({
      sectionOrder: ["classes", "pseudoClasses", "customClasses"]
    });

    const unsortedString = `<div class="hover:bg-blue-500 flex custom bg-black text-white potato lg:text-gray-100">`;
    const sortedString = `<div class="flex bg-black text-white hover:bg-blue-500 lg:text-gray-100 custom potato">`;

    assert.strictEqual(sortHelper(unsortedString), sortedString);
  });

  test('["pseudoClasses", "classes", "customClasses"]', () => {
    createConfigStub({
      sectionOrder: ["pseudoClasses", "classes", "customClasses"]
    });

    const unsortedString = `<div class="hover:bg-blue-500 flex custom bg-black frog potato text-white lg:text-gray-100">`;
    const sortedString = `<div class="hover:bg-blue-500 lg:text-gray-100 flex bg-black text-white custom frog potato">`;

    assert.strictEqual(sortHelper(unsortedString), sortedString);
  });

  test('["customClasses", "classes", "pseudoClasses"]', () => {
    createConfigStub({
      sectionOrder: ["customClasses", "classes", "pseudoClasses"]
    });

    const unsortedString = `<div class="hover:bg-blue-500 flex frog bg-black text-white lg:text-gray-100 custom">`;
    const sortedString = `<div class="frog custom flex bg-black text-white hover:bg-blue-500 lg:text-gray-100">`;

    assert.strictEqual(sortHelper(unsortedString), sortedString);
  });

  test('["classes", "customClasses", "pseudoClasses"]', () => {
    createConfigStub({
      sectionOrder: ["classes", "customClasses", "pseudoClasses"]
    });

    const unsortedString = `<div class="hover:bg-blue-500 flex bg-black text-white potato lg:text-gray-100 custom">`;
    const sortedString = `<div class="flex bg-black text-white potato custom hover:bg-blue-500 lg:text-gray-100">`;

    assert.strictEqual(sortHelper(unsortedString), sortedString);
  });
});
