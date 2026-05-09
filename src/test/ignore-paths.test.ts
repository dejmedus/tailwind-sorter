import * as assert from "assert";
import * as vscode from "vscode";
import * as os from "os";
import * as path from "path";
import * as fs from "fs";

import { normalize } from "../lib/languages";

suite("Normalize Paths", () => {
  const cases: [input: string, expected: string][] = [
    ["ignore", "**/ignore/**"],
    ["/ignore", "**/ignore/**"],
    ["/ignore/", "**/ignore/**"],
    ["ignore\\", "**/ignore/**"],
    ["*.css", "**/*.css"],
    ["src/*.css", "**/src/*.css"],
    ["/src/*.css", "**/src/*.css"],
    ["src\\*.css", "**/src/*.css"],
    ["foo/**", "**/foo/**"],
    ["**/*.antlers.html", "**/*.antlers.html"],
    ["**/ignore/**", "**/ignore/**"]
  ];

  for (const [input, expected] of cases) {
    test(`normalize("${input}") returns ${expected}"`, () => {
      assert.strictEqual(normalize(input), expected);
    });
  }
});

suite("Ignore Paths", () => {
  suite("OS Filesystem", () => {
    let tmpDir: string;

    setup(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tw-test-"));
    });

    teardown(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    test("lib/ matches file in lib directory", async () => {
      const filePath = createTmpFile(tmpDir, "lib", "file.html");
      assert.ok(await matchesReal(normalize("lib/"), filePath));
    });

    test("lib/ does not match file outside lib directory", async () => {
      const filePath = createTmpFile(tmpDir, "file.html");
      assert.ok(!(await matchesReal(normalize("lib/"), filePath)));
    });

    test("*.antlers.html matches antlers file", async () => {
      const filePath = createTmpFile(tmpDir, "home.antlers.html");
      assert.ok(await matchesReal(normalize("*.antlers.html"), filePath));
    });

    test("*.antlers.html does not match regular html file", async () => {
      const filePath = createTmpFile(tmpDir, "home.html");
      assert.ok(!(await matchesReal(normalize("*.antlers.html"), filePath)));
    });
  });

  suite("POSIX", () => {
    const cases: [pattern: string, fsPath: string, expected: boolean][] = [
      ["*.css", "/workspace/styles.css", true],
      ["*.css", "/workspace/src/styles.css", true],
      ["*.css", "/workspace/src/styles.scss", false],
      ["ignore", "/workspace/ignore/file.css", true],
      ["ignore", "/workspace/ignore/", true],
      ["ignore", "/workspace/src/deep/ignore/file.css", true],
      ["ignore", "/workspace/src/ignored/file.css", false],
      ["src/*.css", "/workspace/src/app.css", true],
      ["src/*.css", "/workspace/deep/src/app.css", true],
      ["src/*.css", "/workspace/src/styles/app.css", false],
      ["/src/*.css", "/workspace/src/app.css", true],
      ["/src/*.css", "/workspace/deep/src/app.css", true],
      ["/src/*.css", "/workspace/src/app.scss", false]
    ];

    for (const [pattern, fsPath, expected] of cases) {
      test(`"${pattern}" ${expected ? "matches" : "ignores"} ${fsPath}`, () => {
        assert.strictEqual(matches(normalize(pattern), fsPath), expected);
      });
    }
  });

  suite("Windows", () => {
    const cases: [pattern: string, fsPath: string, expected: boolean][] = [
      ["*.css", "C:\\workspace\\styles.css", true],
      ["*.css", "C:\\workspace\\src\\styles.css", true],
      ["*.css", "C:\\workspace\\src\\styles.scss", false],
      ["ignore", "C:\\workspace\\ignore\\file.css", true],
      ["ignore", "C:\\workspace\\src\\deep\\ignore\\file.css", true],
      ["ignore", "C:\\workspace\\src\\ignored\\file.css", false],
      ["src/*.css", "C:\\workspace\\src\\app.css", true],
      ["src/*.css", "C:\\workspace\\deep\\src\\app.css", true],
      ["src/*.css", "C:\\workspace\\src\\styles\\app.css", false],
      ["src\\*.css", "C:\\workspace\\src\\app.css", true],
      ["src\\*.css", "C:\\workspace\\deep\\src\\app.css", true],
      ["src\\*.css", "C:\\workspace\\src\\styles\\app.css", false]
    ];

    for (const [pattern, fsPath, expected] of cases) {
      test(`"${pattern}" ${expected ? "matches" : "ignores"} ${fsPath}`, () => {
        assert.strictEqual(matches(normalize(pattern), fsPath), expected);
      });
    }
  });
});

// mock document matching format tests
function matches(pattern: string, fsPath: string): boolean {
  const document = {
    languageId: "css",
    fileName: fsPath,
    uri: vscode.Uri.file(fsPath)
  } as vscode.TextDocument;

  return vscode.languages.match({ pattern }, document) > 0;
}

// filesystem matching for OS tests
async function matchesReal(
  pattern: string,
  filePath: string
): Promise<boolean> {
  const document = await vscode.workspace.openTextDocument(
    vscode.Uri.file(filePath)
  );
  return vscode.languages.match({ pattern }, document) > 0;
}

function createTmpFile(...segments: string[]): string {
  const filePath = path.join(...segments);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, "");
  return filePath;
}
