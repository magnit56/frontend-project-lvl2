import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parse from './parse.js';
import render from './formatters/index.js';
import { sort } from 'fast-sort';

const FORMATS = ['stylish', 'plain', 'json'];

const genDiff = (filepath1, filepath2, format) => {
  if (!FORMATS.includes(format)) {
    return 'Такой формат не поддерживается';
  }
  if (!fs.existsSync(filepath1)) {
    return `Файл ${filepath1} не существует`;
  }
  if (!fs.existsSync(filepath2)) {
    return `Файл ${filepath2} не существует`;
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

const getAst = (before, after) => {
  const beforeKeys = Object.keys(before);
  const afterKeys = Object.keys(after);
  const unionKeys = _.uniq(beforeKeys.concat(afterKeys));
  const sortedKeys = sort(unionKeys).asc();

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
        children: children,
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
  });
  return ast;
};

const isNested = (elem1, elem2, key) => {
  const keyStatus = elem1.hasOwnProperty(key) && elem2.hasOwnProperty(key);
  return keyStatus ? (customIsObject(elem1[key]) && customIsObject(elem2[key])) : false;
}

const isAdded = (elem1, elem2, key) => {
  const keyStatus = !elem1.hasOwnProperty(key) && elem2.hasOwnProperty(key);
  return keyStatus;
};

const isDeleted = (elem1, elem2, key) => {
  const keyStatus = elem1.hasOwnProperty(key) && !elem2.hasOwnProperty(key);
  return keyStatus;
};

const isChanged = (elem1, elem2, key) => {
  const keyStatus = elem1.hasOwnProperty(key) && elem2.hasOwnProperty(key);
  return keyStatus ? !customEqual(elem1[key], elem2[key]) : false;
};

const isUnchanged = (elem1, elem2, key) => {
  const keyStatus = elem1.hasOwnProperty(key) && elem2.hasOwnProperty(key);
  return keyStatus ? customEqual(elem1[key], elem2[key]) : false;
};

const customIsObject = (elem) => {
  return elem.toString() === '[object Object]';
};

const customEqual = (elem1, elem2) => {
  if (Array.isArray(elem1) && Array.isArray(elem2)) {
    return _.difference(elem1, elem2).length === 0;
  }
  return elem1 === elem2;
}

export default genDiff;
