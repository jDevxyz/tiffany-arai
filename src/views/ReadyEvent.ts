import {IEvent} from "../controllers/EventLoader";
import {AraiClient} from "../controllers/AraiClient";
import {Message} from "discord.js";

export default class ReadyEvent implements IEvent {
    name: string = "ready";
    run = (message: Message): Message | void => {
        // Needs more things
    };
    constructor(public client: AraiClient) {}
}
