## Contributing to Tailwind Sorter

Thank you for your interest in contributing! 🎉


> If your language sorts after following the steps in [How to Add A New Language](#how-to-add-a-new-language), feel free to open a pull request directly
>
> However, if you want to propose *a new feature*, *a change to the sorting behavior*, or *support for a language that requires custom logic*, please open an issue to discuss before you invest time in a PR

- [How to Contribute](#how-to-contribute)
- [How to Add A New Language](#how-to-add-a-new-language)

### How to Contribute

#### Local Setup
``` sh
# Fork the repository
# Go to https://github.com/dejmedus/tailwind-sorter
# Click "Fork" to create your own copy

# Clone your fork
git clone https://github.com/<your-username>/tailwind-sorter.git
cd tailwind-sorter

# Install dependencies
# Make sure you have Node.js installed: https://nodejs.org/
npm install
```

#### Make Changes

```sh
# Create a new branch
git checkout -b <your-feature-name>

# Make your changes
# - See How to Add A New Language section below
# - Use `Fn + F5` to run the extension
# - Run tests with:
npm run test

# Commit your changes
git add .
git commit -m "Your commit message here"

```

#### Create a Pull Request

```sh
# Push your branch
git push origin <your-feature-name>

# Go to your fork on GitHub
# Click "Compare & pull request"
# Fill out the PR with description of your changes

# Done! 🎉
# I'll review and merge your PR
# Your changes will be included in the next release
```


### How to Add A New Language

*TLDR:*

1. Add the language identifier to supported languages `lib/languages.ts`
2. Add any dynamic syntax markers `lib/regex.ts`
3. ✨ Bonus: Write some tests `test/sorting-ignore.test.ts` and `test/sorting.test.ts`
4. Ensure all tests pass `npm run test`
5. Run the extension `Fn + F5` and verify sorting works

Example PR: [Adding EJS Support](https://github.com/dejmedus/tailwind-sorter/pull/48/files) (*ignore the file changes outside /src*)

> If your language is not sorted as expected after these steps It could mean I need to extend the sorting logic - feel free to open an issue/@ me

----

#### 1. Add the VS Code Language Identifier

Find the language identifier in bottom-right corner of VS Code or via the command palette with `Change Language Mode`
and add it to the supported languages list

```ts
// lib/languages.ts

export const languages = [
  "html",
  "javascriptreact",
  "typescriptreact",
  "newlanguage", // ← add the identifier
  "astro",
  "svelte",
  "vue",
];
```

### 2. Add Dynamic Syntax Markers

If the language uses dynamic templating syntax (like `<%= %>`, `{{ }}`, `@(...)`, etc), that is not already in the list of dynamic syntax markers, you can add it

```ts
// lib/regex.ts

export const dynamicSyntaxMarkers = [
  "${",
  "#{",
  "{{",
  // ← add dynamic syntax markers
];
```


#### 3. Bonus: Write Tests

A quick way to make sure that Tailwind Sorter sorts properly and doesn't break anything!

📁 `test/sorting-ignore.test.ts`

Add language examples that should **not** be sorted. This includes dynamic syntax, comments, and any other code that should remain unchanged:

```ts
test("New Language dynamic syntax: do not change", () => {
  const unsortedString = `<% const isError = true; %>
<div class="<%= isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800' %> px-4 py-2 rounded">
  <%= isError ? 'There was an error!' : 'All good!' %>
</div>`;

  assert.strictEqual(
    sortTailwind(unsortedString, classesMap, pseudoSortOrder),
    unsortedString
  );
});
```

📁 `test/sorting.test.ts`

Add language examples that **should be** sorted:

```ts
test("New Language syntax", () => {
  const sortedString = `<% for (let i = 1; i <= 20; i++) { %>
    <p class="text-gray-700 text-sm">Item <%= i %></p>
  <% } %>`;
  const unsortedString = `<% for (let i = 1; i <= 20; i++) { %>
    <p class="text-sm text-gray-700">Item <%= i %></p>
  <% } %>`;

  assert.strictEqual(
    sortTailwind(unsortedString, classesMap, pseudoSortOrder),
    sortedString
  );
});
```


#### 4. Run the Tests

Check that tests pass

```bash
npm run test
```


#### 5. Try out the Extension

Press `F5` to launch the Extension Development Host

1. Open a file in your target language
2. Try the command `Tailwind Sorter: Sort` or just save the file if `sort on save` is enabled
3. Ensure sorting works as expected and there are no red squiggly lines

