'use strict'

const path = require('path');
const _rootPath = path.dirname(require.main.filename);
const Model = require(_rootPath + '/class/Model');

class UserModel extends Model {
	
	static async getUserByPassword(id, ps) {
		return await this.MySQL.QRY(`
			SELECT
				*
			FROM
				teammember
			WHERE
				login_id = ? AND
				password = ? AND
				active = 1 AND
				has_login_access = 1
			LIMIT
				1
		`, [id, ps]);
	}

	static async getLandingPage(role_id) {
		return await this.MySQL.QRY(`
			SELECT
				P.page_url
			FROM
				page_permission PP
					LEFT JOIN
						page P
					ON
						PP.page_id = P.page_id
			WHERE
				PP.role_id = ?
			ORDER BY
				P.sort ASC
			LIMIT
				1
		`, [role_id]);
	}

}

module.exports = UserModel;