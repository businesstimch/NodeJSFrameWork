require('dotenv').config()
const { _BaseDir } = process.env;
const mysql = require('mysql2/promise');
const moment = require('moment');
const Config = require( _BaseDir + '/setting/Config');
const Error = require( _BaseDir + '/class/Error');

class MySQL {
	static convertSQLFriendlyDate(txt) {
		if((/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/).test(txt)) txt = moment(txt, 'MM/DD/YYYY').format('YYYY-MM-DD');
		return txt;
	}
	static async QRY(SQL, params = [], displayPlainSQL = false, Callback = async function() {} ) {
		var Result = await Error.EncapAsync( async () => {
			const con = await mysql.createConnection(Config.DB_Connection_Config.MySQL);
			var _plain_query = await con.format(SQL.replace(/\t/g,'').replace(/\n/g,' '),params);

			if(displayPlainSQL) console.log(_plain_query);
			const [Result] = await con.execute(_plain_query);
			
			if(typeof Callback === "function") await Callback();
			await con.end();

			return Result;
		});
		return Result;
	}
}

module.exports = MySQL;