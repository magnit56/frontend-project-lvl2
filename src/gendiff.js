import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parse from './parse.js';
import render from './formatters/index.js';

const FORMATS = ['stylish', 'plain', 'json'];

const customEqual = (elem1, elem2) => {
  if (Array.isArray(elem1) && Array.isArray(elem2)) {
    return _.difference(elem1, elem2).length === 0;
  }
  return elem1 === elem2;
};

const customIsObject = (elem) => {
  if (typeof elem !== 'object') {
    return false;
  }
  if (elem === null) {
    return false;
  }
  return elem.toString() === '[object Object]';
};

const isNested = (elem1, elem2, key) => {
  const keyStatus = Object.prototype.hasOwnProperty.call(elem1, key)
    && Object.prototype.hasOwnProperty.call(elem2, key);
  return keyStatus ? (customIsObject(elem1[key])
    && customIsObject(elem2[key])) : false;
};

const isAdded = (elem1, elem2, key) => {
  const keyStatus = !Object.prototype.hasOwnProperty.call(elem1, key)
    && Object.prototype.hasOwnProperty.call(elem2, key);
  return keyStatus;
};

const isDeleted = (elem1, elem2, key) => {
  const keyStatus = Object.prototype.hasOwnProperty.call(elem1, key)
    && !Object.prototype.hasOwnProperty.call(elem2, key);
  return keyStatus;
};

const isChanged = (elem1, elem2, key) => {
  const keyStatus = Object.prototype.hasOwnProperty.call(elem1, key)
    && Object.prototype.hasOwnProperty.call(elem2, key);
  return keyStatus ? !customEqual(elem1[key], elem2[key]) : false;
};

const isUnchanged = (elem1, elem2, key) => {
  const keyStatus = Object.prototype.hasOwnProperty.call(elem1, key)
    && Object.prototype.hasOwnProperty.call(elem2, key);
  return keyStatus ? customEqual(elem1[key], elem2[key]) : false;
};

const getAst = (before, after) => {
  const beforeKeys = Object.keys(before);
  const afterKeys = Object.keys(after);
  const unionKeys = _.uniq(beforeKeys.concat(afterKeys));
  const sortedKeys = _.sortBy(unionKeys);

  const ast = sortedKeys.map((key) => {
    if (isAdded(before, after, key)) {
      return {
        name: key,
        type: 'added',
        value: after[key],
      };
    }
    if (isDeleted(before, after, key)) {
      return {
        name: key,
        type: 'deleted',
        value: before[key],
      };
    }
    if (isNested(before, after, key)) {
      const children = getAst(before[key], after[key]);
      return {
        name: key,
        type: 'nested',
        children,
      };
    }
    if (isChanged(before, after, key)) {
      return {
        name: key,
        type: 'changed',
        beforeValue: before[key],
        afterValue: after[key],
      };
    }
    if (isUnchanged(before, after, key)) {
      return {
        name: key,
        type: 'unchanged',
        value: before[key],
      };
    }
    return {};
  });
  return ast;
};

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  if (!FORMATS.includes(format)) {
    return '?????????? ???????????? ???? ????????????????????????????';
  }
  if (!fs.existsSync(filepath1)) {
    return `???????? ${filepath1} ???? ????????????????????`;
  }
  if (!fs.existsSync(filepath2)) {
    return `???????? ${filepath2} ???? ????????????????????`;
  }
  const currentDirectory = process.cwd();
  const fullfilepath1 = path.resolve(currentDirectory, filepath1);
  const fullfilepath2 = path.resolve(currentDirectory, filepath2);

  const data1 = fs.readFileSync(fullfilepath1, 'utf-8');
  const extension1 = path.extname(fullfilepath1);
  const data2 = fs.readFileSync(fullfilepath2, 'utf-8');
  const extension2 = path.extname(fullfilepath2);

  const before = parse(data1, extension1);
  const after = parse(data2, extension2);

  const ast = getAst(before, after);
  return render(ast, format);
};

export default genDiff;
