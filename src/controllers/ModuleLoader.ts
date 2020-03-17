import {AraiClient} from "./AraiClient";
import { readdir } from "fs";
import { PermissionString } from "discord.js";
import { IMessage } from "./extended/Message";

export class ModuleLoader {
    constructor(private client: AraiClient, private path: string) {
        readdir(path, (err, submodules: string[]) => {
            if (err) client.console.error(err);
            client.console.info(`Found ${submodules.length} of submodules`);
            submodules.forEach(submodule => {
                try {
                    const config = require(`${path}/${submodule}/module.config`).default;
                    config.path = `${path}/${submodule}`;
                    client.submodules.set(submodule, config);
                    readdir(`${path}/${submodule}`, (err, files: string[]) => {
                        if (err) client.console.error(err);
                        client.console.info(`Found ${files.length - 1} commands from ${submodule}`);
                        const disabledCommands: string[] = [];
                        files.forEach(file => {
                            if (!file.endsWith(".js") && !file.endsWith(".ts")) return undefined;
                            if (file === "module.config.ts" || file === "module.config.js") return undefined;
                            const prop: ICommandComponent = new (require(`${this.path}/${submodule}/${file}`).default)(this.client, submodule, `${this.path}/${submodule}/${file}`);
                            if (prop.conf.disable) disabledCommands.push(prop.help.name);
                            client.commands.set(prop.help.name, prop);
                            prop.conf.aliases.forEach(alias => {
                                this.client.aliases.set(alias, prop.help.name);
                            });
                            config.cmds.push(prop.help.name);
                        })
                        if (disabledCommands.length !== 0) client.console.info(`There are ${disabledCommands.length} command(s) disabled.`);
                        this.client.submodules.set(submodule, this.client.commands.filter((cmd: ICommandComponent | undefined) => cmd!.submodule === submodule));
                    })
                } catch(e) {
                    if (new RegExp("Cannot find module", "gi").exec(e.message)!.length !== 0) {
                        client.console.warn("WARN: ", new Error(`No submodule config found on: ${submodule}`));
                    } else {
                        client.console.error("ERROR: ", e);
                    }
                }
            })
        })
    }
}

export interface IModuleConfig {
    name: string,
    hide: boolean, 
    devOnly: boolean,
    path: string | null
    cmds: []
}

export class CommandComponent implements ICommandComponent {
    public conf: ICommandComponent["conf"];
    public help: ICommandComponent["help"];
    constructor(public client: AraiClient, public submodule: string, public path: string) {
        this.conf = {
            aliases: [],
            cooldown: 3,
            requiredPermissions: [],
            devOnly: true,
            disable: false
        };
        this.help = {
            name: null,
            description: null,
            usage: null,
            example: null
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public run(message: IMessage): any {}

    public reload(): ICommandComponent| undefined {
        delete require.cache[require.resolve(`${this.path}`)];
        const newCMD = new (require(`${this.path}`).default)();
        this.client.commands.get(this.help.name)!.run = newCMD.run;
        this.client.commands.get(this.help.name)!.help = newCMD.help;
        this.client.commands.get(this.help.name)!.conf = newCMD.conf;
        this.client.console.info(`${this.help.name} command reloaded.`);
        return this.client.commands.get(this.help.name);
    }

}

export interface ICommandComponent {
    run: (message: IMessage) => any;
    submodule: string;
    path: string;
    reload: () => ICommandComponent | void;
    conf: {
        aliases: string[];
        cooldown: number;
        requiredPermissions: PermissionString[];
        devOnly: boolean;
        disable: boolean;
    };
    help: {
        name: string | any;
        description: string | any;
        usage: string | any;
        example: string | any;
    };
}
