module.exports = function() {
	this.config = {};
	this.data = {};

	var extensions = require('./extensions')(this);
	extensions.load('./extensions');

	return {

	};
};