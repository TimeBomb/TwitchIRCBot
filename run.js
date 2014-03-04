require('./bot')()
	.data.load('./data.json')
	.extensions.load('./extensions')
	.irc.start();
