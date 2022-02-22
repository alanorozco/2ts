import fs from 'fs-extra';
import path from 'path';
import { html } from 'htm/preact';
import { Main } from '../lib/Main.mjs';
import { getTestFixtures } from '../../../test/util.mjs';
import { TransformationExample } from '../lib/TransformationExample.mjs';
import { css, useStyle, useTitle } from '../lib/context.mjs';
import { Hero } from '../lib/Hero.mjs';

/**
 * @typedef {{name: string, filename: string, code: string}}
 */
let SnippetDef;

/**
 * @param {string} filter
 * @return {Promise<Array>}
 */
async function getExamples(filter) {
  return Object.fromEntries(
    (
      await Promise.all(
        getTestFixtures().map(async ({ input, output }) => {
          if (!input.includes(filter)) {
            return;
          }
          const name = path.basename(input, path.extname(input));
          return [
            name,
            [
              await fs.readFile(input, 'utf8'),
              await fs.readFile(output, 'utf8'),
            ],
          ];
        })
      )
    ).filter(Boolean)
  );
}

async function getData() {
  const { description, name } = await fs.readJson('package.json');
  const examples = await getExamples('/demo.js');
  return { description, name, examples };
}

const style = css`
  .Demo .TransformationExample {
    position: relative;
  }
  @media (min-width: 1000px) {
    .Demo .TransformationExample > :first-child {
      animation: 2s demoLeft ease-out;
    }
    .Demo .TransformationExample > :last-child {
      animation: 2s demoRight ease-out;
    }
  }
  @keyframes demoLeft {
    0% {
      transform: translateX(50%);
    }
    50% {
      transform: translateX(0);
    }
  }
  @keyframes demoRight {
    0% {
      transform: translateX(-50%);
      opacity: 0;
    }
    50% {
      transform: translateX(0);
    }
    100% {
      opacity: 1;
    }
  }
`;

function Index({ name, description, examples }) {
  useTitle(`${name} — ${description}`);
  useStyle(style);
  return html`
    <${Main}>
      <${Hero} name=${name} description=${description} />
      <div class="Demo">
        <${TransformationExample} snippets=${examples.demo} />
      </div>
    <//>
  `;
}

export default async () => html`<${Index} ...${await getData()} />`;
