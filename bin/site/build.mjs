import fs from "fs-extra";
import path from "path";
import { html } from "htm/preact";
import { renderToString } from "preact-render-to-string";
import { flushStyles, Style } from "./components/Style.mjs";
import { globbySync } from "globby";

/**
 * @param {preact.VNode} tree
 * @return {string}
 */
function renderHtml(tree) {
  const styles = new Set();
  const body = renderToString(html`
    <${Style.Provider} value=${styles}>${tree}<//>
  `);
  const full = html`
    <html>
      <head>
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
    globbySync("**/*.mjs", { cwd: "bin/site/routes" }).map(async (filename) => {
      const filenameHtml = filename.replace(path.extname(filename), ".html");
      const outputFilename = `public/${filenameHtml}`;
      await renderRoute(`./routes/${filename}`, outputFilename);
    })
  );
})();
