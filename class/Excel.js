'use strict'
const path = require('path');
const _BaseDir = path.dirname(require.main.filename);
const { promisify } = require("util");

var fs = require('fs');
const writeFile = promisify(fs.writeFile);
const ExcelJS = require('exceljs');

module.exports = class Excel {
	static async importExcel(FileTo) {
		var workbook = new ExcelJS.Workbook();
		var jsonData = {};
		await workbook.xlsx.readFile(FileTo)
			.then(function() {
				var worksheet = workbook.worksheets[0];
				worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
					jsonData[rowNumber] = [];
					row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
						jsonData[rowNumber].push(cell.value);
					});
				});
			});
		return jsonData;
	}
	static async generateExcel(Config) {
		var Output = {
			ack: true,
			headersSent: true
		};
		var _self = this;
		var defaultConfig = {
			state: 'frozen',
			ySplit: 1,
			xSplit: 0,
			header: [],
			body: []
		};
		Config = {
			...defaultConfig,
			...Config
		};
		var workbook = new ExcelJS.Workbook();
		workbook.creator = 'KIA KALO';
		workbook.lastModifiedBy = 'KIA';
		workbook.created = new Date();
		workbook.modified = new Date();
		workbook.lastPrinted = new Date();
		workbook.properties.date1904 = true;
		workbook.views = [{
			x: 0,
			y: 0,
			width: 10,
			height: 20000,
			firstSheet: 0,
			activeTab: 1,
			visibility: 'visible'
		}];
		
		// create a sheet with the first row and column frozen
		var worksheet = workbook.addWorksheet('My Sheet', {views:[{state:'frozen', xSplit: 0, ySplit:1}]});
		
		worksheet.columns = Config.header;

		// worksheet.addRow({id: 1, name: 'John Doe!!', ddd: '02-8'});
		// worksheet.addRow({id: 2, name: 'Jane Doe', ddd: new Date(1965,1,7)});
		// worksheet.addRow([3, 'Sam', 'dqw']);
		
		
		worksheet.addRows(Config.body);

		var Row = worksheet.getRow(1);
		worksheet.getRow(1).font = {
			color: {argb: '3366cc'},
			bold: true
		}
		Row.eachCell({ includeEmpty: true }, function(Cell_F, colNumber) {
			if(colNumber > 0)
			{
				worksheet.getColumn(colNumber).numFmt = '0';
				worksheet.getColumn(colNumber).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
			}
		});

		var borderStyles = {
			top: { style: "thin" },
			left: { style: "thin" },
			bottom: { style: "thin" },
			right: { style: "thin" }
		};
		worksheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
			row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
				cell.border = borderStyles;
			});
		});

		var savePath = _BaseDir + '/assets/download/' + Config.exportFileName;
		await workbook.xlsx.writeFile(savePath);
		
		// window.open(savePath, '_self');
		Config.res.download(savePath);
		Config.res.on('finish', function() {
			fs.unlinkSync(savePath);
		});
	

		return Output;
	}

	static async uploadFile(Post) {
		var Output = {
			ack: true
		};
		if(typeof Post.Type !== 'undefined')
		{
			if(typeof this.req.file !== 'undefined' && typeof this.req.file.filename !== 'undefined')
			{
				Output.ack = true;
				Output.FileCode = this.req.file.filename;
			}
			
		}
		return Output;
	}
	
	static async generateFileAndDownload(FileName, Data) {
		var _self = this;
		var Output = {
			ack: false
		};

		var savedFilePath = '/temp/' + FileName;

		await writeFile(savedFilePath, Data).then(() => {
			Output.ack = true;
			Output.headersSent = true;
			_self.res.download(savedFilePath);
		});

		this.res.on('finish', function() {
			fs.unlinkSync(savedFilePath);
		});

		return Output;
	}
}