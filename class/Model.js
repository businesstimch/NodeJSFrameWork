require('dotenv').config()
const { _BaseDir } = process.env;
const Base = require(_BaseDir + '/class/Base');
class Model extends Base {}
module.exports = Model;