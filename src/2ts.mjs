import { parse as parseComment } from 'comment-parser';
import ts from 'typescript';

const languageVersion = ts.ScriptTarget.Latest;

function addImport(imports, path, name) {
  imports[path] = imports[path] || new Set();
  imports[path].add(name);
}

/**
 * @param {Object} imports
 * @param {string} type
 * @return {string}
 */
function extractImports(imports, type) {
  let orNull = false;
  return type
    .replace(/[=!]/g, '')
    .replace(/\*/g, 'any')
    .replace(/\?/g, () => {
      if (orNull) {
        return '';
      }
      orNull = true;
      return 'null|';
    })
    .replace(
      /([\./a-z0-9-_]+\/[\./a-z0-9-_]+)\.([a-z0-9-_]+)/gi,
      (unusedMatch, path, name) => {
        addImport(imports, path, name);
        return name;
      }
    );
}

/**
 * @param {string} text
 * @param {[string, string][]} comments
 * @param {{[string: string]: string[]}} imports
 * @param {ts.Node} node
 * @param {ts.TransformationContext} context
 */
function processJsdoc(text, comments, imports, node, context) {
  let fullStart;
  try {
    fullStart = node.getFullStart();
  } catch {
    return;
  }
  if (ts.isVariableStatement(node)) {
    node = node.declarationList;
  }
  if (ts.isPropertyAssignment(node)) {
    node = node.initializer;
  }
  if (ts.isVariableDeclarationList(node)) {
    // only apply to first declaration
    const [declaration] = node.declarations;
    node = declaration.initializer;
  }
  ts.forEachLeadingCommentRange(text, fullStart, (pos, end) => {
    processComment(text, comments, imports, node, context, pos, end);
  });
  ts.forEachTrailingCommentRange(text, fullStart, (pos, end) => {
    processComment(text, comments, imports, node, context, pos, end);
  });
}

function processComment(text, comments, imports, node, context, pos, end) {
  const { factory } = context;
  const comment = text.slice(pos, end);
  let replacement = comment;

  let paramIndex = 0;
  const [jsdoc] = parseComment(comment);
  for (const tag of jsdoc?.tags || []) {
    let remove = false;
    const type = extractImports(imports, tag.type);
    if (tag.tag.startsWith('return')) {
      if (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node)) {
        remove = true;
        node.type = factory.createTypeReferenceNode(type);
      }
    } else if (tag.tag === 'param') {
      if (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node)) {
        remove = true;
        const param = node.parameters[paramIndex++];
        param.type = factory.createTypeReferenceNode(type);
        if (tag.type.includes('=')) {
          param.questionToken = factory.createToken(
            ts.SyntaxKind.QuestionToken
          );
        }
      }
    } else if (tag.tag === 'type') {
      if (ts.isParenthesizedExpression(node)) {
        remove = true;
        node.expression = factory.createAsExpression(
          node.expression,
          factory.createTypeReferenceNode(type)
        );
      }
    }
    if (remove) {
      replacement = clearTagFromComment(replacement, tag);
    }
  }
  if (replacement !== comment) {
    if (/^\/\*\*[\n\s]*\*\/$/m.test(replacement)) {
      replacement = '';
    }
    comments.push([comment, replacement]);
  }
}

function clearTagFromComment(comment, tag) {
  for (const { source } of tag.source) {
    if (source.endsWith('*/') && !source.startsWith('/*')) {
      continue;
    }
    comment = comment.replace(
      new RegExp(`\\n?${source.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}`),
      ''
    );
  }
  return comment;
}

function serializeImports(imports) {
  return Object.entries(imports).map(
    ([source, identifiers]) =>
      `import type {${Array.from(identifiers).join('\n')}} from "${source}";`
  );
}

/**
 *
 * @param {string} filename
 * @param {string} text
 * @return {string}
 */
export function twots(filename, text) {
  const imports = {};
  const comments = [];
  const sourceFile = ts.createSourceFile(filename, text, languageVersion);
  const transformer = (context) => {
    return (sourceFile) => {
      const visitor = (node) => {
        processJsdoc(text, comments, imports, node, context);
        return ts.visitEachChild(node, visitor, context);
      };
      return ts.visitNode(sourceFile, visitor);
    };
  };
  const [transformed] = ts.transform(sourceFile, [transformer]).transformed;
  const printer = ts.createPrinter();
  let printed = printer.printFile(transformed);
  for (const [comment, replacement] of comments) {
    printed = printed.replace(comment, replacement);
  }
  return [serializeImports(imports), printed].flat().join('\n');
}
