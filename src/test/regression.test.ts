import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import { restore } from "sinon";

import createConfigStub from "./_createConfigStub";
import sortHelper from "./_sortHelper";

const FIXTURES_DIR = path.join(process.cwd(), "src/test/fixtures");

suite("Regression tests", () => {
  teardown(() => {
    restore();
  });

  const languages = fs.readdirSync(FIXTURES_DIR);

  for (const lang of languages) {
    const langDir = path.join(FIXTURES_DIR, lang);
    const dir = fs.readdirSync(langDir);

    const fixture = dir.find((f) => f.startsWith("fixture."));
    const expected = dir.find((f) => f.startsWith("expected."));
    const sorted = dir.find((f) => f.startsWith("sorted."));
    const config = dir.find((f) => f.startsWith("config."));

    test(`Correctly formats ${lang}`, () => {
      if (!fixture || !expected) {
        assert.fail(`Invalid fixture ${lang} (${langDir})`);
      }

      const fixturePath = path.join(langDir, fixture);
      const expectedPath = path.join(langDir, expected);
      const sortedPath = path.join(langDir, sorted || "sorted");

      const configStub = config ? setConfig(langDir) : null;

      const input = fs.readFileSync(fixturePath, "utf8");
      const expectedOutput = fs.readFileSync(expectedPath, "utf8");

      const actualOutput = sortHelper(input);

      fs.writeFileSync(sortedPath, actualOutput, "utf8");

      assert.strictEqual(
        normalize(actualOutput),
        normalize(expectedOutput),
        `Something broke: scr/test/fixtures/${lang}`,
      );

      configStub?.restore();
    });
  }
});

function setConfig(langDir: string) {
  const configPath = path.join(langDir, "config.json");
  const customConfig = fs.readFileSync(configPath, "utf8");
  return createConfigStub(JSON.parse(customConfig));
}

function normalize(str: string) {
  // typescript no
  return str.replace(/^\/\/# sourceMappingURL=.*$/gm, "").trim();
}
