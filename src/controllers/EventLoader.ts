import { readdirSync } from "fs";
import { AraiClient } from "./AraiClient";

export class EventLoader {
    constructor(private client: AraiClient, private path: string) {
        const eventFiles: string[] | undefined = readdirSync(this.path);
        for (const eventFile of eventFiles) {
            const event: IEvent = new (require(`${this.path}/${eventFile}`).default)(this.client);
            this.client.events.set(event.name, event);
            this.client.console.info(`Event ${event.name} has been loaded!`);
        }

        this.client.events.forEach((event: IEvent) => {
            // @ts-ignore
            this.client.on(event.name, event.run);
        });
    }
}

export interface IEvent {
    name: string
    run: any
    client: AraiClient
}
