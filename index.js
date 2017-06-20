#!/usr/bin/env node

const fs = require('fs');

const program = require('commander');

const realizedProfit = require('./lib/realizedProfit');

program
	.option('-i, --input <path>', 'Input file')
	.option('-o, --output <path>', 'Output file')
	.parse(process.argv);

const inputStream = program.input ? fs.createReadStream(program.input, {encoding: 'utf-8'}) : process.stdin;
const outputStream = program.output ? fs.createWriteStream(program.output) : process.stdout;

realizedProfit(inputStream, outputStream);
