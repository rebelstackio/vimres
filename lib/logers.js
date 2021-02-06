const chalk = require('chalk');

const error = chalk.bold.red;
const warning = chalk.yellowBright;
const success = chalk.greenBright;
const hl = chalk.bgYellowBright.redBright;

module.exports = { error, warning, success, hl }