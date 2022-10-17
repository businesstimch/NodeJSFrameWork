module.exports = {
	apps : [{
		name: 'KALO',
		script: 'index.js',
		instances: 1,
		detached: true,
		watch: true,
		ignore_watch : [
			"temp",
			"assets/upload",
			"assets/download",
			"setting/auto_generated",
			".git"
		],
		exec_mode  : "fork",
		env: {
			NODE_ENV: 'local'
		},
		env_develoment: {
			NODE_ENV: 'development'
		},
		env_production: {
			NODE_ENV: 'production'
		}
	}]
}
