const path = require('path');
const _rootPath = path.dirname(require.main.filename);
const Base = require(_rootPath + '/class/Base');
class Controller extends Base {

	static {
		
	}

	static async generalPage(Page) {
		var HTML = await this.Load('View', 'header.html', {
			Title: 'Page not found | Halo | Hyundai Advanced Login Operations',
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