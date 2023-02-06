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
