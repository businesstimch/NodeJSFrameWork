'use strict'

const path = require('path');
const _rootPath = path.dirname(require.main.filename);
const Model = require(_rootPath + '/class/Model');

module.exports = class PageModel extends Model {	
	static async getAllPages() {
		return await this.MySQL.QRY(`
			SELECT
				*,
				(
					SELECT GROUP_CONCAT(PP.role_id) FROM page_permission PP WHERE P.page_id = PP.page_id
				) AS role_id
			FROM
				category C,
				page P
			WHERE
				C.category_id = P.category_id
			ORDER BY
				C.sort, P.sort ASC
		`);
	}

}
