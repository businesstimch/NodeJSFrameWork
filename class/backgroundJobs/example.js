/** 
 * [Background Task Class]
 * !! Must have !!
 * - timeInterval variable (in seconds)
 * - taskName variable
 * - Start() method
 * 
 * Note: Make sure to register this class in class/backgroundJobs.js
**/

module.exports = BackgroundJOB_GenerateAllLineJson = new function() {
	this.taskCode = "backgroundTaskCode" // String and Dash only (No space or special chars)
	this.taskName = "Name your background task here" // Name whatever you want. It will be displayed in console.log section
	this.timeInterval = () => 3; // In seconds (NOT milliseconds)

	/** If you want to get timeInterval from database. You can also make a async function.
	 * For example: this.timeInterval = async () => this.getTimeIntervalFromDatabase();
	**/
	
	// Specify your task here
	this.Start = async function() {
		console.log('This is the example of background task');
	};
	
};