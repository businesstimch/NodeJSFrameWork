'use strict'

const path = require('path');
const _rootPath = path.dirname(require.main.filename);
const Controller = require(_rootPath + '/class/Controller');
const Configure_Model = require(_rootPath + '/mvc/model/configure');

module.exports = class General extends Controller {
	static async index(data) {
		var output = await this.Load('View', 'header.html', {
			Title: 'KALO | KIA Advanced Login Operations',
			controllerUrlInDB: this.controllerUrlInDB,
			pageJS: ['configure/general.js'],
			// buttons: [
			// 	await this.Load('View', '/button/update.html')
			// ]
		});

		output += await this.Load('View', 'configure/index.html', {
			ShowLinks: true
		});

		output += await this.Load('View', 'footer.html');

		return output;

	} // end index

	static async list(data) {
		var output = {
			ack: true,
			redirect: '',
			data: await Configure_Model.getConfig(),
			html: '',
			error_msg: '',
		}

		return output;
	}

	static async update(req) {
		var output = {
			reload: true,
			... await this._validate('update', req)
		}
		if (output.ack) {
			var data = req.data;
			for (let i in data) {
				await Configure_Model.updateConfig([
					data[i].value,
					data[i].code
				]);
			}
		}

		return output;
	}

	static async _validate(fn, req) {
		var output = {
			ack: true,
			error_msg: ''
		};

		if (typeof req.data !== "undefined") {
			var data = req.data;
			if (fn == "update") {
				if (!Array.isArray(data)) {
					output.ack = false;
					output.reload = false;
				} else {
					for (let i in data) {

						if (typeof data[i].code === "undefined" ||
							typeof data[i].value === "undefined" ||
							typeof data[i].code == "") {
								output.ack = false;
								output.reload = false;
								break;
							} else {
								if (data[i].code == "minimum_password_length") {
									if (Number.isInteger(parseInt(data[i].value))) {
										if (data[i].value > 25 || data[i].value < 6) {
											output.ack = false;
											output.reload = false;
											output.error_msg = "Minimum Password Length should set to 6~25 letters";
											break;
										}
									} else {
										output.ack = false;
										output.reload = false;
										output.error_msg = "Minimum Password Length should be in interger"
										break;
									}
								} else if (data[i].code == "login_session_timeout") {
									if (!Number.isInteger(parseInt(data[i].value))) {
										output.ack = false;
										output.reload = false;
										output.error_msg = "Login seesion timeout should be in interger"
										break;
									}
								}
							}

					} //end for
				} // end if !Array.isArray(data)
			} // end if (fn == "update")
		} // end if (typeof req.data !== "undefined")

		if(!output.ack && output.error_msg == '') output.error_msg = this.General.errorMsg("general");
		return output;
	}


} // end module.exports