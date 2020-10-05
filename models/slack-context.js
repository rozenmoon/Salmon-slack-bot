export class SlackContext {
    constructor(json) {
        this.channelId = json.channel
        this.messageSenderUserId = json.user
        this.messageId = json.client_msg_id
        this.ts = json.ts
    }
}
