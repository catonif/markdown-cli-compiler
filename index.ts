#!/usr/bin/env node

import fs = require('fs');
import path = require('path');

import glob = require('glob');

import hljs = require('highlight.js');

const argser = require('./src/argser');
const args = argser.args;

const emit = require('./src/emit');
emit.setup(args.noOk, args.noWarn, args.failOnWarn, args.debug);

const md = require('markdown-it');
const utils = md().utils;

function highlightFunction(str: string, lang: string) {

	if (lang && hljs.getLanguage(lang)) {
		try {

			return '<pre class="hljs"><code>'
				+ hljs.highlight(lang, str, true).value
				+ '</code></pre>';

		} catch { }
	}

	return '<pre class="hljs"><code>' + utils.escapeHtml(str) + '</code></pre>';

}

function compilePath(args) {

	if (!fs.existsSync(args.input)) {
		emit.fail("Couldn't find " + args.input);
	}

	const stats = fs.statSync(args.input);

	if (stats.isFile()) {

		if (args.ignore) return;

		emit.setup(args.noOk, args.noWarn, args.failOnWarn, args.debug);

		let headHtml: string = '';

		const outputDir: string = path.dirname(args.output);

		// title
		if (args.title != undefined) {
			headHtml += '<title>' + args.title + '</title>';
		}

		// custom styles
		if (args.styles != undefined) {
			for (let i: number = 0; i < args.styles.length; i++) {
				glob.sync(args.styles[i], { cwd: outputDir }).forEach(style => {
					headHtml += `<link rel="stylesheet" href="${style}">`;
				});
			}
			/* args.styles.forEach((item: string) => headHtml += `<link rel="stylesheet" href="${item}">`); */
		}

		// copied styles
		if (args.copiedStyles != undefined) {
			args.copiedStyles.forEach((cssToCopy: string) => {
				const cssToCopyPath: string = path.join(outputDir, cssToCopy);
				if (fs.existsSync(cssToCopyPath)) {
					headHtml += '<style>' + fs.readFileSync(cssToCopyPath) + '</style>';
				} else {
					emit.warn("Couldn't find a CSS at " + cssToCopyPath);
				}
			});
		}

		// hljs style
		if (args.hls != undefined) {
			const highlightJsThemePath = __dirname + '/node_modules/highlight.js/styles/' + args.hls +'.css';
			if (fs.existsSync(highlightJsThemePath)) {
				headHtml += '<style>' + fs.readFileSync(highlightJsThemePath) + '</style>';
			} else {
				emit.warn("Couldn't find a highlight.js file named " + args.hls);
			}
		}

		// inline style
		if (args.inlineStyle != undefined) {
			headHtml += '<style>' + args.inlineStyle + '</style>';
		}

		// plugins

		const mdRenderer = md({
			highlight: highlightFunction,
			html: args.html,
			xhtmlOut: args.xhtmlOut,
			breaks: args.breaks,
			langPrefix: args.langPrefix,
			linkify: args.linkify,
			typographer: args.typographer,
			quotes: args.quotes,
		});

		if (args.plugins != undefined) {
			for (let i: number = 0; i < args.plugins.length; i++) {
				switch (args.plugins[i]) { // special treatment for some plugins

					case 'texmath': case 'markdown-it-texmath':
						mdRenderer.use(require('markdown-it-texmath'), { engine: require('katex'), delimeters: 'dollars' });
						headHtml += '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css" integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X" crossorigin="anonymous">';
						break;

					case 'multimd-table': case 'markdown-it-multimd-table': 
						mdRenderer.use(require('markdown-it-multimd-table'), { multiline: true, rowspan: true, headerless: true });
						break;

					default:
						const pluginName: string = 'markdown-it-' + args.plugins[i];
						try { mdRenderer.use(require(pluginName)); }
						catch {
							try {
								mdRenderer.use(require(args.plugins[i]));
							} catch {
								emit.warn(args.plugins[i] + " isn't a plugin currently supported by your version of mdc. Ignoring it...");
							}
						}
						break;
				}
			}
		}

		let commentHtml: string = '';
		if (args.comment) {
			commentHtml = '<!-- mdc ';
			for (let i: number = 2; i < process.argv.length; i++) {
				commentHtml += process.argv[i] + ' ';
			}
			commentHtml += '-->';
		}

		const fullMarkdown: string = fs.readFileSync(<string>args.input, <BufferEncoding>args.enc);

		const fullHtml: string = '<!DOCTYPE html>\n'
			+ commentHtml + '<html><head>'
			+ headHtml + '</head><body>'
			+ mdRenderer.render(fullMarkdown) + '</body>';

		if (!args.force) {
			if (fs.existsSync(args.output)) {
				// TODO: force override, or a dialog that asks if you really want to override the file
				emit.warn(args.output + " already exists, its content will be lost");
			}
		}

		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, {recursive: true});
		}

		try {
			fs.writeFileSync(args.output, fullHtml);
		} catch {
			emit.fail("Failed to write at " + args.output);
		}

		emit.success("File succesfully compiled at " + args.output);
		
	} else if (stats.isDirectory()) {

		const configPath: string = path.join(args.input, 'mdconfig.json');

		if (!fs.existsSync(configPath)) emit.fail("Couldn't find " + configPath);

		emit.success("Found " + configPath);
		const configList = JSON.parse(fs.readFileSync(configPath, <BufferEncoding>args.enc));

		for (let configItor: number = 0; configItor < configList.length; configItor++) {

			const currentConfig = argser.expandFromDefaultSettings(configList[configItor]);
			currentConfig.input = path.join(args.input, currentConfig.input);
			currentConfig.output = path.join(args.input, currentConfig.output);

			/*if (currentConfig.styles != undefined) {
				for (let styleItor: number = 0; styleItor < currentConfig.styles.length; styleItor++) {
					currentConfig.styles[styleItor] = path.join(args.input, currentConfig.styles[styleItor]);
				}
			}*/

			compilePath(currentConfig);

		}

	}
}

compilePath(args);

