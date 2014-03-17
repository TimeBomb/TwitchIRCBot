module.exports.id = 'messages';
module.exports.channels = false;
module.exports.requires = ['irc'];
module.exports.run = function (ext, bot) {
	var hooks = {message: [], raw: []};

	bot.irc.client.addListener('message', function(from, to, message) {
		for (var i = 0, len = hooks.message.len; i < len; i++) {
			hooks.message[i](from, to, message);
		}
	});

	bot.irc.client.addListener('raw', function(message) {
		for (var i = 0, len = hooks.raw.len; i < len; i++) {
			hooks.raw[i](message);
		}
	});

	ext.api.hook = function(callback, type) {
		type = type || 'message';
		hooks[type].push(callback);
	};

	return ext;
};