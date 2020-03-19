import {IEvent} from "../controllers/EventLoader";
import {AraiClient} from "../controllers/AraiClient";
import { IMessage } from "src/controllers/extended/Message";

export default class MessageEvent implements IEvent {
    name: string = "message";
    run = (message: IMessage): IMessage | void => {
        const client = this.client;
        if (message.author.bot || !message.guild) { return undefined; }

        try {
            client.cbusHandle().handle(message);
        } catch (e) {
            client.console.error("MESSAGE_EVENT_ERROR: ", e);
        }
        // Will handle commands

        if (message.mentions.users.has(message.client.user!.id)) {
            // TODO: Adding personalized message
        }

        return message;
    };
    constructor(public client: AraiClient) {}
}
