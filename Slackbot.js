const SlackBot = require('slackbots');

const bot = new SlackBot({
	token: `${process.env.BOT_TOKEN}`,
	name: 'salmonbot'
})
