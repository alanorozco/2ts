import { html } from 'htm/preact';
import { Highlighted } from './Highlighted.mjs';
import { useStyle, css } from './context.mjs';
import { borderColor } from './colors.mjs';

/**
 * @typedef {{
 *   name: string,
 *   snippets: {
 *     filename: string,
 *     code: string,
 *     name: string,
 *   }[],
 * }}
 */
export let TransformationExampleDef;

const style = css`
  .TransformationExample {
    margin: 20px 0;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  .TransformationExample > * {
    flex-grow: 1;
    flex-basis: 0;
  }
  @media (max-width: 1000px) {
    .TransformationExample > * {
      min-width: 100%;
    }
  }
`;

export const TransformationExample = ({ name, snippets }) => {
  useStyle(style);
  return html`
    <div class="TransformationExample">
      ${snippets.map((code) => html`<${Highlighted} code=${code} />`)}
    </div>
  `;
};
