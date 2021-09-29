import jsYaml from 'js-yaml';

const parse = (data, extension) => {
  const mapping = {
    '.yml': jsYaml.load,
    '.yaml': jsYaml.load,
    '.json': JSON.parse,
  };
  return mapping[extension](data);
}

export default parse;
