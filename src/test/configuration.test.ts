import * as vscode from "vscode";
import * as assert from "assert";
import * as sinon from "sinon";

import getClassesMap from "../getClassesMap";

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
        return {};
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
