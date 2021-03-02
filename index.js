#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var glob = require("glob");
var hljs = require("highlight.js");
var argser = require('./src/argser');
var args = argser.args;
var emit = require('./src/emit');
emit.setup(args.noOk, args.noWarn, args.failOnWarn, args.debug);
var md = require('markdown-it');
var utils = md().utils;
function highlightFunction(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
        try {
            return '<pre class="hljs"><code>'
                + hljs.highlight(lang, str, true).value
                + '</code></pre>';
        }
        catch (_a) { }
    }
    return '<pre class="hljs"><code>' + utils.escapeHtml(str) + '</code></pre>';
}
function compilePath(args) {
    if (!fs.existsSync(args.input)) {
        emit.fail("Couldn't find " + args.input);
    }
    var stats = fs.statSync(args.input);
    if (stats.isFile()) {
        if (args.ignore)
            return;
        emit.setup(args.noOk, args.noWarn, args.failOnWarn, args.debug);
        var headHtml_1 = '';
        var outputDir_1 = path.dirname(args.output);
        // title
        if (args.title != undefined) {
            headHtml_1 += '<title>' + args.title + '</title>';
        }
        // custom styles
        if (args.styles != undefined) {
            for (var i = 0; i < args.styles.length; i++) {
                glob.sync(args.styles[i], { cwd: outputDir_1 }).forEach(function (style) {
                    headHtml_1 += "<link rel=\"stylesheet\" href=\"" + style + "\">";
                });
            }
            /* args.styles.forEach((item: string) => headHtml += `<link rel="stylesheet" href="${item}">`); */
        }
        // copied styles
        if (args.copiedStyles != undefined) {
            args.copiedStyles.forEach(function (cssToCopy) {
                var cssToCopyPath = path.join(outputDir_1, cssToCopy);
                if (fs.existsSync(cssToCopyPath)) {
                    headHtml_1 += '<style>' + fs.readFileSync(cssToCopyPath) + '</style>';
                }
                else {
                    emit.warn("Couldn't find a CSS at " + cssToCopyPath);
                }
            });
        }
        // hljs style
        if (args.hls != undefined) {
            var highlightJsThemePath = __dirname + '/node_modules/highlight.js/styles/' + args.hls + '.css';
            if (fs.existsSync(highlightJsThemePath)) {
                headHtml_1 += '<style>' + fs.readFileSync(highlightJsThemePath) + '</style>';
            }
            else {
                emit.warn("Couldn't find a highlight.js file named " + args.hls);
            }
        }
        // inline style
        if (args.inlineStyle != undefined) {
            headHtml_1 += '<style>' + args.inlineStyle + '</style>';
        }
        // plugins
        var mdRenderer = md({
            highlight: highlightFunction,
            html: args.html,
            xhtmlOut: args.xhtmlOut,
            breaks: args.breaks,
            langPrefix: args.langPrefix,
            linkify: args.linkify,
            typographer: args.typographer,
            quotes: args.quotes
        });
        if (args.plugins != undefined) {
            for (var i = 0; i < args.plugins.length; i++) {
                switch (args.plugins[i]) { // special treatment for some plugins
                    case 'texmath':
                    case 'markdown-it-texmath':
                        mdRenderer.use(require('markdown-it-texmath'), { engine: require('katex'), delimeters: 'dollars' });
                        headHtml_1 += '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css" integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X" crossorigin="anonymous">';
                        break;
                    case 'multimd-table':
                    case 'markdown-it-multimd-table':
                        mdRenderer.use(require('markdown-it-multimd-table'), { multiline: true, rowspan: true, headerless: true });
                        break;
                    default:
                        var pluginName = 'markdown-it-' + args.plugins[i];
                        try {
                            mdRenderer.use(require(pluginName));
                        }
                        catch (_a) {
                            try {
                                mdRenderer.use(require(args.plugins[i]));
                            }
                            catch (_b) {
                                emit.warn(args.plugins[i] + " isn't a plugin currently supported by your version of mdc. Ignoring it...");
                            }
                        }
                        break;
                }
            }
        }
        var commentHtml = '';
        if (args.comment) {
            commentHtml = '<!-- mdc ';
            for (var i = 2; i < process.argv.length; i++) {
                commentHtml += process.argv[i] + ' ';
            }
            commentHtml += '-->';
        }
        var fullMarkdown = fs.readFileSync(args.input, args.enc);
        var fullHtml = '<!DOCTYPE html>\n'
            + commentHtml + '<html><head>'
            + headHtml_1 + '</head><body>'
            + mdRenderer.render(fullMarkdown) + '</body>';
        if (!args.force) {
            if (fs.existsSync(args.output)) {
                // TODO: force override, or a dialog that asks if you really want to override the file
                emit.warn(args.output + " already exists, its content will be lost");
            }
        }
        if (!fs.existsSync(outputDir_1)) {
            fs.mkdirSync(outputDir_1, { recursive: true });
        }
        try {
            fs.writeFileSync(args.output, fullHtml);
        }
        catch (_c) {
            emit.fail("Failed to write at " + args.output);
        }
        emit.success("File succesfully compiled at " + args.output);
    }
    else if (stats.isDirectory()) {
        var configPath = path.join(args.input, 'mdconfig.json');
        if (!fs.existsSync(configPath))
            emit.fail("Couldn't find " + configPath);
        emit.success("Found " + configPath);
        var configList = JSON.parse(fs.readFileSync(configPath, args.enc));
        for (var configItor = 0; configItor < configList.length; configItor++) {
            var currentConfig = argser.expandFromDefaultSettings(configList[configItor]);
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
