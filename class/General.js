const path = require('path');
const md5 = require("md5"); 
const _BaseDir = path.dirname(require.main.filename);
const moment = require('moment');
const Config = require( _BaseDir + '/setting/Config');

class General {

	static escape(URL) {
		return encodeURIComponent(String(URL).replace(/\'/g,"''").replace(" ","%20"));
		// return encodeURIComponent(String(URL).replace(/\'/g,"''"));
	}
	static errorMsg(id) {
		var _msgs = {
			"general": "Unkown error occurred, please try again."
		};
		return (typeof _msgs[id] !== "undefined" ? _msgs[id] : "");
	}
	static getSelectValue(textFieldName, valueFieldName, data) {
		var output = [];
		for(var i=0;data.length > i;i++) {
			output.push({
				Text: data[i][textFieldName],
				Value: data[i][valueFieldName]
			});
		}
		return output;
	}
	static isDate(_value, isUSFormat = false) {
		var _isDate = true;
		
		if(isUSFormat && !_value.match(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/)) _isDate = false;
		else if(!isUSFormat && !_value.match(/[0-9]{4}\-[0-9]{2}\-[0-9]{2}/)) _isDate = false;
		return _isDate;
	}
	static isDateTime = (_value) => _value.match(/[0-9]{4}\-[0-9]{2}\-[0-9]{2} [0-9]{2}\:[0-9]{2}\:[0-9]{2}/);
	static parseData(args) {
		var output = [];
		if(typeof args.data !== "undefined") {
			var data = JSON.parse(args.data);
			for (var key in data) {
				let _value = {};
				if (data.hasOwnProperty(key)) {
					for (var key2 in data[key]) {
						if (data[key].hasOwnProperty(key2)) _value[key2] = decodeURIComponent(data[key][key2]);
					}
					output.push(_value);
				}
			}
		}
		
		return output;
	}
	static isNumericArray(arr) {
		if(!Array.isArray(arr)) return false;
		else {
			for(var i=0;arr.length > i;i++) {
				if(!this.isNumeric(arr[i])) return false;
			}
		}
		return true;
	}
	static isTime = (n) => n.match(/[0-9]{2}\:[0-9]{2}\:[0-9]{2}/) || n.match(/[0-9]{2}\:[0-9]{2}/);
	static isNumeric = (n, from = null, to = null) => (!isNaN(parseFloat(n)) && isFinite(n));

	static isJson(item) {
		item = typeof item !== "string" ? JSON.stringify(item) : item;

		try {
			item = JSON.parse(item);
		} catch (e) {
			return false;
		}

		if (typeof item === "object" && item !== null) {
			return true;
		}
		return false;
	}
	static isNull(meh) {
		if(meh == null || meh == undefined || meh == NaN || meh == "" || meh.length == 0) {
			return true;
		}
		else {
			return false;
		}
	}
	
	static getPerformance(func,args) {
		var arrayConstructor = [].constructor;
		const start = performance.now();
		if(args == null) {
			func();
		}
		//pass array of arguments to a function
		//example [a,{b:b},"c",1,[d]] => function(a,{b:b},"c",1,[d])
		if(args.constructor == arrayConstructor) {
			func(...args);
		}
		else {
			func(args);
		}
		const end = performance.now();
		const total = start - end;
		console.log("Function takes " + total + " miliseconds");
	}

	static sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	static topMenuJSON(req) {
		for(let i in Config.TopMenu)
		{
			var hasActiveSub = false;
			Config.TopMenu[i].isCurrent = (Config.TopMenu[i].URL == req.path ? true : false);

			if(typeof Config.TopMenu[i].Submenu !== 'undefined')
			{
				for(let j in Config.TopMenu[i].Submenu)
				{
					Config.TopMenu[i].Submenu[j].isCurrent = (req.path == Config.TopMenu[i].Submenu[j].URL ? true : false);
				}
			}

			if(hasActiveSub)
				Config.TopMenu[i].isCurrent = true;
		}
		
	}
	// this.escapeExcelColumn = function(Value) {
	// 	Value = String(Value);
	// 	Value = Value.replace(/"/g,'""');

	// 	return '"=""' + Value.replace(/\,/g,'\,') + '"""';
	// }

	static escapeExcelColumn(Value) {
		Value = String(Value);
		if(Value.match(/\,/))
			Value = '"' + Value.replace(/"/g,'""') + '"';

		return Value.replace(/\,/g,'\,');
	}

	static encryptPassword = function(Password) {
		return md5(md5(Password) + md5(Config.PasswordSalt));
	}

	static getTotalDatesBetween2Dates(StartDate, EndDate) {
		var dateArray = [];
		var currentDate = moment(StartDate,"YYYY-MM-DD");
		var EndDate = moment(EndDate,"YYYY-MM-DD");
		
		while (currentDate <= EndDate) {
				dateArray.push( moment(currentDate).format('YYYY-MM-DD') )
				currentDate = moment(currentDate).add(1, 'days');
		}
		return dateArray;
	}
}

module.exports = General;