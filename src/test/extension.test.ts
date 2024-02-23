import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import sortTailwind from "../sortTailwind";
import getClassesMap from "../getClassesMap";
import { defaultClassesMap } from "./defaultClassMap";
import * as sinon from "sinon";

suite("Extension", () => {
  vscode.window.showInformationMessage("Start all tests.");
  const { classesMap, pseudoSortOrder } = defaultClassesMap();

  test('Correct sort class=""', () => {
    const sortedString = `class="flex flex-col flex-1 items-center before:content-[''] after:content-[''] gap-20 bg-black lg:bg-pink hover:bg-purple bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 w-full font-sans font-semibold" blah blah`;
    const unsortedString = `class="font-semibold after:content-[''] flex-1 flex-col gap-20 lg:bg-pink hover:bg-purple bg-gradient-to-r from-green-300 bg-black via-blue-500 to-purple-600 flex w-full font-sans before:content-[''] items-center" blah blah`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Correct sort className=''", () => {
    const sortedString = `className='flex flex-col flex-1 items-center before:content-[""] after:content-[""] gap-20 bg-black lg:bg-pink hover:bg-purple bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 w-full font-sans font-semibold' blah blah`;
    const unsortedString = `className='font-semibold after:content-[""] flex-1 flex-col gap-20 lg:bg-pink hover:bg-purple bg-gradient-to-r from-green-300 bg-black via-blue-500 to-purple-600 flex w-full font-sans before:content-[""] items-center' blah blah`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  test("Repeat classes", () => {
    const sortedString = `blah blah className="top-0 left-0 left-0 left-10 lg:static fixed flex justify-center"`;
    const unsortedString = `blah blah className="top-0 left-10 left-0 lg:static fixed flex justify-center left-0"`;

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  // to do
  // test("Pseudo classes", () => {
  //   const sortedString = `className="bg-black hover:bg-black dark:bg-purple-500 dark:hover:bg-white"`;
  //   const unsortedString = `className="dark:bg-purple-500 hover:bg-black bg-black dark:hover:bg-white"`;

  //   assert.strictEqual(
  //     sortTailwind(unsortedString, classesMap, pseudoSortOrder),
  //     sortedString
  //   );
  // });

  test("Dynamic styles", () => {
    // to do
    const sortedString =
      "className={`${sm && 'text-sm'} flex flex-col flex-1 items-center before:content-[''] after:content-[''] gap-20 bg-black lg:bg-pink hover:bg-purple bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 w-full font-sans font-semibold`}` blah blah";
    const unsortedString =
      "className={`${sm && 'text-sm'} flex flex-col flex-1 items-center before:content-[''] after:content-[''] gap-20 bg-black lg:bg-pink hover:bg-purple bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 w-full font-sans font-semibold`}` blah blah";

    assert.strictEqual(
      sortTailwind(unsortedString, classesMap, pseudoSortOrder),
      sortedString
    );
  });

  // dynamic style type 2 className={`flex items-center gap-1.5 rounded-lg border-2 px-3 py-1.5 ${buttonClasses.DEFAULT}`}

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
      ` blah blah blah className='relative before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[""]' blah >`,
      'relative before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[""]'
    );
  });

  test(`Correct regex className=""`, () => {
    checkEquals(
      ` blah blah blah className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]" blah >`,
      "relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"
    );
  });

  test(`Correct regex class=''`, () => {
    checkEquals(
      ` blah blah blah class='before:content-[""] relative before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl' blah >`,
      'before:content-[""] relative before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl'
    );
  });

  test(`Correct regex class=""`, () => {
    checkEquals(
      ` blah blah blah class="relative before:rounded-full before:content-[''] before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl" blah >`,
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
