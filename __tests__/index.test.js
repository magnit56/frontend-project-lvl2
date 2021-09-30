import path from 'path';
import fs from "fs";
import genDiff from '../index.js';

let extensions, formats;

beforeEach(() => {
  extensions = ['json', 'yaml'];
  formats = ['stylish', 'plain', 'json'];
});

test('genDiff', () => {
  extensions.forEach((extension) => {
    const pathToBefore = path.resolve(__dirname, '..', '__tests__', '__fixtures__', 'inputData', extension, `before.${extension}`);
    const pathToAfter = path.resolve(__dirname, '..', '__tests__', '__fixtures__', 'inputData', extension, `after.${extension}`);

    const before = fs.readFileSync(pathToBefore, 'utf-8');
    const after = fs.readFileSync(pathToAfter, 'utf-8');

    formats.forEach((format) => {
      const actual = genDiff(pathToBefore, pathToAfter, format);
      const pathToResult = path.resolve(__dirname,'..', '__tests__', '__fixtures__', 'outputData', format, 'result');
      const expected = fs.readFileSync(pathToResult, 'utf-8');
      expect(actual).toBe(expected);
    });
  });
});
