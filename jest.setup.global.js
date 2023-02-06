require('dotenv').config({ path: './.env.test' });
const { _BaseDir } = process.env;
const { Core } = require(`${_BaseDir}/Core.js`);
const Config = require( _BaseDir + '/setting/Config');

module.exports = async () => {
	// Set reusable classes, methods in test files globally
	await Core.start();
	global.app = Core.app;
	global.Config = Config;
	// We need to start server first before performe tests
};