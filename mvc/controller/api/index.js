'use strict'
const path = require('path');
const _BaseDir = path.dirname(require.main.filename);
const Controller = require(_BaseDir + '/class/Controller');
const TMInfo_Model = require(_BaseDir + '/mvc/model/teammember/info');

class Index extends Controller {

	static async sampleAPI(req) {
		var output = await this._validate("getBadgeInfo", req);


		// API URL: https://kalo.kiageorgia.com/api/badgeSwipe
		// Method: POST

		// [JSON Request Example]
		// {
		// 	"apiToken": "#######################"
		// 	"badge": "000000000000",
		// 	"station": "T1-01L",
		// 	"reqType": 1
		// }

		// [Explanation]
		// - reqType
		// 	- 0: Sign-out
		// 	- 1: Sign-in
		// 	- 2: Read info only (will not leave a log)

		if(output.ack) {

			// We already know that this badge is exsting badge. Thus we do not need to validate. Just use it!
			var TMInfo = await TMInfo_Model.getTmDetailInfoByBadgeId(req.badge_number);
			var notification = [];
			if(TMInfo[0].is_birthday == 1) notification.push({1:null});
			if(TMInfo[0].is_anniversary == 1) notification.push({2:null});
			if(TMInfo[0].is_teammember_wear_ready == 1) notification.push({3: "Your team wear order is ready to pick up at team member center."});
			
			output = {
				ack: true,
				first_name: TMInfo[0]['first_name'],
				middle_name: TMInfo[0]['middle_name'],
				last_name: TMInfo[0]['last_name'],
				notification: notification,
				rotation_plan: [
					"A:T1-01L",
					"A:T2-02L",
					"A:T2-05R",
					"A:T4-03R"
				],
				...this._getDummy(req.badge_number)
			};

		}

		return output;
	}

	
	static async _validate(fn, req) {
		var output = {
			ack: true,
			error_msg: ''
		};

		if(fn == "getSampleLogin") {

			// Check general validation
			if(typeof req.APIToken === "undefined" || req.APIToken != this.Config.KAPSApiToken) {
				output.ack = false;
				output.error_msg = "API Token is not matched.";
			} else if(typeof req.badge_number === "undefined" || req.badge_number == "") {
				output.ack = false;
				output.error_msg = "Badge ID is required or is wrong format";
			}

			if(output.ack) {

				// Find team member in the system with the badge ID
				
				var tm = await TMInfo_Model.findTmByBadgeId(req.badge_number);
				if(tm[0]['total'] == 0) {
					output.ack = false;
					output.error_msg = "Team member not found.";
				}
			}
			
		}

		return output;
	}
}

module.exports = Index;