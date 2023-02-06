const request = require('supertest');
/*
[ Testing base scenario ]
	- Send w/out required argument
	- Send required argument with wrong data type (ex. req Int but String)
	- Send required argument with wrong data value (ex. req 0,1 but received 2)
	- Permission test only for Index controller
	- SQL Injection
*/
describe('[Index Page Unit Test]', () => {
	it('Test', async () => {
		
	});
	
	it('Check if 3306 port is opened', async () => {
		// Add a proper test code here
	});

	it('Check if MySQL database is accessible', async () => {
		// Add a proper test code here
	});
});