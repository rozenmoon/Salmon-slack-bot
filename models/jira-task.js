export class JiraTask {
  constructor(task) {
    this.tasktId = task.id
    this.taskname = task.name
    this.isSubtask = task.subtask
    this.taskStatuses = task.statuses
}

  // generate status map for jira tickets
  // generateStatusMap(statusResponse) {
  //   let ticketMap = new Map();
  //   statusResponse.array.forEach((response) => {
	// 		ticketMap[response.id] = {response.}
	// 	});
  // }
}
