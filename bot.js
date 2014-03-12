module.exports = function () {
	var bot = this;
	
	// Putting the filesys here so extensions don't have to re-require it
	this.fs = require('fs');
	
	this.config = {};
	this.storage = {};

	// Load/Save storage+config from file
	this.data = {
		'load': function(dataFile) {
			var fileData = JSON.parse(bot.fs.readFileSync(dataFile));
			bot.config = fileData.config;
			bot.storage = fileData.storage;

			return bot;
		},

		'save': function(dataFile) {
			bot.fs.writeFileSync(dataFile, JSON.stringify({config: this.config, storage: this.storage}, null, 4));

			return bot;
		}
	};

	// Load extensions in extensionsPath
	this.extensions = require('./extensions')(bot);

	return this;
};