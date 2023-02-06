module.exports = {
	setupFiles: ["./jest.setup.js"],
	testEnvironment: "node",
	globalSetup: "./jest.setup.global.js",
	watchPathIgnorePatterns: ["<rootDir>/setting/auto_generated"]
}