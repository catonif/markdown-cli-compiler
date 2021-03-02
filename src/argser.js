"use strict";
var _a;
exports.__esModule = true;
var fs = require("fs");
var commandsJsonPath = __dirname + '/commands.json';
if (!fs.existsSync(commandsJsonPath)) {
    require('./emit.js').fail("Couldn't find the commands.json. Try reinstalling this package to fix.");
}
var commands = JSON.parse(fs.readFileSync(commandsJsonPath, 'utf8'));
var argv = require('yargs/yargs')(process.argv.slice(2))
    .usage('Usage: mdc [options]')
    .options(commands)
    .help('h').alias('h', 'help').argv;
exports.args = {
    input: argv.input,
    output: (_a = argv.output) !== null && _a !== void 0 ? _a : argv.input + '.html',
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
exports.expandFromDefaultSettings = function (from) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
    var input = from.input;
    // on boolean ones I could just write ?? false for efficiency, since I'm never gonna change those values
    // styles, copiedStyles, plugins, hls and title's default's are undefined, so i could delete the whole ?? operator
    return {
        input: input,
        output: (_a = from.output) !== null && _a !== void 0 ? _a : input + '.html',
        styles: (_b = from.styles) !== null && _b !== void 0 ? _b : commands.styles["default"],
        copiedStyles: (_c = from.copiedStyles) !== null && _c !== void 0 ? _c : commands.copiedStyles["default"],
        plugins: (_d = from.plugins) !== null && _d !== void 0 ? _d : commands.plugins["default"],
        hls: (_e = from.hls) !== null && _e !== void 0 ? _e : commands.hls["default"],
        enc: (_f = from.enc) !== null && _f !== void 0 ? _f : commands.enc["default"],
        html: (_g = from.html) !== null && _g !== void 0 ? _g : commands.html["default"],
        xhtmlOut: (_h = from.xhtmlOut) !== null && _h !== void 0 ? _h : commands.xhtmlOut["default"],
        breaks: (_j = from.breaks) !== null && _j !== void 0 ? _j : commands.breaks["default"],
        langPrefix: (_k = from.langPrefix) !== null && _k !== void 0 ? _k : commands.langPrefix["default"],
        linkify: (_l = from.linkify) !== null && _l !== void 0 ? _l : commands.linkify["default"],
        typographer: (_m = from.typographer) !== null && _m !== void 0 ? _m : commands.typographer["default"],
        quotes: (_o = from.quotes) !== null && _o !== void 0 ? _o : commands.quotes["default"],
        noOk: (_p = from.noOk) !== null && _p !== void 0 ? _p : commands.noOk["default"],
        noWarn: (_q = from.noWarn) !== null && _q !== void 0 ? _q : commands.noWarn["default"],
        failOnWarn: (_r = from.failOnWarn) !== null && _r !== void 0 ? _r : commands.failOnWarn["default"],
        debug: (_s = from.debug) !== null && _s !== void 0 ? _s : commands.debug["default"],
        comment: (_t = from.comment) !== null && _t !== void 0 ? _t : commands.comment["default"],
        force: (_u = from.force) !== null && _u !== void 0 ? _u : commands.force["default"],
        ignore: (_v = from.ignore) !== null && _v !== void 0 ? _v : commands.ignore["default"],
        title: (_w = from.title) !== null && _w !== void 0 ? _w : commands.title["default"],
        inlineStyle: (_x = from.inlineStyle) !== null && _x !== void 0 ? _x : commands.inlineStyle["default"]
    };
};
