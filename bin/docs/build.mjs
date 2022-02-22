import fs from 'fs-extra';
import path from 'path';
import { html } from 'htm/preact';
import { renderToString } from 'preact-render-to-string';
import { flushStyles, Page } from './lib/context.mjs';
import { globbySync } from 'globby';

/**
 * @param {preact.VNode} tree
 * @return {string}
 */
function renderHtml(tree) {
  const styles = new Set();
  const context = { styles };
  const body = renderToString(html`
    <${Page.Provider} value=${context}>${tree}<//>
  `);
  const full = html`
    <html>
      <head>
        <title>${context.title}</title>
        <style
          dangerouslySetInnerHTML=${{ __html: flushStyles(styles) }}
        ></style>
      </head>
      <body dangerouslySetInnerHTML=${{ __html: body }}></body>
    </html>
  `;
  return `<!DOCTYPE html>${renderToString(full)}`;
}

async function renderRoute(moduleSource, outputFilename) {
  const { default: render } = await import(moduleSource);
  const tree = await render();
  const output = renderHtml(tree);
  await fs.outputFile(outputFilename, output);
  console.log(outputFilename, output.length);
}

(async () => {
  await Promise.all(
    globbySync('**/*.mjs', { cwd: 'bin/docs/routes' }).map(async (filename) => {
      const filenameHtml = filename.replace(path.extname(filename), '.html');
      const outputFilename = `docs/${filenameHtml}`;
      await renderRoute(`./routes/${filename}`, outputFilename);
    })
  );
})();
