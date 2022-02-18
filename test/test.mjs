import * as assert from 'uvu/assert';
import path from 'path';
import prettier from 'prettier';
import { readFile, writeFile } from 'fs/promises';
import { test } from 'uvu';
import { getTestFixtures } from './util.mjs';
import { twots } from '../src/2ts.mjs';

/**
 * @param {string} filename
 * @return {Promise<string>}
 */
async function getResult(filename) {
  const text = await readFile(filename, 'utf8');
  const result = twots(filename, text);
  return prettier.format(result, { parser: 'typescript' });
}

const isUpdate = process.env.IS_UPDATE === '1';

for (const fixture of getTestFixtures()) {
  const name = path.basename(fixture.input, path.extname(fixture.input));
  test(name, async () => {
    const output = await getResult(fixture.input);
    if (!isUpdate) {
      try {
        const real = await readFile(fixture.output, 'utf8');
        assert.equal(real, output);
        return;
      } catch {}
    }
    await writeFile(fixture.output, output);
  });
}

test.run();
