import * as assert from "assert";
import { restore } from "sinon";

import createConfigStub from "./_createConfigStub";
import { officialSortHelper } from "./_sortHelper";

import { getOfficialSorter } from "../extension";

suite("Official Tailwind Plugin Sorting", () => {
  let sorter: any;

  suiteSetup(async () => {
    sorter = await getOfficialSorter();
  });

  teardown(() => {
    restore();
  });

  test('Correct sort class=""', () => {
    createConfigStub({});

    const unsortedString = `<div class="font-semibold after:content-[''] flex-1 flex-col gap-20 lg:bg-pink hover:bg-purple bg-gradient-to-r from-green-300 bg-black via-blue-500 to-purple-600 flex w-full font-sans before:content-[''] items-center" blah blah`;

    assert.notStrictEqual(
      officialSortHelper(unsortedString, sorter),
      unsortedString
    );
  });

  test("Correct sort className=''", () => {
    const unsortedString = `<div className='font-semibold after:content-[""] flex-1 flex-col gap-20 lg:bg-pink hover:bg-purple bg-gradient-to-r from-green-300 bg-black via-blue-500 to-purple-600 flex w-full font-sans before:content-[""] items-center' blah blah`;

    assert.notStrictEqual(
      officialSortHelper(unsortedString, sorter),
      unsortedString
    );
  });

  test("Kitchen sink", () => {
    const unsortedString = `<div class="text-center after:content-[''] sm:hover:bg-[url('/noise.png')] border-4 -mt-2 hover:focus:rotate-3 lg:dark:bg-gradient-to-tr translate-x-1/2 before:opacity-50 w-[calc(100%-4rem)] flex-col focus-within:ring-4 grid-cols-3 h-screen text-3xl font-black absolute justify-between sm:peer-checked:translate-y-3 hover:skew-x-6 md:max-w-3xl text-blue-500 bg-cover md:grid p-10 bg-center flex bg-no-repeat underline gap-6 sm:w-1/2 sm:bg-yellow-400 bg-[radial-gradient(circle_at_top_left,#1e3a8a,#9333ea)] z-50 sticky rounded-xl hover:contrast-125 hover:shadow-2xl lg:mt-10 lg:pl-8 group-hover:opacity-90 sm:even:translate-x-4 sm:hover:scale-105 text-balance peer-invalid:ring-red-500 overflow-hidden min-h-[50vh] md:py-12 dark:hover:brightness-75 bg-fixed hover:text-white sm:dark:text-green-400 before:absolute sm:translate-x-2 sm:text-lg md:backdrop-blur-xl select-none" blah blah>`;

    assert.notStrictEqual(
      officialSortHelper(unsortedString, sorter),
      unsortedString
    );
  });

  test("Only pseudo classes", () => {
    const unsortedString = `<div class="focus-within:ring-blue-200 group-hover:text-blue-500 focus-within:ring" blah blah`;

    assert.notStrictEqual(
      officialSortHelper(unsortedString, sorter),
      unsortedString
    );
  });

  test("Data and aria attributes", () => {
    const unsortedString = `<div class="hover:bg-red-500 aria-[expanded=true]:bg-green-500 hover:bg-blue-500 data-[open=true]:bg-blue-500">`;

    assert.notStrictEqual(
      officialSortHelper(unsortedString, sorter),
      unsortedString
    );
  });

  test("Container queries", () => {
    const unsortedString = `<div class="@lg:flex group-hover:text-blue-500 flex @md:flex @sm:flex text-black"`;

    assert.notStrictEqual(
      officialSortHelper(unsortedString, sorter),
      unsortedString
    );
  });

  test("Arbitrary values", () => {
    const unsortedString = `<div className='h-[calc(100%-1rem)] w-[100px] bg-[#1a1a1a] w-[100px]' blah blah`;

    assert.notStrictEqual(
      officialSortHelper(unsortedString, sorter),
      unsortedString
    );
  });
});
