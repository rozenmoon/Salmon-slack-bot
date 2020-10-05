// import { GenerateBurndownChart } from '../task-runners/generate-burndown-chart'
import { getSprint, getSprintIssues, getJiraTask } from "../api";
// import getSprintIssues from "../api";
// import getJiraStatus from "../api";
import fs from "fs";
import fetch from "node-fetch";

export class SprintBurndownCommand {
  // alias = "sprint_burndown";

  generateInput(slackContext, args) {
    if (args.length == 0) {
      throw new Error("Please provide a sprint ID (eg. `sprint_burndown 123`)");
    }
    if (Number(args[0]) == NaN) {
      throw new Error("Sprint ID must be numeric");
    }
    return { sprintId: Number(args[0]) };
  }

  async execute(slackContext, input, slack, rtm) {
    const initialMessage = await rtm.sendMessage(
      ":nowloading: Generating...",
      slackContext.channelId
    );
    // console.log(input);
    try {
      await getJiraTask()
        .then((jiraTask) => {
          return getSprintIssues(input, jiraTask);
        })
        // .then((res) => console.log(res));
      // console.log("this is sprint", sprint);
      // console.log("this is tickets", tickets[0][0].statusChanges);
      // console.log("this is tickets", status[0].taskStatuses[0]);

      // const generateBurndownChart = new GenerateBurndownChart()
      // const image = await generateBurndownChart.execute(sprint,
      // tickets)
      await fetch("https://picsum.photos/200/300").then((res) => {
        console.log(res);
        slack.files.upload({
          filename: "a",
          file: res.body,
          thread_ts: initialMessage.ts,
          channels: slackContext.channelId,
        });

        slack.chat.update({
          text: `:bluecheck: Done!`,
          ts: initialMessage.ts,
          channel: slackContext.channelId,
        });
      });

      //   if (isSandbox(slack)) {
      //     console.log(`Outputting buffer to file: ${image.fileName}`);
      //     fs.writeFileSync(`storage/${image.fileName}`, image.buffer);
      //   }
    } catch (error) {
      console.error(error);

      slack.updateMessage({
        text: `:x: Failed: ${error}`,
        ts: initialMessage.ts,
        channel: slackContext.channelId,
      });
    }
  }
}
