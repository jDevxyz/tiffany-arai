import { Structures, User } from "discord.js";
import { AraiClient } from "../AraiClient";
import { Developers } from "../../store"

Structures.extend("User", DJSUser => {
    class User extends DJSUser {
        public isDev?: boolean;
        constructor(client: AraiClient, data: object) {
            super(client, data);
            this.isDev = Developers.includes(this.id);
        }
    }

    return User;
});

export interface IUser extends User {
    isDev?: boolean
}
