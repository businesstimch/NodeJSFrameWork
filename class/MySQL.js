const path = require('path');
const _rootPath = path.dirname(require.main.filename);
const mysql = require('mysql2/promise');
const moment = require('moment');
const Config = require( _rootPath + '/setting/Config');

class MySQL {
	static convertSQLFriendlyDate(txt) {
		if((/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/).test(txt)) txt = moment(txt, 'MM/DD/YYYY').format('YYYY-MM-DD');
		return txt;
	}
	static async QRY(SQL, params = [], displayPlainSQL = false, Callback = async function() {} ) {
		const con = await mysql.createConnection(Config.DB_Connection_Config.MySQL);
		var _plain_query = await con.format(SQL.replace(/\t/g,'').replace(/\n/g,' '),params);
		if(displayPlainSQL) console.log(_plain_query);
		const [Result] = await con.execute(_plain_query);
		
		
		if(typeof Callback === "function") await Callback();
		await con.end();
		return Result;
	}
}

module.exports = MySQL;