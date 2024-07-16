import * as assert from "assert";

import sortTailwind from "../sortTailwind";
import { defaultClassesMap } from "./defaultClassMap";

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
