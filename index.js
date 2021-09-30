import genDiff from "./src/gendiff.js";

export default (filepath1, filepath2, format = 'stylish') => genDiff(filepath1, filepath2, format);