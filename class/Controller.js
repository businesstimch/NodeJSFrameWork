require('dotenv').config()
const { _BaseDir } = process.env;
const Base = require(_BaseDir + '/class/Base');
class Controller extends Base {

	static {
		
	}

	static async generalPage(Page) {
		var HTML = await this.Load('View', 'header.html', {
			Title: 'Page not found',
			isLogin: false,
			controllerUrlInDB: this.controllerUrlInDB
		});

		switch(Page) {
			case 404:
				HTML += await this.Load('View', '404.html', {});
			break;

			case 'no-permission':
				HTML += await this.Load('View', 'no-permission.html', {});
			break;
			default: {
				
			}
		}

		HTML += await this.Load('View', 'footer.html', {});
		return HTML;

	}
}


module.exports = Controller;