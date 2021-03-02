let noOk: boolean;
let noWarn: boolean;
let failOnWarn: boolean;
let debug: boolean;

exports.setup = (iNoOk: boolean, iNoWarn: boolean, iFailOnWarn: boolean, iDebug: boolean): void => {
	noOk = iNoOk;
	noWarn = iNoWarn;
	failOnWarn = iFailOnWarn;
	debug = iDebug;
}

function fail(message: string): void {
	console.log('\x1b[31m\x1b[1m[ FAIL ]\x1b[0m', message);
	if (debug) return;
	process.exit(1);
}

exports.fail = fail;

exports.success = (message: string): void => {
	if (noOk) return;
	console.log('\x1b[32m\x1b[1m[  OK  ]\x1b[0m', message);
}

exports.warn = (message: string): void => {
	if (noWarn) return;
	if (failOnWarn) fail(message);
	else console.log('\x1b[33m\x1b[1m[ WARN ]\x1b[0m', message);
}

exports.log = (message: string): void => {
	console.log('\x1b[36m\x1b[1m[ INFO ]\x1b[0m', message);
}
