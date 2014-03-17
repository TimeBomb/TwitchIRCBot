module.exports.id = 'commands';
module.exports.channels = false;
module.exports.required = ['messages'];
module.exports.run = function(ext, bot) {
	bot.messages.hook(function(from, to, message) {
		var tokens = message.split(' ');
		var command = tokens.shift().substr(1);
	});
	return ext;
};