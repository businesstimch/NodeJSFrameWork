# NodeJSFrameWork
NodeJS Web Framework in MVC pattern
This framework has been used in various large-scale projects in global companies.

To run this framework properly you will need,
1. Redis Server running at 6379 port (You can change the port by modifying /setting/db.your_environment.json)
2. MySQL/MariaDB Server
3. Config
```
/.env
/.env.test
/setting/Config.js
/setting/db.local.json
/setting/db.development.json
/setting/db.production.json
```

For unit testing, Jest is being used.
For argument validation to controllers, Joi is being used.

**Folder Structure**

```
/assets: Static assets can be accssed publicly
/class: Contains re-usable core classes
/mvc: Contains Model, View, and Controller
/mvc/controller: Folder name equally matches with URL. 'index' class static method will be considered as '/' url
/mvc/model: Contains models
/mvc/view: Contains views  
/setting: Contains reusuable global settings
```

**How Start**

```
npm run dev
npm run start
npm run test
```

**How Controller Works**

To create new url, you will just need to create a new controller.
```
[URL Example]
/mvc/controller/index.js -> '/' in url
/mvc/controller/hello/index.js -> '/hello/' in url
/mvc/controller/hello/world.js -> '/hello/world/' in url
/mvc/controller/hello/world.js -> '/hello/world/add' in url. In this case, 'add' class method will be called.
```

**Controller Rule**

Any controller named with _(underscore) will not be accessible from url. 
For example, _iAmPrivateMethod method will be accessible through url even though the class methid is declared in a controller.
'/_iAmPrivateMethod' will generate 404 error.

```
static async _iAmPrivateMethod(req) {
  // I am private controller method. Can not be accessed from the outside of the world!
}

```

**/core.js**
```
This is the core part of this framework that all the magic things happend.
Please feel free to update in your convenience.
```

**Background Task**

NodeJS is a perfect language for automation process.
You can easily add a custom background job for you.
First of all, you will need to register your background task to the background manager.
```
File '/class/backgroundJobs.js;

// Import a file contains your custom background task here
const ExampleBackgroundJob = require( _BaseDir + '/class/backgroundJobs/example');

// Then register it into 
static backgroundJobs = [
		ExampleBackgroundJob
];
```

When ever you start or re-start your application this background job will be also started at the beginning!
Now you are ready to add your custom background task logic below.
You can add as many as background tasks you want. Just make sure register it in '/class/backgroundJobs.js'.
```
File '/class/backgroundJobs/example.js

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
```
