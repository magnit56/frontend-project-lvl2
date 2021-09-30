import _ from 'lodash';

const getPropertyFullName = (propertyName, parents) => [...parents, propertyName].join('.');

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

export default (tree) => {
  const iter = (ast, parents) => {
    const parts = ast.map((part) => {
      switch (part.type) {
        case 'added':
          const propertyFullNameAdded = getPropertyFullName(part.name, parents);
          const valueAdded = getStringValue(part.value);
          return `Property '${propertyFullNameAdded}' was added with value: ${valueAdded}`;
        case 'deleted':
          const propertyFullNameDeleted = getPropertyFullName(part.name, parents);
          return `Property '${propertyFullNameDeleted}' was removed`;
        case 'changed':
          const propertyFullNameChanged = getPropertyFullName(part.name, parents);
          const beforeValue = getStringValue(part.beforeValue);
          const afterValue = getStringValue(part.afterValue);
          return `Property '${propertyFullNameChanged}' was updated. From ${beforeValue} to ${afterValue}`;
        case 'nested':
          const propertyName = part.name;
          const childrenParents = [...parents, propertyName];
          return iter(part.children, childrenParents);
        default:
          return '';
      }
    });
    return _.filter(parts).join('\n');
  };
  return iter(tree, []);
};
