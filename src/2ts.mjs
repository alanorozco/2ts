import { parse as parseComment } from 'comment-parser';
import ts from 'typescript';

const languageVersion = ts.ScriptTarget.Latest;

function escapeRegexLiteral(string) {
  return string.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&');
}

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
    .replace(/\?(.)/g, (match, next) => {
      if (next === ':') {
        return match;
      }
      if (orNull) {
        return next;
      }
      orNull = true;
      return `null|${next}`;
    })
    .replace(
      /([\./a-z0-9-_]+\/[\./a-z0-9-_]+)\.([a-z0-9-_]+)/gi,
      (unusedMatch, path, name) => {
        addImport(imports, path, name);
        return name;
      }
    );
}

function getAnnotated(node) {
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
  return node;
}

/**
 * @param {string} ourContext
 * @param {ts.Node} node
 * @param {ts.TransformationContext} context
 */
function processJsdoc(ourContext, node, context) {
  if (
    ts.isJsxFragment(node) ||
    ts.isJsxOpeningElement(node) ||
    ts.isJsxSelfClosingElement(node)
  ) {
    ourContext.tsx = true;
  }
  let fullStart;
  try {
    fullStart = node.getFullStart();
  } catch {
    return node;
  }
  let replacementNode;
  const { text } = ourContext;
  ts.forEachLeadingCommentRange(text, fullStart, (pos, end) => {
    replacementNode = processComment(ourContext, node, context, pos, end);
  });
  ts.forEachTrailingCommentRange(text, fullStart, (pos, end) => {
    replacementNode = processComment(ourContext, node, context, pos, end);
  });
  node = replacementNode || node;
  const visitor = (node) => processJsdoc(ourContext, node, context);
  return ts.visitEachChild(node, visitor, context);
}

const isAnyFunction = (node) =>
  ts.isFunctionDeclaration(node) ||
  ts.isArrowFunction(node) ||
  ts.isFunctionExpression(node) ||
  ts.isMethodDeclaration(node);

function replaceArrayGenerics(type) {
  while (type.includes('Array<')) {
    const replaced = type.replace(/Array(<.+>)([^>]|$)/g, (match, t, tail) => {
      let bracketAt = 0;
      let i = 0;
      for (; i < t.length; i++) {
        const char = t[i];
        if (char === '<') {
          bracketAt++;
        } else if (char === '>') {
          if (bracketAt === 1) {
            break;
          }
          bracketAt--;
        }
      }
      return `${t.substring(1, i)}[]${t.substring(i + 1)}${tail}`;
    });
    if (replaced === type) {
      return type;
    }
    type = replaced;
  }
  return type;
}

/**
 *
 * @param {*} ourContext
 * @param {*} node
 * @param {ts.TransformationContext} context
 * @param {*} pos
 * @param {*} end
 * @returns
 */
function processComment({ text, comments, imports }, node, context, pos, end) {
  const { factory } = context;
  const comment = text.slice(pos, end);
  let replacementNode;
  let newComment = comment;
  let paramIndex = 0;
  const [jsdoc] = parseComment(comment);
  for (const tag of jsdoc?.tags || []) {
    let remove = false;
    const type = replaceArrayGenerics(extractImports(imports, tag.type));
    const annotated = getAnnotated(node);
    if (tag.tag.startsWith('return')) {
      if (isAnyFunction(annotated)) {
        remove = true;
        annotated.type = factory.createTypeReferenceNode(type);
      }
    } else if (tag.tag === 'param') {
      if (isAnyFunction(annotated)) {
        remove = true;
        const param = annotated.parameters[paramIndex++];
        param.type = factory.createTypeReferenceNode(type);
        if (tag.type.includes('=') && !param.initializer) {
          param.questionToken = factory.createToken(
            ts.SyntaxKind.QuestionToken
          );
        }
      }
    } else if (tag.tag === 'type') {
      if (ts.isParenthesizedExpression(annotated)) {
        remove = true;
        annotated.expression = factory.createAsExpression(
          annotated.expression,
          factory.createTypeReferenceNode(type)
        );
      }
    } else if (tag.tag === 'typedef') {
      if (ts.isVariableStatement(node)) {
        remove = true;
        // only apply to first declaration
        const [declaration] = node.declarationList.declarations;
        replacementNode = factory.createTypeAliasDeclaration(
          node.decorators,
          node.modifiers,
          declaration.name,
          [],
          factory.createTypeReferenceNode(type)
        );
      }
    }
    if (remove) {
      newComment = clearTagFromComment(newComment, tag);
    }
  }
  if (newComment !== comment) {
    if (/^\/\*\*[\n\s]*\*\/$/m.test(newComment)) {
      newComment = '';
    }
    comments.push([comment, newComment]);
  }
  return replacementNode;
}

function clearTagFromComment(comment, tag) {
  for (const { source } of tag.source) {
    // either full comments or partial comments (no head or tail)
    if (!source.endsWith('*/') || source.startsWith('/*')) {
      const commentRe = new RegExp(`\\n?${escapeRegexLiteral(source)}`);
      comment = comment.replace(commentRe, '');
    }
  }
  return comment;
}

function serializeImports(imports) {
  return Object.entries(imports).map(
    ([source, identifiers]) =>
      `import type {${Array.from(identifiers).join(', ')}} from "${source}";`
  );
}

/**
 * @param {string} filename
 * @param {string} text
 * @return {string}
 */
export function twots(filename, text) {
  const imports = {};
  const comments = [];
  const ourContext = {
    tsx: false,
    text,
    comments,
    imports,
  };
  const transformer = (context) => (sourceFile) => {
    const visitor = (node) => processJsdoc(ourContext, node, context);
    return ts.visitNode(sourceFile, visitor);
  };
  const sourceFile = ts.createSourceFile(filename, text, languageVersion);
  const [transformed] = ts.transform(sourceFile, [transformer]).transformed;
  const printer = ts.createPrinter();
  let printed = printer.printFile(transformed);
  for (const [comment, replacement] of comments) {
    const commentRe = new RegExp(
      escapeRegexLiteral(comment)
        .trim()
        .replace(/\n\s*([^\s])/g, '\\n\\s*$1')
    );
    printed = printed.replace(commentRe, replacement);
  }
  const code = [serializeImports(imports), printed].flat().join('\n');
  return { tsx: ourContext.tsx, code };
}
