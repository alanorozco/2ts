import { globbySync } from "globby";

export const getTestFixtures = () =>
  globbySync("test/fixtures/**/*.js").map((input) => ({
    input,
    output: `${input}.ts`,
  }));
