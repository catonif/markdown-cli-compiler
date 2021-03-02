import { ADDRCONFIG } from 'dns';
import fs = require('fs');

const commandsJsonPath: string = __dirname + '/commands.json';

if (!fs.existsSync(commandsJsonPath)) {
	require('./emit.js').fail("Couldn't find the commands.json. Try reinstalling this package to fix.");
}

const commands = JSON.parse(fs.readFileSync(commandsJsonPath, 'utf8'));

var argv = require('yargs/yargs')(process.argv.slice(2))
	.usage('Usage: mdc [options]')
	.options(commands)
	.help('h').alias('h', 'help').argv;

exports.args = {
	input: argv.input,
	output: argv.output ?? argv.input + '.html',
	styles: argv.styles,
	copiedStyles: argv.copiedStyles,
	plugins: argv.plugins,
	hls: argv.hls,
	enc: argv.enc,
	html: argv.html,
	xhtmlOut: argv.xhtmlOut,
	breaks: argv.breaks,
	langPrefix: argv.langPrefix,
	linkify: argv.linkify,
	typographer: argv.typographer,
	quotes: argv.quotes,
	noOk: argv.noOk,
	noWarn: argv.noWarn,
	failOnWarn: argv.failOnWarn,
	debug: argv.debug,
	comment: argv.comment,
	force: argv.force,
	ignore: argv.ignore,
	title: argv.title,
	inlineStyle: argv.inlineStyle
};

exports.expandFromDefaultSettings = (from: any) => {
	const input: string = from.input;
	// on boolean ones I could just write ?? false for efficiency, since I'm never gonna change those values
	// styles, copiedStyles, plugins, hls and title's default's are undefined, so i could delete the whole ?? operator
	return {
		input: input,
		output: from.output ?? input + '.html',
		styles: from.styles ?? commands.styles.default,
		copiedStyles: from.copiedStyles ?? commands.copiedStyles.default,
		plugins: from.plugins ?? commands.plugins.default,
		hls: from.hls ?? commands.hls.default,
		enc: from.enc ?? commands.enc.default,
		html: from.html ?? commands.html.default,
		xhtmlOut: from.xhtmlOut ?? commands.xhtmlOut.default,
		breaks: from.breaks ?? commands.breaks.default,
		langPrefix: from.langPrefix ?? commands.langPrefix.default,
		linkify: from.linkify ?? commands.linkify.default,
		typographer: from.typographer ?? commands.typographer.default,
		quotes: from.quotes ?? commands.quotes.default,
		noOk: from.noOk ?? commands.noOk.default,
		noWarn: from.noWarn ?? commands.noWarn.default,
		failOnWarn: from.failOnWarn ?? commands.failOnWarn.default,
		debug: from.debug ?? commands.debug.default,
		comment: from.comment ?? commands.comment.default,
		force: from.force ?? commands.force.default,
		ignore: from.ignore ?? commands.ignore.default,
		title: from.title ?? commands.title.default,
		inlineStyle: from.inlineStyle ?? commands.inlineStyle.default
	}
}
