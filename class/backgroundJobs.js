const os = require('os');
require('dotenv').config()
const { _BaseDir } = process.env;
const moment = require('moment');
const Config = require( _BaseDir + '/setting/Config');
const GenerateAllLineJson = require( _BaseDir + '/class/backgroundJobs/GenerateAllLineJson');
const GenerateOverview = require( _BaseDir + '/class/backgroundJobs/GenerateOverview');
const timeNow = () => moment().format('HH:mm A')
class BackgroundJobs {
	static backgroundTaskName = `[ ${Config.serviceName} Background Task ]`;
	static taskContainer = {};
	static backgroundJobs = [
		GenerateAllLineJson,
		GenerateOverview
	]

	static backgroundJobsProductionOnly = [
		
	]
	static initContainer = () => {
		return {
			initialInterval: 0,
			intervalContainer: null
		}
	}

	static runBackgroundJodById = async (bgTaskId) => {

		var bgExecuted_msg = `║ [${BackgroundJobs.backgroundJobs[bgTaskId].taskName}] background task executed: `;
		// We will execute the Start function at the beginning because setInternal will not execute until the time is over
		BackgroundJobs.backgroundJobs[bgTaskId].Start();
		console.log(bgExecuted_msg + timeNow());

		// Create a task container will store individual background job information.
		// We will need this container to control the task with setInterval, clearInterval functions
		BackgroundJobs.taskContainer[BackgroundJobs.backgroundJobs[bgTaskId].taskCode] = BackgroundJobs.initContainer();

		// Lets display which background task is running with basic time interval information
		console.log(`║ [${BackgroundJobs.backgroundJobs[bgTaskId].taskName}] background task started: Executes every ${await BackgroundJobs.backgroundJobs[bgTaskId].timeInterval()} seconds`)

		// We need to get the intial time interval from the individual background task class.
		// The value can be either hard coded or from database
		BackgroundJobs.taskContainer[BackgroundJobs.backgroundJobs[bgTaskId].taskCode].initialInterval = await BackgroundJobs.backgroundJobs[bgTaskId].timeInterval();

		// Start background task by registering it in setInterval function
		BackgroundJobs.taskContainer[BackgroundJobs.backgroundJobs[bgTaskId].taskCode].intervalContainer = setInterval(async () => {
			BackgroundJobs.backgroundJobs[bgTaskId].Start();
			console.log(bgExecuted_msg + timeNow());
			var newInterval = await BackgroundJobs.backgroundJobs[bgTaskId].timeInterval();
			
			// Whenever timeInverval value is changed from database, it will execute clearInterval and re-register the task with new time interval value
			if(BackgroundJobs.taskContainer[BackgroundJobs.backgroundJobs[bgTaskId].taskCode].initialInterval != newInterval)
			{
				console.log(`║ [${BackgroundJobs.backgroundJobs[bgTaskId].taskName}] Time interval value is changed in setting or database. Now we will re-start background job`);
				clearInterval(BackgroundJobs.taskContainer[BackgroundJobs.backgroundJobs[bgTaskId].taskCode].intervalContainer);
				BackgroundJobs.Start(bgTaskId);
			}
			
		}, BackgroundJobs.taskContainer[BackgroundJobs.backgroundJobs[bgTaskId].taskCode].initialInterval * 1000);
	}

	static async Start (runSpecificTaskId = undefined) {
		if(typeof runSpecificTaskId !== "undefined") BackgroundJobs.runBackgroundJodById(runSpecificTaskId)
		else {
			for(var i=0; BackgroundJobs.backgroundJobs.length > i;i++) {
				// We use annomouse function to keep the 'i' value though the iteration process
				(async function(i) {
					BackgroundJobs.runBackgroundJodById(i)
				})(i);
			}
		}
		
		if(this.backgroundJobsProductionOnly.length > 0) {
			// To prevent running background task in development server (because it can actually mess up production server data)
			// If you know what youa're doing then you can change the setting in Config.js to point to your computer name
			if(Config.HostNameForBackgroundTask == os.hostname()) {
				// List all background jobs below
				for(var i=0; this.backgroundJobsProductionOnly.length > i;i++) {
					this.backgroundJobs[i].Start();
				}

			} else console.log(`${BackgroundJobs.backgroundTaskName} Because your hostname(${os.hostname()}) is not matched with 'HostNameForBackgroundTask' setting, background task will not be running.`)
		}
	}
}

module.exports = BackgroundJobs;