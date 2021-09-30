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
};

export default (tree) => {
  const iter = (ast, depth) => {
    const baseIndent = '  ';
    const depthIndent = '    '.repeat(depth - 1);
    const indent = baseIndent + depthIndent;
    const bracketIndent = depthIndent;

    const parts = ast.map((part) => {
      // let value; let before; let after; let beforeValue; let afterValue; let
      //   children;
      switch (part.type) {
        case 'added':
          const valueAdded = stringify(part.value, depth + 1);
          return `${indent}+ ${part.name}: ${valueAdded}`;
        case 'deleted':
          const valueDeleted = stringify(part.value, depth + 1);
          return `${indent}- ${part.name}: ${valueDeleted}`;
        case 'unchanged':
          const valueUnchanged = stringify(part.value, depth + 1);
          return `${indent}  ${part.name}: ${valueUnchanged}`;
        case 'changed':
          const beforeValue = stringify(part.beforeValue, depth + 1);
          const afterValue = stringify(part.afterValue, depth + 1);
          const before = `${indent}- ${part.name}: ${beforeValue}`;
          const after = `${indent}+ ${part.name}: ${afterValue}`;
          return [before, after].join('\n');
        case 'nested':
          const children = iter(part.children, depth + 1);
          return `${indent}  ${part.name}: ${children}`;
        default:
          throw new Error('Этого не может быть!');
      }
    });
    return ['{', ...parts, `${bracketIndent}}`].join('\n');
  };
  return iter(tree, 1);
};
