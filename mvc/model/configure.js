'use strict'

const path = require('path');
const _rootPath = path.dirname(require.main.filename);
const Model = require(_rootPath + '/class/Model');

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
	`, args, true);
	}
}