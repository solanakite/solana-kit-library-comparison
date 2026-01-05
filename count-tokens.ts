import * as ts from "typescript";
import { readFileSync } from "fs";

const files = ["kite.ts", "gill.ts", "kit.ts", "framework-kit.ts", "web3js.ts"];

interface TokenCount {
  file: string;
  tokens: number;
}

const countTokens = (filePath: string): number => {
  const sourceCode = readFileSync(filePath, "utf-8");
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  );

  let tokenCount = 0;

  const visit = (node: ts.Node) => {
    if (
      node.kind !== ts.SyntaxKind.EndOfFileToken &&
      node.kind !== ts.SyntaxKind.SingleLineCommentTrivia &&
      node.kind !== ts.SyntaxKind.MultiLineCommentTrivia
    ) {
      const tokenText = node.getText(sourceFile).trim();
      if (tokenText.length > 0) {
        tokenCount++;
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  return tokenCount;
};

const results: Array<TokenCount> = [];

for (const file of files) {
  const tokens = countTokens(file);
  results.push({ file, tokens });
}

results.sort((a, b) => a.tokens - b.tokens);

const minTokens = results[0].tokens;

console.log("\n=== Token Count Results ===\n");

for (const result of results) {
  const extraTokens = result.tokens - minTokens;

  let moreCodeIndicator = "";
  if (extraTokens > 0) {
    const percentageMore = (((result.tokens - minTokens) / minTokens) * 100).toFixed(1);
    moreCodeIndicator = ` (${percentageMore}% more code)`;
  }

  console.log(
    `${result.file.padEnd(20)} ${result.tokens
      .toString()
      .padStart(4)} tokens${moreCodeIndicator}`
  );
}

console.log();
