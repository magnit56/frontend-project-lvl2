import commander from 'commander';

export default () => {
  commander
    .description('Compares two configuration files and shows a difference.')
    .version('1.0.0')
    .option('-f, --format [type]', 'output format', 'json')
    .arguments('<filepath1> <filepath2>');

  commander.parse(process.argv);

  const options = commander.opts();

  console.log(options.format);
  console.log(commander.args);
};
