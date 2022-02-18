import fs from "fs-extra";
import path from "path";
import { html } from "htm/preact";
import { getFixtures as getTestFixtures } from "../../../../test/util.mjs";
import { TestResult } from "../../components/TestResult.mjs";
import { Main } from "../../components/Main.mjs";

/**
 * @typedef {{name: string, filename: string, code: string}}
 */
let SnippetDef;

/**
 * @param {string} name
 * @param {string} filename
 * @return {SnippetDef}
 */
async function readSyntax(name, filename) {
  const code = await fs.readFile(filename, "utf8");
  return { name, filename, code };
}

/**
 * @return {Promise<preact.VNode>}
 */
export default async function () {
  const groups = await Promise.all(
    getTestFixtures().map(async ({ input, output }) => ({
      name: path.basename(input, path.extname(input)),
      snippets: [
        await readSyntax("javascript", input),
        await readSyntax("typescript", output),
      ],
    }))
  );
  return html`
    <${Main}>
      <h1>2ts Test Suite</h1>
      ${groups.map((files) => html`<${TestResult} ...${files} />`)}
    <//>
  `;
}
