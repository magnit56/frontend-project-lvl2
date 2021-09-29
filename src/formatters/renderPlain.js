import _ from 'lodash';

export default (ast) => {
  const iter = (ast, parents) => {
    let propertyFullName; let value; let beforeValue; let afterValue; let propertyName; let
      childrenParents;
    const parts = ast.map((part) => {
      switch (part.type) {
        case 'added':
          propertyFullName = getPropertyFullName(part.name, parents);
          value = getStringValue(part.value);
          return `Property '${propertyFullName}' was added with value: ${value}`;
        case 'deleted':
          propertyFullName = getPropertyFullName(part.name, parents);
          return `Property '${propertyFullName}' was removed`;
        case 'changed':
          propertyFullName = getPropertyFullName(part.name, parents);
          beforeValue = getStringValue(part.beforeValue);
          afterValue = getStringValue(part.afterValue);
          return `Property '${propertyFullName}' was updated. From ${beforeValue} to ${afterValue}`;
        case 'nested':
          propertyName = part.name;
          childrenParents = [...parents, propertyName];
          return iter(part.children, childrenParents);
        default:
          return '';
      }
    });
    return _.filter(parts).join('\n');
  };
  return iter(ast, []);
};

const getStringValue = (value) => {
  const type = typeof value;
  if (value === null) {
    return 'null';
  }
  switch (type) {
    case 'boolean':
      return value.toString();
    case 'string':
      return `'${value}'`;
    case 'number':
      return `${value}`;
    case 'object':
      return '[complex value]';
    default:
      return value.toString();
  }
};

const getPropertyFullName = (propertyName, parents) => [...parents, propertyName].join('.');
