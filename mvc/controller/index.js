'use strict'

const path = require('path');
const _rootPath = path.dirname(require.main.filename);
const Controller = require(_rootPath + '/class/Controller');

class Index extends Controller {
	
	static async index(req) {
		
		this.General.topMenuJSON(this.req);
		
		var output = await this.Load('View', 'header.html', {
			Title: 'NodeJS Framework in MVC Pattern',
			controllerUrlInDB: this.controllerUrlInDB,
			pageJS: ['login.js']
		});

		if(this.req.session.Login.isLogin) {
			output = {redirectTo: await this._getLandingPage()};
		}
		else
		{
			var Links = await this.oData.Send('GET', 'OtherLinkSet()','', function(r){
				return r;
			});

			output += await this.Load('View', 'login.html', {
				Data: {
					Links: Links
				}
			});

			output += await this.Load('View', 'footer.html');

		}

		

		return output;
		
	}

	static async auth(data) {
		var output = {
			ack: false,
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
	static async _getLandingPage() {
		var landingPage = [];
		if(this.req.session.Login.role_id > -1) {
			const User_Model = await this.Load('Model', 'user.js');
			landingPage = await User_Model.getLandingPage(this.req.session.Login.role_id);
		}
		return (landingPage.length > 0 ? landingPage[0]['page_url'] : '/');
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