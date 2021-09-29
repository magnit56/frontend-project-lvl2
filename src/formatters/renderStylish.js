export default (ast) => {
  const iter = (ast, depth) => {
    const baseIndent = '  ';
    const depthIndent = '    '.repeat(depth - 1);
    const indent = baseIndent + depthIndent;
    const bracketIndent = depthIndent;

    const parts = ast.map((part) => {
      let value, before, after, beforeValue, afterValue, children;
      switch (part.type) {
        case 'added':
          value = stringify(part.value, depth + 1);
          return indent + `+ ${part.name}: ${value}`;
        case 'deleted':
          value = stringify(part.value, depth + 1);
          return indent + `- ${part.name}: ${value}`;
        case 'unchanged':
          value = stringify(part.value, depth + 1);
          return indent + `  ${part.name}: ${value}`;
        case 'changed':
          beforeValue = stringify(part.beforeValue, depth + 1);
          afterValue = stringify(part.afterValue, depth + 1);
          before = indent + `- ${part.name}: ${beforeValue}`;
          after = indent + `+ ${part.name}: ${afterValue}`;
          return [before, after].join('\n');
        case 'nested':
          children = iter(part.children, depth + 1);
          return indent + `  ${part.name}: ` + children;
      }
    });
    return ['{', ...parts, `${bracketIndent}}`].join('\n');
  }
  return iter(ast, 1);
}

const stringify = (part, depth) => {
  const type = typeof part;
  if (part === null) {
    return 'null';
  }
  switch (type) {
    case 'string':
      return part;
    case 'undefined':
      return 'undefined';
    case 'boolean':
      return part.toString();
    case 'object':
      const baseIndent = '  ';
      const depthIndent = '    '.repeat(depth - 1);
      const indent = baseIndent + depthIndent;
      const bracketIndent = depthIndent;

      const map = new Map(Object.entries(part));
      const elements = Array.from(map).map(([key, value]) => {
        const item = stringify(value, depth + 1);
        return `${indent}  ${key}: ${item}`;
      });
      return ['{', ...elements, `${bracketIndent}}`].join('\n');
    default:
      return part.toString();
  }
}