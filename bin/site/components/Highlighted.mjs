import { html } from "htm/preact";

import hljs from "highlight.js";
import hljsTypescript from "highlight.js/lib/languages/typescript";
import { useStyle, css } from "./Style.mjs";

const style = css`
  .hl {
    margin-left: 20px;
    font-family: monospace;
    line-height: 1.15;
  }
  .hl {
    color: #a39e9b;
    background: #2f1e2e;
  }
  .hl ::selection,
  .hl::selection {
    background-color: #4f424c;
    color: #a39e9b;
  }
  .hl .comment {
    color: #776e71;
  }
  .hl .tag {
    color: #8d8687;
  }
  .hl .operator,
  .hl .punctuation,
  .hl .subst {
    color: #a39e9b;
  }
  .hl .operator {
    opacity: 0.7;
  }
  .hl .bullet,
  .hl .deletion,
  .hl .name,
  .hl .selector-tag,
  .hl .template-variable,
  .hl .variable {
    color: #ef6155;
  }
  .hl .attr,
  .hl .link,
  .hl .literal,
  .hl .number,
  .hl .symbol,
  .hl .variable.constant_ {
    color: #f99b15;
  }
  .hl .class .hl .title,
  .hl .title,
  .hl .title.class_ {
    color: #fec418;
  }
  .hl .strong {
    font-weight: 700;
    color: #fec418;
  }
  .hl .addition,
  .hl .code,
  .hl .string,
  .hl .title.class_.inherited__ {
    color: #48b685;
  }
  .hl .built_in,
  .hl .doctag,
  .hl .keyword.hl .atrule,
  .hl .quote,
  .hl .regexp {
    color: #5bc4bf;
  }
  .hl .attribute,
  .hl .function .hl .title,
  .hl .section,
  .hl .title.function_,
  .ruby .hl .property {
    color: #06b6ef;
  }
  .diff .hl .meta,
  .hl .keyword,
  .hl .template-tag,
  .hl .type {
    color: #815ba4;
  }
  .hl .emphasis {
    color: #815ba4;
    font-style: italic;
  }
  .hl .meta,
  .hl .meta .hl .keyword,
  .hl .meta .hl .string {
    color: #e96ba8;
  }
  .hl .meta .hl .keyword,
  .hl .meta-keyword {
    font-weight: 700;
  }
`;

let hljsConfigured = false;
function highlight(code, language) {
  if (!hljsConfigured) {
    hljs.configure({ classPrefix: "" });
    hljs.registerLanguage("typescript", hljsTypescript);
    hljsConfigured = true;
  }
  return hljs.highlight(code, { language }).value;
}

export const Highlighted = ({ code, language = "typescript" }) => {
  useStyle(style);
  const __html = highlight(code, language);
  return html`<pre class="hl" dangerouslySetInnerHTML="${{ __html }}" />`;
};
