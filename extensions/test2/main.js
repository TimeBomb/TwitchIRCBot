module.exports.id = 'test2';
module.exports.run = function(ext, bot) {
	ext.config.abc = 'xyz';
	return ext;
};