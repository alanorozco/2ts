import { html } from "htm/preact";
import { useStyle, css } from "./Style.mjs";

const style = css`
  body {
    font-family: sans-serif;
    margin: 0;
    font-size: 15px;
    color: #cfa1cd;
    background: #2f1e2e;
  }
  a {
    color: inherit;
    text-decoration: none;
    border-bottom: 2px solid #644062;
  }
  h1,
  h2,
  h3,
  h4 {
    margin: 0;
  }
  h1 {
    margin: 20px 0;
  }
  h2 {
    font-weight: normal;
  }
  h3 {
    margin: 20px 0;
    font-size: inherit;
  }
  main {
    margin: 0 auto;
    max-width: 1500px;
    padding: 20px;
  }
`;

export const Main = ({ children }) => {
  useStyle(style);
  return html`<main>${children}</main>`;
};
