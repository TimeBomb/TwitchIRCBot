module.exports.id = 'channels';
module.exports.require = ['storage'];
module.exports.run = function(ext, bot) {
	var clone = require('clone');
	ext.storage.channels = ext.storage.channels || [];

	bot.extensions.hook(function (extension, loadExtension) {
		if (extension.channels === false) {
			return;
		}
		for(var i = 0, len = ext.storage.channels.length; i < len; i++) {
			var channelExtension = clone(extension);
			channelExtension.id = ext.storage.channels[i] + '.' + channelExtension.id;
			loadExtension(channelExtension);
		}
		return true;
	});

	ext.api.add = function(name) {
		if (channels.indexOf(name) !== -1) {
			return false;
		} else {
			channels.push(name);
			return true;
		}

		bot.data.save();
	};

	ext.api.get = function() {
		return channels;
	};

	ext.api.remove = function(name) {
		if (channels.indexOf(name) === -1) {
			return false;
		} else {
			delete channels[name];
			return true;
		}

		bot.data.save();
	};

	return ext;
};