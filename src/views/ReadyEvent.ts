import {IEvent} from "../controllers/EventLoader";
import {AraiClient} from "../controllers/AraiClient";
import { ModuleLoader } from "../controllers/ModuleLoader";
import { resolve } from "path";

export default class ReadyEvent implements IEvent {
    name: string = "ready";
    run = (): void => {
        this.client.console.info("Virtual Cat System Enabled!")
        // Needs more things
        new ModuleLoader(this.client, resolve(__dirname, "..", "modules"));
    };
    constructor(public client: AraiClient) {}
}
