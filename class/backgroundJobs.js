const util = require('util');
const fs = require('fs');
const os = require('os');
const path = require('path');
const moment = require('moment');

const _BaseDir = path.dirname(require.main.filename);
const MySQL = require(_BaseDir + '/class/MySQL');
const oData = require(_BaseDir + '/class/oData');
const Config = require( _BaseDir + '/setting/Config');

class BackgroundJobs {
	static backgroundTaskName = `[ ${Config.serviceName} Background Task ]`;
	static {
		BackgroundJobs.Start();
	}
	
	static async Start () {
		// To prevent running background task in development server (because it can actually mess up production server data)
		// If you know what youa're doing then you can change the setting in Config.js to point to your computer name
		if(Config.HostNameForBackgroundTask == os.hostname()) BackgroundJobs.BackgroundJOB_GetStationInfoSetRefresh.Start();
		else console.log(`${BackgroundJobs.backgroundTaskName} Because your hostname(${os.hostname()}) is not matched with 'HostNameForBackgroundTask' setting, background task will not be running.`)
	}

	static BackgroundJOB_GetStationInfoSetRefresh = new function() {
	
		// Monitor value in database.
		var timeIntervalContainer;
		
		this.Start = async function() {
			// var InitialInterval = await getStationInfoSet_Interval();
			// refreshDBwithSapData();
			// startTimeInteravl(InitialInterval);
		};
		
		// var printStatus = function(InitialInterval) {
		// 	console.log(`${BackgroundJobs.backgroundTaskName} Started at ${InitialInterval / 1000} seconds: /class/backgroundJobs.js]`);
		// };
		
		// var startTimeInteravl = async function(InitialInterval) {

		// 	printStatus(InitialInterval);
		// 	timeIntervalContainer = setInterval(async function() {
		// 		var newInterval = await getStationInfoSet_Interval();
				
		// 		if(InitialInterval != newInterval)
		// 		{
		// 			console.log(`${BackgroundJobs.backgroundTaskName} Time interval value is changed in database. Now we will re-start background job`);
		// 			clearInterval(timeIntervalContainer);
		// 			startTimeInteravl(newInterval);
		// 		}
				
		// 		refreshDBwithSapData();
		// 	}, InitialInterval);
		// };
		
		// var refreshDBwithSapData = async function() {
		// 	var updateQRY;
		// 	console.log(`${BackgroundJobs.backgroundTaskName} refreshDBwithSapData() is executed]`);
		// 	var Data = await _self.requestDataFromSAP("ZTSHOP eq 'GA'");
			
		// 	var updatedOn = moment().format('YYYY-MM-DD HH:mm:ss');
		// 	var updateValues = _self.sqlValueFactory(Data, updatedOn);
		// 	updateQRY = _self.updateQRY.Prefix_UpdatedOn + updateValues.join(',') + _self.updateQRY.Suffix_UpdatedOn;

		// 	await _self.MySQL.QRY(updateQRY);
		// 	await _self.MySQL.QRY("DELETE FROM h_getstationinfoset WHERE updatedOn != '" + updatedOn + "'");

		// };
		

		// var getStationInfoSet_Interval = async function() {
		// 	var GetStationInfoSet_Interval = await _self.MySQL.QRY(`
		// 		SELECT
		// 			SettingValue
		// 		FROM
		// 			h_settings
		// 		WHERE
		// 			SettingID = 'GetStationInfoSet_Interval'
		// 	`);

		// 	return GetStationInfoSet_Interval[0].SettingValue;
		// };
		
		
	};
}
module.exports = BackgroundJobs;

// module.exports = function() {
	

// 	this.Config = _Config.getSetting({
// 		Env: "production"
// 	});

// 	this.MySQL = new MySQL(this.Config.DB_Connection_Config.MySQL);
// 	this.oData = new oData(this.Config.oDataURL);
// 	Start = async function() {
		
		

// 	}

// 	this.requestDataFromSAP = async function(API_Param = "") {
// 		var API = "GetStationInfoSet?$filter=" + API_Param;
// 		return await _self.oData.Send('GET', API, {}, function(r) {
// 			return r;
// 		});
// 	};

// 	this.sqlValueFactory = function(Data, updatedOn = "") {
// 		var _tempVar = {};
// 		var updateValues = [];
// 		for(var i in Data)
// 		{
// 			var _tempArrayKey = Data[i].ZTSHOP + '_' + Data[i].ZTGRPID + '_' + Data[i].ZTSTAT + '_' + Data[i].ZTSTINFO;

// 			if(typeof _tempVar[_tempArrayKey] === "undefined")
// 				_tempVar[_tempArrayKey] = [];

// 			_tempVar[_tempArrayKey].push(Data[i]);
			
// 		}

// 		var
// 			loginSlot,
// 			_tempVar2;

