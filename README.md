# NodeJSFrameWork
NodeJS Web Framework in MVC pattern

This framework has been used in various large-scale projects in global companies.

To run this framework properly you will need,
1. Redis Server
2. MySQL/MariaDB Server
3. Config accordingly
  - /.env
  - /.env.test
  - /setting/Config.js
  - /setting/db.local.json
  - /setting/db.development.json
  - /setting/db.production.json

For unit testing, Jest is being used.
For argument validation to controllers, Joi is being used.

[Folder Structure]
/assets: Static assets can be accssed publicly
/class: Contains re-usable core classes
/mvc: Contains Model, View, and Controller
  /controller: Folder name equally matches with URL. 'index' class static method will be considered as '/' url
  /model: Contains models
  /view: Contains views
/setting: Contains reusuable global settings
