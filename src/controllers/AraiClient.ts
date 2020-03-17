import {Client, ClientOptions, Collection} from "discord.js"
import {Store} from "../store"
import { resolve } from "path"
import {IEvent, EventLoader} from "./EventLoader";
import {LogWrapper} from "./LogWrapper";

export class AraiClient extends Client {
    private _token: string = "n/a";
    readonly state = Store;
    readonly commands: Collection<string, any> = new Collection();
    readonly events: Collection<string, IEvent> = new Collection();
    readonly console = new LogWrapper().logger;
    constructor(opt: ClientOptions | undefined) {
        super(opt);
    }

    // Main Methods
    public build(): AraiClient {
        this.login(this._token).then((value: string) => {
            this.console.info(`Logged in as ${this.user!.username}!`)
        });
        new EventLoader(this, resolve(__dirname, "..", "views"));
        return this
    }

    // Getter Setter
    public setToken(token: string): void {
        this._token = token
    }
    public getToken(token: string): string {
        return this._token
    }
}