// 		for(var i in _tempVar)
// 		{
// 			loginSlot = 1;
// 			_tempVar2 = _tempVar[i];
			
			
// 			for(var i2 in _tempVar2)
// 			{
// 				updateValues.push(
// 					'(' +
// 						'"' + _tempVar2[i2].ZTGRPID + '",' +
// 						'"' + _tempVar2[i2].ZTSHOP + '",' +
// 						'"' + _tempVar2[i2].ZTSTAT + '",' +
// 						'"' + _tempVar2[i2].ZTSTINFO + '",' +
// 						'"' + loginSlot + '",' +
// 						'"' + _tempVar2[i2].ZTBADG + '",' +
// 						'"' + _tempVar2[i2].ZTCMVAL + '",' +
// 						'"' + _tempVar2[i2].ZTCOLOR + '",' +
// 						'"' + _tempVar2[i2].ZTFLAG + '",' +
// 						'"' + _tempVar2[i2].ZTLH + '",' +
// 						'"' + _tempVar2[i2].ZTRH + '",' +
// 						'"' + _tempVar2[i2].ZTLIDT + '",' +
// 						'"' + _tempVar2[i2].ZTLINE + '",' +
// 						'"' + _tempVar2[i2].ZTLIST + '",' +
// 						'"' + _tempVar2[i2].ZTLITM + '",' +
// 						'"' + _tempVar2[i2].ZTLODT + '",' +
// 						'"' + _tempVar2[i2].ZTLOST + '",' +
// 						'"' + _tempVar2[i2].ZTLOTM + '",' +
// 						'"' + _tempVar2[i2].ZTMNE + '",' +
// 						'"' + _tempVar2[i2].ZTMOLO + '",' +
// 						'"' + _tempVar2[i2].ZTSEQ_NO_LI + '",' +
// 						'"' + _tempVar2[i2].ZTSEQ_NO_LO + '",' +
// 						'"' + _tempVar2[i2].ZTSTLO + '",' +
// 						'"' + _tempVar2[i2].ZTSUB + '",' +
// 						'"' + _tempVar2[i2].ZTTEM + '",' +
// 						'"' + _tempVar2[i2].ERR_MSG + '",' +
// 						'"' + _tempVar2[i2].SUCCESS + '"' +
// 						(updatedOn != "" ? ',"' + updatedOn + '"' : "" ) +
// 					')'
// 				);
// 				loginSlot++;
// 			}
// 		}

// 		return updateValues;
// 	};

	

// 	// Update or insert when it doesn't exist
// 	this.updateQRY = {
// 		Prefix: (`
// 			INSERT INTO h_getstationinfoset (
// 				ZTGRPID,
// 				ZTSHOP,
// 				ZTSTAT,
// 				ZTSTINFO,
// 				loginSlot,
// 				ZTBADG,
// 				ZTCMVAL,
// 				ZTCOLOR,
// 				ZTFLAG,
// 				ZTLH,
// 				ZTRH,
// 				ZTLIDT,
// 				ZTLINE,
// 				ZTLIST,
// 				ZTLITM,
// 				ZTLODT,
// 				ZTLOST,
// 				ZTLOTM,
// 				ZTMNE,
// 				ZTMOLO,
// 				ZTSEQ_NO_LI,
// 				ZTSEQ_NO_LO,
// 				ZTSTLO,
// 				ZTSUB,
// 				ZTTEM,
// 				ERR_MSG,
// 				SUCCESS
// 		`).replace(/\t/g,'').replace(/\n/g,' '),
// 		Suffix: (`
// 			ON DUPLICATE KEY UPDATE 
// 			ZTGRPID = VALUES(ZTGRPID),
// 			ZTSHOP = VALUES(ZTSHOP),
// 			ZTSTAT = VALUES(ZTSTAT),
// 			ZTSTINFO = VALUES(ZTSTINFO),
// 			loginSlot = VALUES(loginSlot),
// 			ZTBADG = VALUES(ZTBADG),
// 			ZTCMVAL = VALUES(ZTCMVAL),
// 			ZTCOLOR = VALUES(ZTCOLOR),
// 			ZTFLAG = VALUES(ZTFLAG),
// 			ZTLH = VALUES(ZTLH),
// 			ZTRH = VALUES(ZTRH),
// 			ZTLIDT = VALUES(ZTLIDT),
// 			ZTLINE = VALUES(ZTLINE),
// 			ZTLIST = VALUES(ZTLIST),
// 			ZTLITM = VALUES(ZTLITM),
// 			ZTLODT = VALUES(ZTLODT),
// 			ZTLOST = VALUES(ZTLOST),
// 			ZTLOTM = VALUES(ZTLOTM),
// 			ZTMNE = VALUES(ZTMNE),
// 			ZTMOLO = VALUES(ZTMOLO),
// 			ZTSEQ_NO_LI = VALUES(ZTSEQ_NO_LI),
// 			ZTSEQ_NO_LO = VALUES(ZTSEQ_NO_LO),
// 			ZTSTLO = VALUES(ZTSTLO),
// 			ZTSUB = VALUES(ZTSUB),
// 			ZTTEM = VALUES(ZTTEM),
// 			ERR_MSG = VALUES(ERR_MSG),
// 			SUCCESS = VALUES(SUCCESS)
// 		`).replace(/\t/g,'').replace(/\n/g,' ')
// 	};
// 	this.updateQRY.Prefix_UpdatedOn = this.updateQRY.Prefix + ',updatedOn)	VALUES';
// 	this.updateQRY.Suffix_UpdatedOn = this.updateQRY.Suffix + ',updatedOn = VALUES(updatedOn)';
	
// };