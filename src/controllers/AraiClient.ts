import {Promise} from "bluebird"
global.Promise = Promise;
import {Client, ClientOptions, Collection, Snowflake} from "discord.js"
import {Store} from "../store"
import {resolve} from "path"
import {EventLoader, IEvent} from "./EventLoader";
import {LogWrapper} from "./LogWrapper";
import {ICommandComponent} from "./ModuleLoader";
import Util from "./Util";
import {CommandBus} from "./CommandBus";

import "./extended/User";
import "./extended/GuildMember";
import "./extended/Message";
import {RethinkController} from "./RethinkController";
import {Connection, RDatabase} from "rethinkdb-ts";
import {BehaviorComponent, BehaviorController} from "./BehaviorController";

export class AraiClient extends Client {
    private _token: string = "n/a";
    readonly state = Store;
    readonly commands: Collection<string | undefined, ICommandComponent | undefined> = new Collection();
    readonly aliases: Collection<string | undefined, string> = new Collection();
    readonly submodules: Collection<string, Collection<string | undefined, ICommandComponent | undefined>> = new Collection();
    readonly events: Collection<string, IEvent> = new Collection();
    readonly behavior: Collection<string, BehaviorComponent> = new Collection();
    readonly console = new LogWrapper().logger;
    readonly util = new Util(this);
    readonly cooldowns: Collection<string, Collection<Snowflake, number>> = new Collection();
    public rcon?: RethinkController;
    public conn?: Connection;
    constructor(opt: ClientOptions | undefined) {
        super(opt);
    }

    // Main Methods
    public build(): AraiClient {
        this.login(this._token).then((value: string) => {
            this.console.info(`Logged in as ${this.user!.username}!`)
        });
        this.initDB().then();
        new EventLoader(this, resolve(__dirname, "..", "views"));
        new BehaviorController(this, resolve(__dirname, "..", "behavior"));
        return this
    }
    public cbusHandle(): CommandBus {
        return (new CommandBus(this))
    }
    public dbHandle(dbname?: string): RethinkController | RDatabase | undefined {
        return typeof dbname === "string" ? this.rcon!.getdb(this.state.nickname.toLowerCase()) : this.rcon;
    }

    private async initDB() {
        this.rcon = new RethinkController(this);
        await this.rcon.build();
        this.rcon.defaultDatabase = this.rcon.getdb(this.state.nickname.toLowerCase())
    }

    // Getter Setter
    public setToken(token: string): void {
        this._token = token
    }
    public getToken(token: string): string {
        return this._token
    }
}
