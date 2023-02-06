require('dotenv').config()
const { _BaseDir } = process.env;
const Config = require( _BaseDir + '/setting/Config');

const axios = require('axios');
class oData {
	static oDataURL = Config.oDataURL;
	static async Send(Method = 'GET', URL = oDataURL, Data = {}, Callback = function() {}, AdditionalData = {}, timeout = 0 ) {
		
		var axiosConfig = {
			method: Method,
			url: this.oDataURL + URL,
			data: Data,
			timeout: timeout
		};
		if(Method.toUpperCase() == 'GET')
		{
			axiosConfig.url = axiosConfig.url + (URL.match(/\?/) ? '' : '?') + '&$format=json';
			if(typeof AdditionalData.PerPage !== 'undefined' && typeof AdditionalData.CurrentPage !== 'undefined')
			{
				axiosConfig.url += '&$top=' + AdditionalData.PerPage + '&$skip=' + (AdditionalData.CurrentPage == 1 ? 0 : AdditionalData.PerPage * (AdditionalData.CurrentPage - 1));
				
			}
		}
		else
			axiosConfig.headers = { 'x-requested-with': 'X'};
		// console.log(axiosConfig.url);
		return axios(axiosConfig).then(function (r){
			var Output = {};

			if(Method.toUpperCase() == 'GET')
				if(typeof r.data.d.results !== 'undefined')
				{
					Output = r.data.d.results;
				}
				else{
					Output = r.data.d;
				}
					
			return Callback(Output);
			
		}).catch(function(err){
			// console.log(err)
			// console.log('[SAP or Network Error] Method : ' + Method + ', URL : ' + URL);
			return Callback(err);
		});
		
		
	}
}

module.exports = oData;