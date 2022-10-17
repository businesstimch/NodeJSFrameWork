const path = require('path');
const _BaseDir = path.dirname(require.main.filename);
const fs = require('fs');
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const Controller = require(_BaseDir + '/class/Controller');
const General = require(_BaseDir + '/class/General');
const multer  = require('multer');
const cookieParser = require('cookie-parser')
const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);
const Config = require( _BaseDir + '/setting/Config');
const mvcPath = "./mvc/controller";
Config._BaseDir = _BaseDir;

class Core {
	
	static {
		// Start Background Job
		require(_BaseDir + '/class/backgroundJobs');
		this.#start();
	};
	
	static async #start() {
		await this.#initLoginSessionManager();
		app.use(express.static('assets'));
		app.use(cookieParser());
		app.use(bodyParser.json({limit: '50mb'}));
		app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
	
		var storage = multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, _BaseDir + '/assets/upload')
			},
			filename: function (req, file, cb) {
				cb(null, file.originalname)
			}
		})
	
		var upload = multer({ storage: storage });
	
		app.post('/api/uploadFile', upload.single('File') ,async function (req, res) {
			console.log('Uploading');
			return await Core.parseURL(req, res, 'From Post');
		});
	
		app.all('*', async function (req, res) {
			return await Core.parseURL(req, res, 'From All');
		});
		Config.initSetting();
		app.listen(Config.Port, () => console.log(`╦══════════════════════════ [ The Service Started ] ${Config.serviceName} is running on port ${Config.Port}! ══════════════════════════╦`));
	}


	static async #initLoginSessionManager() {
		const { createClient } = require("redis")
		
		var RedisClient = createClient(await Config.DB_Connection_Config.Redis);
		await RedisClient.connect().catch(console.error)

		app.use(expressSession({
			store: new RedisStore({client : RedisClient}),
			cookie: {
				maxAge: (60000 * 30)
			},
			name: '.JTzP6ObRsvZgMjPzny1TZwwc%2BGSU7NBqu1clJVdAc2Y',
			saveUninitialized: true,
			secret: Config.SesstionSalt,
			resave: false,
			rolling: true
		}));

		RedisClient.on('error', (err) => {
			console.log('Error on the redis server. Please start or re-start your redis server.');
			console.log(err);
			RedisClient.connect();
		}); // Will keep polling until it connects to Redis
		
	}

	static #isPrivateMethod = (methodName) => (/^_/).test(methodName);
	static async parseURL (req, res) {
		
		var isMethodCall = false;
		var _Controller = {
			controllerUrlInDB: req.path,
			path: mvcPath + req.path.replace(/[a-zA-Z-_0-9]+$/gi,''),
			methodToCall: req.path.match(/[a-zA-Z-_0-9]+$/) == null ? 'index' : req.path.match(/[a-zA-Z-_0-9]+$/),
			doesControllerExist: false,
			class: new class {},
			output: {}
		};
		
		
		// Login session management
		if(typeof req.session === 'undefined') req.session = {};
		if(typeof req.session.Login === 'undefined') {
			req.session.Login = {
				isLogin: false,
				loginID: '',
				role_id: -1
			};
		}
		// Priority: File > Index.js in Folder.
		// For example, url: /a/
		// - Will try to find a.js in root folder first. 
		// - If the file does not exist, then it will try to find index.js file in the folder 'a'
		if(fs.existsSync(_Controller['path'].replace(/\/$/,'') + '.js')) {
			_Controller['path'] = _Controller['path'].replace(/\/$/,'') + '.js';
		} else if(_Controller['path'].match(/\/$/)) {
			_Controller['path'] += 'index.js';
			isMethodCall = true;
		}
		
		if(isMethodCall) {
			_Controller['controllerUrlInDB'] = _Controller['controllerUrlInDB'].split("/");
			_Controller['controllerUrlInDB'].pop();
			_Controller['controllerUrlInDB'] = _Controller['controllerUrlInDB'].join('/') + '/';
		}

		// Check if controller file does exist
		_Controller['doesControllerExist'] = fs.existsSync(_Controller['path']);
		
		// Private method rule
		// - Any method name(in controller) starting with '_' (ex: _classMethodName) will not be accessible publicly.
		if(_Controller['doesControllerExist'] && !this.#isPrivateMethod(_Controller['methodToCall'])) {
			// Load controller file
			_Controller['class'] = require(_Controller['path']);
			_Controller['class'].req = req;
			_Controller['class'].res = res;
			_Controller['class'].app = app;
			_Controller['class'].Permission = [];
			_Controller['class'].need_access_permission = false;
			_Controller['class'].controllerUrlInDB = _Controller['controllerUrlInDB'];
			
			if(typeof Config.permission[_Controller['controllerUrlInDB']] !== 'undefined' && typeof Config.permission[_Controller['controllerUrlInDB']]['role_id'] !== 'undefined') {
				_Controller['class'].Permission = Config.permission[_Controller['controllerUrlInDB']]['role_id'];
				_Controller['class'].need_access_permission = true;
			}
			
			// Logged in & Controller has permission && If the user has same permission as in controller
			if(!_Controller['class'].need_access_permission || (_Controller['class'].need_access_permission && _Controller['class'].Permission.indexOf(req.session.Login.role_id) > -1)) {
				if(typeof _Controller['class'][_Controller['methodToCall']] == 'function') {
					var _data = {
						...req.body,
						...req.query
					};
					
					for (var key in _data) {
						if(_data.hasOwnProperty(key)) {
							if(General.isJson(_data[key])) _data[key] = JSON.parse(_data[key])
						}
					}

					_Controller['output'] = await _Controller['class'][_Controller['methodToCall']](_data);
					
					if(_Controller['output'].hasOwnProperty('redirectTo') && _Controller['output'].redirectTo != "") {
						res.redirect(307, _Controller['output'].redirectTo);
						return false;
					}
					
					if(typeof _Controller['output'] !== "undefined" && General.isJson(_Controller['output'])) {
						if(_Controller['output'].hasOwnProperty('headersSent') && _Controller['output'].headersSent) return false;
						else _Controller['output'] = JSON.stringify(_Controller['output']);
					} else _Controller['output'] = String(_Controller['output']);

					// /* Is this a regular HTML request */
					// if(typeof req.query.ajax === 'undefined') _Controller['output'] = String(await _Controller['class'][_Controller['methodToCall']]());
					// else { // Or an Ajax request? Then return JSON format data.
						
					// 	_Controller['output'] = await _Controller['class'][_Controller['methodToCall']](req.body);
					// 	_Controller['output'] = JSON.stringify(_Controller['output']);
					// }
				} else {
					res.status(404).send(await _Controller['class'].generalPage(404));
					return false
				}
				res.send( _Controller['output'] );
				
			} else if(!req.session.Login.isLogin && req.path != '/') {
				res.redirect('/');
				return false;
			} else {
				res.status(404).send(await _Controller['class'].generalPage('no-permission'));
				return false;
			}
		} else {
			Controller.req = req;
			Controller.res = res;
			Controller.app = app;
			Controller.Permission = [];
			Controller.need_access_permission = false;
			Controller.controllerUrlInDB = _Controller['controllerUrlInDB'];
			res.status(404).send(await Controller.generalPage(404));
			return false
		}
	};
	
}
module.exports = Core;
/*
	[Small codes library]
	req.protocol + '://' + req.get('host') + req.originalUrl;
	req.params
	req.url
	req.path

	/ : index
	/dd : index => dd
	/dd/ : dd => index or
	/dd/ : /dd/index

	(req.path.match('/\//') || []).length

	const Halo = new Proxy({},
	{
		get(target, propKey) {
			
			return function() {
			}
			console.log(propKey);
		}
	})

	res.json()
	res.download()
	res.redirect()
	res.render()
	res.sendFile()
	res.sendStatus()
	res.sendStatus(404)
*/