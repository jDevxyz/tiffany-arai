/* eslint-disable no-extra-parens */
import { Structures, TextChannel, Message, Guild } from "discord.js";
import { AraiClient } from "../AraiClient";
import { IUser } from "./User";
import { IGuildMember } from "./GuildMember";

Structures.extend("Message", DJSMessage => {
    class Message extends DJSMessage {
        public args: string[] = [];
        public cmd: string | null = null;
        public flag: string[] = [];
        constructor(client: AraiClient, data: object, channel: TextChannel) {
            super(client, data, channel);
            if (this.content.startsWith(client.state.prefix)) {
                this.args = this.content.substring(client.state.prefix.length).trim().split(" ");
                const cmd = this.args.shift()!.toLowerCase();
                this.cmd = client.commands.has(cmd) ? cmd : null;
                while (this.args[0] && (this.args[0].startsWith("--") || this.args[0].startsWith("-"))) {
                    let flag;
                    if (this.args[0].startsWith("--")) {
                        flag = this.args.shift()!.slice(2);
                    } else { flag = this.args.shift()!.slice(1); }
                    this.flag.push(flag);
                }
            }
        }
    }

    return Message;
});

export interface IMessage extends Message {
    guild: Guild;
    author: IUser;
    member: IGuildMember;
    client: AraiClient;
    args: string[];
    cmd: string | undefined;
    flag: string[];
}
