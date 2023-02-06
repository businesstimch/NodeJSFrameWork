'use strict'
require('dotenv').config()
const Joi = require('joi');
const { _BaseDir } = process.env;
const Controller = require(_BaseDir + '/class/Controller');
const HelloWorldModel = require(_BaseDir + '/class/model/helloworld_model');

class Index extends Controller {

	// We use Joi schema validation.
	static _schema = {
		index: Joi.object({}), // Add any schema validation rules here
		auth: Joi.object({
			id: Joi.string().required(),
			ps: Joi.string().required(),
		})
	}
	
	// Index means '/' url
	static async index(req) {
		let { error } = this._schema['index'].validate(req, { abortEarly: false });
		let output = {
			ack: false,
			error_msg: typeof error !== "undefined" ? error : '',
		}

		// If there's no error then display the page.
		if(typeof error === "undefined") {
			this.General.topMenuJSON(this.req);
			
			output = await this.Load('View', 'header.html', {
				Title: 'GGoRok | NodeJS Framework',
				controllerUrlInDB: this.controllerUrlInDB,
				pageJS: ['hello-world.js'] // Add Javascript file that you want to embed in the header html section.
			}) + await this.Load('View', 'hello-world.html', {
				helloWorld: await HelloWorldModel.helloWorldSQL()
			}) + await this.Load('View', 'footer.html');
		}
		return output;
	}

	static async auth(data) {
		let { error } = this._schema['auth'].validate(data, { abortEarly: false });
		let output = {
			ack: false,
			error_msg: typeof error !== "undefined" ? error : '',
		}

		if(typeof error === "undefined") {
			output = {
				ack: true,
				redirect: '',
				error_msg: '',
			};
			
			if(typeof data.id != 'undefined' && typeof data.ps != 'undefined') {
				var user = await this._getUserByPassword(data.id, data.ps);
				if(user.length == 1) {
					this._setLoginSession(user);
					output.redirect = await this._getLandingPage();
					output.ack = true;
				} else output.err_msg = 'ID and Password do not match.';
				
			} else output.err_msg = 'ID and Password is required.';
		}
		
		return output;
	}
	
	static _setLoginSession(user) {
		if(user.length == 1)
		{
			this.req.session.Login = {
				isLogin: true,
				role_id:  user[0]['role_id'],
				teammember_id: user[0]['teammember_id'],
				first_name: user[0]['first_name'],
				last_name: user[0]['last_name'],
			};
		}
	}
	
	static async _getUserByPassword(id, ps) {
		const User_Model = await this.Load('Model', 'user.js');
		return await User_Model.getUserByPassword(id, this.General.encryptPassword(ps));
	}

	static async logout() {
		this.req.session.destroy(this.req.sessionID);
		this.res.redirect(307, '/');
		return {
			headersSent: true
		}
	}

}

module.exports = Index;