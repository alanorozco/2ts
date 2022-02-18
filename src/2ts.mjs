import { parse as parseComment } from "comment-parser";
import ts from "typescript";

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
    .replace(/[=!]/g, "")
    .replace(/\?/g, () => {
      if (orNull) {
        return "";
      }
      orNull = true;
      return "null|";
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
 * @param {{[string: string]: string[]}} imports
 * @param {ts.Node} node
 * @param {ts.TransformationContext} context
 */
function processJsdoc(text, imports, node, context) {
  // if (node.jsDoc) {
  let commentRanges;
  let isTrailing = false;
  try {
    commentRanges = ts.getLeadingCommentRanges(text, node.getFullStart());
    if (!commentRanges?.length) {
      isTrailing = true;
      commentRanges = ts.getTrailingCommentRanges(text, node.getFullStart());
    }
  } catch {}
  if (!commentRanges?.length) {
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
  const { factory } = context;
  const [commentRange] = commentRanges;
  const comment = text.slice(commentRange.pos, commentRange.end);
  let paramIndex = 0;
  const [jsdoc] = parseComment(comment);
  for (const tag of jsdoc?.tags || []) {
    const type = extractImports(imports, tag.type);
    if (tag.tag.startsWith("return")) {
      if (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node)) {
        node.type = factory.createTypeReferenceNode(type);
      }
    } else if (tag.tag === "param") {
      if (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node)) {
        const param = node.parameters[paramIndex++];
        param.type = factory.createTypeReferenceNode(type);
        if (tag.type.includes("=")) {
          param.questionToken = factory.createToken(
            ts.SyntaxKind.QuestionToken
          );
        }
      }
    } else if (tag.tag === "type") {
      if (ts.isParenthesizedExpression(node)) {
        node.expression = factory.createAsExpression(
          node.expression,
          factory.createTypeReferenceNode(type)
        );
      }
    }
  }
}

function serializeImports(imports) {
  return Object.entries(imports).map(
    ([source, identifiers]) =>
      `import type {${Array.from(identifiers).join("\n")}} from "${source}";`
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
  const transformer = (context) => {
    return (sourceFile) => {
      const visitor = (node) => {
        processJsdoc(text, imports, node, context);
        return ts.visitEachChild(node, visitor, context);
      };
      return ts.visitNode(sourceFile, visitor);
    };
  };
  const sourceFile = ts.createSourceFile(filename, text, languageVersion);
  const [transformed] = ts.transform(sourceFile, [transformer]).transformed;
  const printer = ts.createPrinter();
  return [serializeImports(imports), printer.printFile(transformed)]
    .flat()
    .join("\n");
}
