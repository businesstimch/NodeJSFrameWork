'use strict'

const path = require('path');
const _rootPath = path.dirname(require.main.filename);
const Model = require(_rootPath + '/class/Model');

module.exports = class PermissionModel extends Model {
	static async getPermission() {
		await this.MySQL.QRY(`
			SELECT
				page_id,
				role_id
			FROM
				page_permission
		`);
	}
	static async grantPermission(args) {
		await this.MySQL.QRY(`
			INSERT IGNORE INTO
				page_permission (
					page_id,
					role_id
				)
				VALUES (
					?,?
				)
		`, args);
	}
	static async revokePermission(args) {
		await this.MySQL.QRY(`
			DELETE FROM
				page_permission
			WHERE
				page_id = ? AND
				role_id = ?
		`, args);
	}
}