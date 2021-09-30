import path from 'path';
import fs from 'fs';
import genDiff from '../index.js';

const extensions = ['json', 'yaml'];
const formats = ['stylish', 'plain', 'json'];

test('genDiff', () => {
  extensions.forEach((extension) => {
    const pathToBefore = path.resolve(__dirname, '..', '__tests__', '__fixtures__', 'inputData', extension, `before.${extension}`);
    const pathToAfter = path.resolve(__dirname, '..', '__tests__', '__fixtures__', 'inputData', extension, `after.${extension}`);

    formats.forEach((format) => {
      const actual = genDiff(pathToBefore, pathToAfter, format);
      const pathToResult = path.resolve(__dirname, '..', '__tests__', '__fixtures__', 'outputData', format, 'result');
      const expected = fs.readFileSync(pathToResult, 'utf-8');
      expect(actual).toBe(expected);
    });
  });
});
