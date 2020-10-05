const { GoogleSpreadsheet } = require("google-spreadsheet");
const credentials = require("../salmon-sprints-client-secret.json");
const { promisify } = require("util");
import { getJiraTask, getSprintIssues } from "../api";

async function accessdoc() {
  const salmonSprintDoc = new GoogleSpreadsheet(
    "1UBQrlv9A_4gsuDt5EebpZMMhEIHooMrXwml3gZ0Fb2k"
  );
  await salmonSprintDoc.useServiceAccountAuth(credentials);

  await salmonSprintDoc.loadInfo();

  return salmonSprintDoc;
}

export default async function addTicketsToSpreadsheet(sprint, sprintid) {
  try {
    const sheet = await getSprint(sprint, await accessdoc());

    await getJiraTask()
      .then((jiraTask) => {
        return getSprintIssues(sprintid, jiraTask);
      })
      .then((issues) => {
        // console.log(issues);
        issues.forEach((issue) => {
          console.log(issue);
          setTimeout(
            () => insertRow(
              {
                type: issue.type,
                key: issue.key,
                ticketName: issue.title,
                assignee: issue.assignee,
                status: issue.status,
                estimation: issue.storypoints,
              },
              sheet
            ),
            1000
          );
        });
      });
  } catch (error) {
    console.log(error);
  }
}


// This function gets sheet from doc
async function getSprint(sprint, doc) {
  const sheet = doc.sheetsByIndex.find((sheet) => sheet.title === sprint);
  if (!sheet) {
    sheet = await doc.addSheet({ title: sprint });
  }
  return sheet;
}

async function insertRow(data, sheet) {
  // This function inserts row in the sheet
  return await sheet.addRow({
    ...data,
  });
}

function getRow() {
  // This function gets row
}
