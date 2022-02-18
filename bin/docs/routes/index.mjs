import { html } from "htm/preact";
import { Main } from "../components/Main.mjs";
import fs from "fs-extra";

export default () => {
  const { description } = fs.readJsonSync("package.json");
  return html`
    <${Main}>
      <h1>2ts</h1>
      <p>${description}</p>
      <h2><a href="/suite">Test Suite</a></h2>
    <//>
  `;
};
