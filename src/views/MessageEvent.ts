import {IEvent} from "../controllers/EventLoader";
import {AraiClient} from "../controllers/AraiClient";
import {Message, MessageEmbed} from "discord.js";

export default class MessageEvent implements IEvent {
    name: string = "message";
    run = (message: Message): Message | void => {
        const client = this.client;
        if (message.author.bot || !message.guild) { return undefined; }

        // Will handle commands

        if (message.mentions.users.has(message.client.user!.id)) {
            // TODO: Adding personalized message
        }

        return message;
    };
    constructor(public client: AraiClient) {}
}
