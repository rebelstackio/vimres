#!/usr/bin/env node

const app = require('./lib/index');
const { warning } = require('./lib/logers');
const clear = require('clear');

const init = getBoolArg('--init');
if (!init) {
    clear();
    app.vimres(process.cwd());
} else {
    clear();
    console.log('#> ' + warning('Init begin'))
}

function getBoolArg(arg) {
    const index = process.argv.indexOf(arg)
    return index !== -1
}

module.exports = { vimres: app.vimres }