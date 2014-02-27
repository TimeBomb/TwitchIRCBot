module.exports.id = 'test3';
module.exports.requires = ['test', 'test2'];
module.exports.run = function(ext, bot) {
	console.log('test.def = ' + bot.config.test.def);
	return ext;
};