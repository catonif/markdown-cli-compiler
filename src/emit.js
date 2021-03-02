var noOk;
var noWarn;
var failOnWarn;
var debug;
exports.setup = function (iNoOk, iNoWarn, iFailOnWarn, iDebug) {
    noOk = iNoOk;
    noWarn = iNoWarn;
    failOnWarn = iFailOnWarn;
    debug = iDebug;
};
function fail(message) {
    console.log('\x1b[31m\x1b[1m[ FAIL ]\x1b[0m', message);
    if (debug)
        return;
    process.exit(1);
}
exports.fail = fail;
exports.success = function (message) {
    if (noOk)
        return;
    console.log('\x1b[32m\x1b[1m[  OK  ]\x1b[0m', message);
};
exports.warn = function (message) {
    if (noWarn)
        return;
    if (failOnWarn)
        fail(message);
    else
        console.log('\x1b[33m\x1b[1m[ WARN ]\x1b[0m', message);
};
exports.log = function (message) {
    console.log('\x1b[36m\x1b[1m[ INFO ]\x1b[0m', message);
};
