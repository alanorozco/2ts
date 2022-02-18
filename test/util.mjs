import { globbySync } from 'globby';
import path from 'path';

export const getTestFixtures = () =>
  globbySync('test/fixtures/**/*.js').map((input) => ({
    input,
    output: `${input.replace(path.extname(input), '')}.tsx`,
  }));
