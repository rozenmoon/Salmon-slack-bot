import fetch from "node-fetch";
import { Sprint } from "./models/sprint";
import { JiraTicket } from "./models/jira-ticket";
import { JiraTask } from "./models/jira-task";
const dotenv = require("dotenv");
dotenv.config();

const baseUrl = "https://mercari.atlassian.net/rest/agile/1.0/";
const path = "sprint";

function makeHeaders() {
  // Base64 encoding is done via Buffer on Node
  const authorization = Buffer.from(
    process.env.JIRA_USERNAME + ":" + process.env.JIRA_API_TOKEN
  ).toString("base64");

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: "Basic " + authorization,
  };
}

function getSprint(sprintId) {
  return fetch(baseUrl + path + "/" + sprintId, {
    method: "get",
    headers: makeHeaders(),
  })
    .then((response) => response.json())
    .then((json) => new Sprint(json));
}

function getJiraTask() {
  return fetch(
    "https://mercari.atlassian.net/rest/api/3/project/MJP/statuses",
    {
      method: "get",
      headers: makeHeaders(),
    }
  )
    .then((response) => response.json())
    .then((json) => json.map((task) => new JiraTask(task)))
    .then((tasks) => {
      let taskMap = new Map();
      tasks.map((task) => {
        taskMap[task.tasktId] = task;
      });
      return taskMap;
    });
}

export default function getSprintIssues(sprintId, jiraTask) {
  return fetch(
    baseUrl + path + "/" + sprintId + "/issue?maxResults=500&expand=changelog",
    {
      method: "get",
      headers: makeHeaders(),
    }
  )
    .then((response) => response.json())
    .then((json) =>
      json.issues.map((issue) => {
        let newissue = new JiraTicket(issue);
        newissue.status = jiraTask[newissue.type].taskStatuses.find(
          (status) => status.id === newissue.status
        ).name;
        newissue.type = jiraTask[newissue.type].taskname;
        return newissue;
      })
    );
}

export { getJiraTask, getSprint, getSprintIssues };
