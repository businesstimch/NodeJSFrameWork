require('dotenv').config()
const { _BaseDir } = process.env;

class Error {
	static Encap = (fn, customLogMsg) => {
		try {
			fn();
		} catch (error) {
			console.log(error)
		}
	}

	static EncapAsync = async (fn, customLogMsg) => {
		try {
			return await fn();
		} catch (error) {
			console.log(error)
		}
	}
}

module.exports = Error;