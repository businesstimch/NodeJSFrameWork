const fs = require('fs');
const util = require('util');
const ejs = require('ejs')
const path = require('path');
const _rootPath = path.dirname(require.main.filename);

const readFile = util.promisify(fs.readFile);

class Base {

	static General = require(_rootPath + '/class/General');
	static oData = require(_rootPath + '/class/oData');
	static Config = require( _rootPath + '/setting/Config');
	static MySQL = require(_rootPath + '/class/MySQL');
	static Filter = require(_rootPath + '/class/Filter');
	static Excel = require(_rootPath + '/class/Excel');	
	
	static {
		this.Config._rootPath = _rootPath;
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
			FileToLoad = `${_rootPath}/mvc/${Type.toLowerCase()}/${Path}`;
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