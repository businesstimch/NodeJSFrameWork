'use strict'

require('dotenv').config()
const { _BaseDir } = process.env;
const Model = require(_BaseDir + '/class/Model');

module.exports = class ConfigureModel extends Model {
	static helloWorldSQL = async (args = ["hello", "world"]) => await this.MySQL.QRY(`SELECT CONCAT(?," ",?)`,args);
}