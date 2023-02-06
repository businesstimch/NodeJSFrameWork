'use strict'

require('dotenv').config()
const { _BaseDir } = process.env;
const Model = require(_BaseDir + '/class/Model');

module.exports = class ConfigureModel extends Model {
	static async getConfig() {
		return await this.MySQL.QRY(`
			SELECT
				*
			FROM
				setting
		`);
	}

	static async updateConfig(args) {
		await this.MySQL.QRY(`
		UPDATE
			setting
		SET
			value = ?
		WHERE
			code = ?
	`, args);
	}
}