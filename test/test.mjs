import * as assert from 'uvu/assert';
import path from 'path';
import prettier from 'prettier';
import { readFile, writeFile } from 'fs/promises';
import { test } from 'uvu';
import { getTestFixtures } from './util.mjs';
import { twots } from '../src/2ts.mjs';

/**
 * @param {string} filename
 * @param {string} text
 * @return {Promise<string>}
 */
async function getResult(filename, text) {
  const { code } = twots(filename, text);
  return prettier.format(code, {
    ...(await prettier.resolveConfig(filename)),
    parser: 'typescript',
  });
}

async function compareOrWrite(isUpdate, filename, expected) {
  if (!isUpdate) {
    try {
      const actual = await readFile(filename, 'utf8');
      assert.equal(expected, actual);
      return;
    } catch {}
  }
  await writeFile(filename, expected);
}

async function generateSummary(results) {
  const template = await readFile('test/README.template.md', 'utf8');
  const [header, section] = template.split(
    /[\n\s]*<!--\s*result\s*-->[\n\s]*/i
  );
  const sections = results.map((result) =>
    replaceMarkdownTemplate(section, result)
  );
  const output = [header, ...sections].join('\n\n');
  return prettier.format(output, {
    parser: 'markdown',
  });
}

function replaceMarkdownTemplate(string, replacements) {
  for (const [key, value] of Object.entries(replacements)) {
    string = string.replace(
      // Allows:
      //   plain:      __key
      //   escaped:    \_\_key
      //   expression: __key;
      new RegExp(`(\\\\?_){2}${key};?`, 'g'),
      value.trim()
    );
  }
  return string;
}

const isUpdate = process.env.IS_UPDATE === '1';

const results = [];

for (const fixture of getTestFixtures()) {
  const name = path.basename(fixture.input, path.extname(fixture.input));
  test(name, async () => {
    const result = new Promise(async (resolve) => {
      const input = await readFile(fixture.input, 'utf8');
      const output = await getResult(fixture.input, input);
      await compareOrWrite(isUpdate, fixture.output, output);
      resolve({
        name,
        input,
        output,
      });
    });
    results.push(result);
    return result;
  });
}

test('generate summary', async () => {
  await Promise.all(results).then(async (results) => {
    await compareOrWrite(
      isUpdate,
      'test/README.md',
      await generateSummary(results)
    );
  });
});

test.run();
