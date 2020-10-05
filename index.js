// const axios = require('axios')
const dotenv = require("dotenv");
import getSprint from "./api";
import { getJiraTask, getSprintIssues}  from "./api";
const { WebClient } = require("@slack/web-api");
const { RTMClient } = require("@slack/rtm-api");
import addTicketsToSpreadsheet from './task/update_velocity_sheet';
import { SprintBurndownCommand } from "./commands/sprintBurndown";
import { UpdateSheetCommand } from "./commands/updateSheet"
// import { SlackContext } from '../models/slack-context';
// import defaultExport from "./api";

dotenv.config();
let currentSprint = "5972";

const web = new WebClient(process.env.SLACK_TOKEN);
const currentTime = new Date().toTimeString();

const rtm = new RTMClient(process.env.SLACK_TOKEN);

const botMentionPattern = "<@" + "U01AYNT9LLC" + ">";
const messagePattern = new RegExp("^" + botMentionPattern + " (.+)$");

let commandRouter = new Map();
commandRouter.set('sprint_burndown', () => new SprintBurndownCommand());
commandRouter.set('update_sheet', () => new UpdateSheetCommand());

// console.log(commandRouter.get('sprint_burndown'));


rtm.on("message", (event) => {
//  Ignore all message types that aren't actually messages (user typing, notifications, etc)
  if (event.type != "message") return;

  // Ignore any messages that don't have a sender, because those are generally system notifications (eg. joining a channel)
  if (event.user == "" || event.user == null) return;

	const botMentionPattern = '<@'+'U01AYNT9LLC'+'>'
	if (! event.text.startsWith(botMentionPattern)) return

	const matches = event.text.match(messagePattern);

	const stringCommand = matches[1];
	console.log('Received command', stringCommand);

  // if (!matches) {
  //   rtm.sendMessage(
  //     `Invalid command. Type \`help\` for a list of valid commands`,
  //     event.channel
  //   );
  //   console.log(event);
  //   return;
	// }

  const command = commandRouter.get(stringCommand);

  if (!command) {
    rtm.sendMessage(
      `Invalid command.`,
      event.channel
    );
    console.log(event);
    return;
	}

	try {
		command().execute({channelId: 'C01AHLJ6361'}, currentSprint,web,rtm)
} catch(error) {
		console.error(error)
		rtm.sendMessage(':robot_face: ' + error.message, event.channel)
		return
}

});


(async () => {
  try {
    // Use the `chat.postMessage` method to send a message from this app

    addTicketsToSpreadsheet('Salmon Velocity',currentSprint);
    const { self, team } = await rtm.start();

    await web.chat.postMessage({
      channel: "#salom-test",
      text: `The current time is ${currentTime}`,
    });
  } catch (error) {
    console.log(error);
  }

  console.log("Message posted!");
})();

