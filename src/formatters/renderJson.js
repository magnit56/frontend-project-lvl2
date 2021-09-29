export default (ast) => {
  return JSON.stringify(ast, null, '    ');
}