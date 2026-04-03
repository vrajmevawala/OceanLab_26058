'use client';

// Refactored tokenizer logic from syntax-tokenizer.ts
export interface Token {
  text: string;
  type: string;
}

const TOKEN_PATTERNS = [
  { type: 'keyword',  regex: /\b(import|export|from|const|let|var|function|return|if|else|for|while|class|interface|type|public|private|static|async|await)\b/g },
  { type: 'string',   regex: /(["'])(?:(?=(\\?))\2.)*?\1/g },
  { type: 'comment',  regex: /\/\/.*|\/\*[\s\S]*?\*\//g },
  { type: 'number',   regex: /\b\d+(\.\d+)?\b/g },
  { type: 'function', regex: /\b[a-zA-Z_]\w*(?=\()/g },
  { type: 'bool',     regex: /\b(true|false|null|undefined)\b/g },
];

export function tokenize(code: string): Token[] {
  let tokens: Token[] = [{ text: code, type: 'plain' }];

  for (const pattern of TOKEN_PATTERNS) {
    const nextTokens: Token[] = [];
    for (const token of tokens) {
      if (token.type !== 'plain') {
        nextTokens.push(token);
        continue;
      }

      let lastIndex = 0;
      let match;
      pattern.regex.lastIndex = 0;

      while ((match = pattern.regex.exec(token.text)) !== null) {
        if (match.index > lastIndex) {
          nextTokens.push({ text: token.text.slice(lastIndex, match.index), type: 'plain' });
        }
        nextTokens.push({ text: match[0], type: pattern.type });
        lastIndex = pattern.regex.lastIndex;
      }

      if (lastIndex < token.text.length) {
        nextTokens.push({ text: token.text.slice(lastIndex), type: 'plain' });
      }
    }
    tokens = nextTokens;
  }

  return tokens;
}
