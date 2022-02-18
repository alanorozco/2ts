import { html } from "htm/preact";
import { Highlighted } from "./Highlighted.mjs";
import { useStyle, css } from "./Style.mjs";

/**
 * @typedef {{name: string, filename: string, highlighted: string}}
 */
export let TestResultSnippetDef;

const style = css`
  .TestResult {
    margin: 20px 0;
  }
  .TestResult:not(:first-of-type) {
    border-top: 1px solid #644062;
    padding-top: 20px;
  }
  @media (min-width: 1400px) {
    .TestResult > .snippets {
      display: flex;
      gap: 20px;
    }
    .TestResult > .snippets > * {
      width: 50%;
    }
  }
`;

export const TestResult = ({ name, snippets }) => {
  useStyle(style);
  return html`
    <section class="TestResult">
      <h2>${name}</h2>
      <div class="snippets">
        ${snippets.map(
          ({ filename, code, name }) => html`
            <div>
              <h3><a href=${filename}>${name}</a></h3>
              <${Highlighted} code=${code} />
            </div>
          `
        )}
      </div>
    </section>
  `;
};
