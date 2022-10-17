const path = require('path');
const _rootPath = path.dirname(require.main.filename);
const Base = require(_rootPath + '/class/Base');
class Model extends Base {}
module.exports = Model;