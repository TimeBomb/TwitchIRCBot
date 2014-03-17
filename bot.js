// TODO: Add config web ui extension & commands extension
module.exports = function () {
	var bot = this;
	var dataFile = './data.json';
	
	// Putting the filesys here so extensions don't have to re-require it
	this.fs = require('fs');
	
	this.config = {};
	this.storage = {};

	// Load/Save storage+config from file
	this.data = {
		'load': function(dataFilePath) {
			dataFile = dataFilePath || dataFile;
			var fileData = JSON.parse(bot.fs.readFileSync(dataFile));
			bot.config = fileData.config;
			bot.storage = fileData.storage;

			return bot;
		},

		'save': function() {
			bot.fs.writeFileSync(dataFile, JSON.stringify({config: bot.config, storage: bot.storage}, null, 4));
			return bot;
		}
	};

	// Load extensions in extensionsPath
	this.extensions = require('./extensions')(bot);

	return this;
};