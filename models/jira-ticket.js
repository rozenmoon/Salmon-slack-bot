import dayjs from "dayjs";

// export enum TicketType {
//     TECH_STORY = '11329',
//     CLIENT_BUG = '10303',
//     CLIENT_TASK = '10321',
//     STORY = '10000',

//     UNKNOWN = '0',
// }

// export enum TicketStatus {
//     IN_PLANNING = '12085',
//     READY_FOR_DESIGN = '12086',
//     IN_DESIGN = '12053',
//     READY_FOR_DEV = '12052',
//     IN_DEVELOPMENT = '11950',
//     TODO = '10000',
//     IN_PROGRESS = '10700',
//     IN_CODE_REVIEW = '10601',
//     READY_FOR_QA = '5',
//     IN_QA = '10600',
//     IN_QA_FEEDBACK = '-1', // TODO
//     VERIFIED = '11001',
//     DONE = '10001',
//     UNKNOWN = '0',
// }

function getTicketType(id) {
  const values = Object.values(TicketType);
  const type = values.filter((value) => value === id);

  return type[0];
}

function getStatusType(id) {
  const values = Object.values(TicketStatus);
  const type = values.filter((value) => value === id);

  return type[0];
}

export function getStatusString(type) {
  switch (type) {
    case TicketStatus.TODO:
      return "Todo";
    case TicketStatus.IN_PROGRESS:
      return "In Progress";
    case TicketStatus.IN_CODE_REVIEW:
      return "In Code Review";
    case TicketStatus.READY_FOR_QA:
      return "Ready for QA";
    case TicketStatus.IN_QA:
      return "In QA";
    case TicketStatus.IN_QA_FEEDBACK:
      return "In QA (Feedback)";
    case TicketStatus.VERIFIED:
      return "Verified";
    case TicketStatus.DONE:
      return "Done";
    case TicketStatus.UNKNOWN:
      return "Unknown";
  }
}

// export interface TicketStatusChange {
//     from: TicketStatus
//     to: TicketStatus
//     date: dayjs.Dayjs
// }

export class JiraTicket {
  // readonly id: string
  // readonly key: string // The 'display name' of the ticket (eg. MJP-41026)
  // readonly title: string
  // readonly labels: string[]
  // readonly type: TicketType
  // readonly status: TicketStatus
  // readonly storypoints: number|null
  // readonly createdAt: dayjs.Dayjs
  // readonly statusChanges: TicketStatusChange[] = []

  constructor(issueJson) {
    this.id = issueJson.id;
    this.key = issueJson.key;
    this.title = issueJson.fields.summary;
    this.labels = issueJson.fields.labels;
    this.type = issueJson.fields.issuetype.id;
    this.status = issueJson.fields.status.id;
    this.storypoints = issueJson.fields.customfield_10026;
    this.assignee = issueJson.fields.assignee ? issueJson.fields.assignee.displayName: "";

    // this.statusChanges = issueJson.changelog.histories.forEach(
    //   (history) => {
    //     return history.items
    //       .filter((item) => item.field == "status")
    //       .map((item) => {
    //         return {
    //           from: getStatusType(item.from),
    //           to: getStatusType(item.to),
    //           date: dayjs(history.created),
    //         };
    //       });
    //   }
    // );
    // .flatMap(history => {
    // });
    // console.log(issueJson);
  }

  // get isStorypointCountable() {
  //     return this.type != TicketType.STORY
  //         && this.type != TicketType.TECH_STORY
  // }

  // get isDoneStatus() {
  //     return this.status == TicketStatus.VERIFIED || this.status == TicketStatus.DONE
  // }
}
