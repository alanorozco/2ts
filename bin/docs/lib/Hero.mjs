import { html } from 'htm/preact';
import { css, useStyle } from '../lib/context.mjs';
import { borderColor } from './colors.mjs';

const style = css`
  .Hero {
    margin: 40px 0 80px;
    font-size: 1.2em;
    text-align: center;
  }
  .Hero > h1 {
    font-size: 2.4em;
    letter-spacing: 2px;
  }
  .Hero > * {
    margin: 10px 0;
  }
  .Hero .sub {
    font-size: 0.9em;
  }
  .Hero .cli {
    margin: 30px auto;
    width: fit-content;
  }
  .Hero .cli pre,
  .Hero .cli p {
    margin: 0;
  }
  .Hero .cli pre {
    text-align: left;
    font-weight: bold;
    margin-bottom: 20px;
    padding: 20px 30px;
    font-size: 1.2em;
    border: 1px solid ${borderColor};
  }
`;

export function Hero({ name, description }) {
  useStyle(style);
  return html`
    <header class="Hero">
      <h1>${name}</h1>
      <p>${description}</p>
      <div class="cli">
        <pre>npx ${name} script.js</pre>
        <p class="sub">
          <a href="https://www.npmjs.com/package/${name}">
            Command-line documentation on NPM
          </a>
        </p>
      </div>
    </header>
  `;
}
