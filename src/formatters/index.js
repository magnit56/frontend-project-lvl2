import renderJson from './renderJson.js';
import renderStylish from './renderStylish.js';
import renderPlain from './renderPlain.js';

export default (ast, format) => {
  const mapping = {
    json: renderJson,
    stylish: renderStylish,
    plain: renderPlain,
  };
  return mapping[format](ast);
};
