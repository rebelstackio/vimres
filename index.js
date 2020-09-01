#!/usr/bin/env node

const app = require('./lib/index');
const chalk = require('chalk');

const error = chalk.bold.red;
const warning = chalk.keyword('orange');

const init = getBoolArg('--init');
if (!init) {
    app.vimres(process.cwd());
} else {
    console.log('#> ' + warning('Init begin'))
}

function getBoolArg(arg) {
    const index = process.argv.indexOf(arg)
    return index !== -1
}

module.exports = { vimres: app.vimres }