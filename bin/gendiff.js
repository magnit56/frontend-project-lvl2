#!/usr/bin/env node

import commander from 'commander';
import gendiff from '../src/gendiff.js';

const run = () => {
  commander
    .description('Compares two configuration files and shows a difference.')
    .version('1.0.0')
    .option('-f, --format [type]', 'output format', 'json')
    .arguments('<filepath1> <filepath2>')
    .action((filepath1, filepath2) => {
      console.log(gendiff(filepath1, filepath2, commander.opts().format));
    });
  commander.parse(process.argv);
};

run();
