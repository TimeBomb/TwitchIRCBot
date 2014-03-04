module.exports.id = 'irc';
module.exports.require = ['storage'];
module.exports.run = function(ext, bot) {
	var started = false;

	ext.config.server = ext.config.server || 'irc.twitch.tv';
	ext.config.name = ext.config.name || 'bot-username';
	ext.config.password = ext.config.password || 'bot-api-key';
	ext.config.debug = ext.config.debug || true;

	// Start bot - Load data+config from filePath, start IRC server based on config; can only be run once
	ext.api.start = function () {
		if (started) {
			throw 'ERROR: Bot is already started.';
		}

		var irc = require('irc');
		var client = new irc.Client(ext.config.server, ext.config.name, {
			username: ext.config.name,
			password: ext.config.password,
			debug: ext.config.debug,
		});
		started = true;

		return bot;
	};

	return ext;
};