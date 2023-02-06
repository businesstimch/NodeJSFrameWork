require('dotenv').config()
const fs = require('fs');
const util = require('util');
const ejs = require('ejs')
const { _BaseDir } = process.env;
const readFile = util.promisify(fs.readFile);

class Base {

	static General = require(_BaseDir + '/class/General');
	static oData = require(_BaseDir + '/class/oData');
	static Config = require( _BaseDir + '/setting/Config');
	static MySQL = require(_BaseDir + '/class/MySQL');
	static Filter = require(_BaseDir + '/class/Filter');
	static Excel = require(_BaseDir + '/class/Excel');	
	
	static {
		this.Config._BaseDir = _BaseDir;
	}

	static async Load(Type, Path, Data) {
		var Output = '';
		var FileToLoad;
		Data = {
			'req': this.req,
			'res': this.res,
			'General': this.General,
			'Config': this.Config,
			'MySQL': this.MySQL,
			'Filter': this.Filter,
			'Excel': this.Excel,
			...Data
		};
		if(Type == 'Model' || Type == 'View' || Type == 'Controller') {
			FileToLoad = `${_BaseDir}/mvc/${Type.toLowerCase()}/${Path}`;
			if(Type == 'View') {
				Output = await readFile(FileToLoad, 'utf-8');
				Output = ejs.render(Output, Data).replace(/(\r\n|\n|\r|\t)/gm, "");
			} else {
				Output = require(FileToLoad);
			}
		}
		return Output;
	}

}


module.exports = Base;