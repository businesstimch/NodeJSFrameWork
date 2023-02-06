require('dotenv').config()
const { _BaseDir } = process.env;
const { Core } = require(`${_BaseDir}/Core`);
Core.start();
module.exports.Core = Core;