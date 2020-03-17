import { Structures, Guild, GuildMember } from "discord.js";
import { AraiClient } from "../AraiClient";
import { IUser } from "./User";

Structures.extend("GuildMember", DJSGuildMember => {
    class GuildMember extends DJSGuildMember {
        public isDev?: boolean;
        constructor(client: AraiClient, data: object, guild: Guild) {
            super(client, data, guild);
            // eslint-disable-next-line no-extra-parens
            this.isDev = (this.user as IUser).isDev! ? true : false;
        }
    }

    return GuildMember;
});

export interface IGuildMember extends GuildMember {
    isDev?: boolean
}
