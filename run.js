var bot = require('./bot')()
	.data.load()
	.extensions.load()
	.irc.start();
bot.channels.add('timebomb0');