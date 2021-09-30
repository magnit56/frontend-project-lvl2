const stringify = (part, depth) => {
  const type = typeof part;
  if (part === null) {
    return 'null';
  }
  if (type === 'string') {
    return part;
  }
  if (type === 'undefined') {
    return 'undefined';
  }
  if (type === 'boolean') {
    return part.toString();
  }
  if (type === 'object') {
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
  }
  return part.toString();
};

export default (tree) => {
  const iter = (ast, depth) => {
    const baseIndent = '  ';
    const depthIndent = '    '.repeat(depth - 1);
    const indent = baseIndent + depthIndent;
    const bracketIndent = depthIndent;

    const parts = ast.map((part) => {
      if (part.type === 'added') {
        const valueAdded = stringify(part.value, depth + 1);
        return `${indent}+ ${part.name}: ${valueAdded}`;
      }
      if (part.type === 'deleted') {
        const valueDeleted = stringify(part.value, depth + 1);
        return `${indent}- ${part.name}: ${valueDeleted}`;
      }
      if (part.type === 'unchanged') {
        const valueUnchanged = stringify(part.value, depth + 1);
        return `${indent}  ${part.name}: ${valueUnchanged}`;
      }
      if (part.type === 'changed') {
        const beforeValue = stringify(part.beforeValue, depth + 1);
        const afterValue = stringify(part.afterValue, depth + 1);
        const before = `${indent}- ${part.name}: ${beforeValue}`;
        const after = `${indent}+ ${part.name}: ${afterValue}`;
        return [before, after].join('\n');
      }
      if (part.type === 'nested') {
        const children = iter(part.children, depth + 1);
        return `${indent}  ${part.name}: ${children}`;
      }
      throw new Error('Этого не может быть!');
    });
    return ['{', ...parts, `${bracketIndent}}`].join('\n');
  };
  return iter(tree, 1);
};
