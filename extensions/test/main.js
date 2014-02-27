module.exports.id = 'test';
module.exports.requires = ['test2'];
module.exports.run = function(ext, bot) {
	console.log('test2.abc = ' + bot.config.test2.abc);
	ext.config.def = 'nmop';
	return ext;
};