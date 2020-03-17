import {Client, ClientOptions, Collection, Snowflake} from "discord.js"
import {Store} from "../store"
import { resolve } from "path"
import {IEvent, EventLoader} from "./EventLoader";
import {LogWrapper} from "./LogWrapper";
import { ICommandComponent } from "./ModuleLoader";
import Util from "./Util";
import { CommandBus } from "./CommandBus";

import "./extended/User";
import "./extended/GuildMember";
import "./extended/Message";
import { RethinkController } from "./RethinkController";

export class AraiClient extends Client {
    private _token: string = "n/a";
    readonly state = Store;
    readonly commands: Collection<string | undefined, ICommandComponent | undefined> = new Collection();
    readonly aliases: Collection<string | undefined, string> = new Collection();
    readonly submodules: Collection<string, Collection<string | undefined, ICommandComponent | undefined>> = new Collection();
    readonly events: Collection<string, IEvent> = new Collection();
    readonly console = new LogWrapper().logger;
    readonly util = new Util(this);
    readonly cooldowns: Collection<string, Collection<Snowflake, number>> = new Collection();
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
    public cbusHandle(): CommandBus {
        return (new CommandBus(this))
    }
    public dbHandle(): RethinkController {
        const rcon = new RethinkController(this)
        return rcon
    }

    // Getter Setter
    public setToken(token: string): void {
        this._token = token
    }
    public getToken(token: string): string {
        return this._token
    }
}
