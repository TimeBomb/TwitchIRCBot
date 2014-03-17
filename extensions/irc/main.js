module.exports.id = 'irc';
module.exports.loadOnce = true;
module.exports.channels = false;
module.exports.require = ['channels'];
module.exports.run = function(ext, bot) {
	var started = false;
	var irc = require('irc');

	ext.config.server = ext.config.server || 'irc.twitch.tv';
	ext.config.name = ext.config.name || 'bot-username';
	ext.config.password = ext.config.password || 'bot-api-key';
	ext.config.debug = ext.config.debug || true;

	// Start bot - Load data+config from filePath, start IRC server based on config; can only be run once
	ext.api.start = function () {
		if (started) {
			throw 'ERROR: Bot IRC is already started.';
		}

		ext.api.client = ext.api.client || new irc.Client(ext.config.server, ext.config.name, {
			username: ext.config.name,
			password: ext.config.password,
			floodProtection: true,
			floodProtectionDelay: 2000, // Needs to be >= 2000 to not get IP banned by Twitch; ban is at >30 msgs in 60 seconds
			debug: ext.config.debug
		});
		ext.api.client.connect(function() {o
			var channels = bot.channels.get();
			for (var i = 0, len = channels.length; i < len; i++) {
				ext.api.client.join('#' + channels[i]);
			}
		});
		started = true;
		
		return bot;
	};

	ext.api.stop = function () {
		if (!started) {
			throw 'ERROR: Bot IRC is not started.';
		}

		ext.api.client.disconnect();
		started = false;

		return bot;
	}

	return ext;
};