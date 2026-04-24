import * as vscode from "vscode";
import * as assert from "assert";
import * as sinon from "sinon";

import { sortOnSave } from "../extension";
import getClassesMap from "../getClassesMap";
import createConfigStub from "./_createConfigStub";
import getLanguages from "../lib/languages";

suite("VS Code Configuration", () => {
  teardown(() => {
    sinon.restore();
  });

  test("getClassesMap respects config", () => {
    createConfigStub({
      categories: {
        category1: ["class1", "class3"],
        category2: ["class2", "class4"]
      },
      categoryOrder: { sortOrder: ["category1", "category2"] },
      pseudoClassesOrder: { sortOrder: ["pseudo2", "pseudo1"] },
      sectionOrder: ["customClasses", "classes", "pseudoClasses"]
    });

    const { classesMap, pseudoSortOrder, sectionOrder } = getClassesMap();

    assert.deepStrictEqual(classesMap, {
      class1: 0,
      class2: 2,
      class3: 1,
      class4: 3
    });

    assert.deepStrictEqual(pseudoSortOrder, ["pseudo2", "pseudo1"]);
    assert.deepStrictEqual(sectionOrder, [
      "customClasses",
      "classes",
      "pseudoClasses"
    ]);
  });

  test("getLanguages includes custom languages from config", () => {
    createConfigStub({
      includeLanguages: ["potatoscript"]
    });

    const languages = getLanguages();
    assert.ok(languages.includes("potatoscript"));
  });

  test("getLanguages does not return languages excluded in config", () => {
    const before = getLanguages();
    assert.ok(before.includes("html"));

    createConfigStub({
      excludeLanguages: ["html"]
    });

    const languages = getLanguages();
    assert.strictEqual(languages.includes("html"), false);
  });

  test("getLanguages prioritizes excludeLanguages over includeLanguages", () => {
    createConfigStub({
      excludeLanguages: ["jellyfish"],
      includeLanguages: ["jellyfish"]
    });

    const languages = getLanguages();
    assert.strictEqual(languages.includes("jellyfish"), false);
  });

  test("don't sort on command if language is not supported", async () => {
    const showWarningMessageStub = sinon.stub(
      vscode.window,
      "showWarningMessage"
    );

    const document = {
      languageId: "unsupported",
      getText: () => "<div class='hover:grid grid'></div>",
      positionAt: (offset: number) => new vscode.Position(0, offset)
    } as vscode.TextDocument;

    const replaceStub = sinon.stub();
    const editBuilderMock = { replace: replaceStub };

    const editSpy = sinon.spy((callback) => {
      callback(editBuilderMock);
      return Promise.resolve(true);
    });

    const activeTextEditor = {
      document,
      edit: editSpy
    } as unknown as vscode.TextEditor;
    sinon.stub(vscode.window, "activeTextEditor").get(() => activeTextEditor);

    await vscode.commands.executeCommand("tailwindSorter.sort");

    sinon.assert.calledOnce(showWarningMessageStub);
    sinon.assert.notCalled(editSpy);
    sinon.assert.notCalled(replaceStub);
  });

  test("sort on command if language is supported", async () => {
    const showWarningMessageStub = sinon.stub(
      vscode.window,
      "showWarningMessage"
    );

    const document = {
      languageId: "html",
      getText: () => "<div class='hover:grid grid'></div>",
      positionAt: (offset: number) => new vscode.Position(0, offset)
    } as vscode.TextDocument;

    const replaceStub = sinon.stub();
    const editBuilderMock = { replace: replaceStub };

    const editSpy = sinon.spy((callback) => {
      callback(editBuilderMock);
      return Promise.resolve(true);
    });

    const activeTextEditor = {
      document,
      edit: editSpy
    } as unknown as vscode.TextEditor;
    sinon.stub(vscode.window, "activeTextEditor").get(() => activeTextEditor);

    await vscode.commands.executeCommand("tailwindSorter.sort");

    sinon.assert.notCalled(showWarningMessageStub);
    sinon.assert.called(editSpy);
    sinon.assert.calledOnce(replaceStub);

    const sortedTailwind = replaceStub.firstCall.args[1];
    assert.strictEqual(sortedTailwind.includes("grid hover:grid"), true);
  });

  test("sort on command if language is included via config", async () => {
    createConfigStub({
      includeLanguages: ["potatoscript"]
    });

    const showWarningMessageStub = sinon.stub(
      vscode.window,
      "showWarningMessage"
    );

    const document = {
      languageId: "potatoscript",
      getText: () => "<div class='hover:grid grid'></div>",
      positionAt: (offset: number) => new vscode.Position(0, offset)
    } as vscode.TextDocument;

    const replaceStub = sinon.stub();
    const editBuilderMock = { replace: replaceStub };

    const editSpy = sinon.spy((callback) => {
      callback(editBuilderMock);
      return Promise.resolve(true);
    });

    const activeTextEditor = {
      document,
      edit: editSpy
    } as unknown as vscode.TextEditor;
    sinon.stub(vscode.window, "activeTextEditor").get(() => activeTextEditor);

    await vscode.commands.executeCommand("tailwindSorter.sort");

    sinon.assert.notCalled(showWarningMessageStub);
    sinon.assert.called(editSpy);
    sinon.assert.calledOnce(replaceStub);

    const sortedTailwind = replaceStub.firstCall.args[1];
    assert.strictEqual(sortedTailwind.includes("grid hover:grid"), true);
  });

  test("when file is saved, tailwind is not sorted if sortOnSave is false", async () => {
    createConfigStub({ sortOnSave: false });

    const document = {
      languageId: "html",
      getText: () => "<div class='hover:grid grid'></div>",
      positionAt: (offset: number) => new vscode.Position(0, offset)
    } as vscode.TextDocument;

    const waitUntilSpy = sinon.spy();

    sortOnSave({
      document,
      waitUntil: waitUntilSpy,
      reason: vscode.TextDocumentSaveReason.Manual
    } as vscode.TextDocumentWillSaveEvent);

    sinon.assert.notCalled(waitUntilSpy);
  });

  test("when file is saved, tailwind is sorted if sortOnSave is true", async () => {
    createConfigStub({ sortOnSave: true });

    const document = {
      languageId: "html",
      getText: () => "<div class='hover:grid grid'></div>",
      positionAt: (offset: number) => new vscode.Position(0, offset)
    } as vscode.TextDocument;

    const waitUntilSpy = sinon.spy();

    sortOnSave({
      document,
      waitUntil: waitUntilSpy,
      reason: vscode.TextDocumentSaveReason.Manual
    } as vscode.TextDocumentWillSaveEvent);

    sinon.assert.calledOnce(waitUntilSpy);

    const textEdit = await waitUntilSpy.firstCall.args[0];
    const sortedTailwind = textEdit[0].newText;

    assert.strictEqual(sortedTailwind.includes("grid hover:grid"), true);
  });
});
