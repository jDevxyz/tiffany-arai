import { CommandComponent } from "../../controllers/ModuleLoader";
import { AraiClient } from "../..//controllers/AraiClient";
import { MessageEmbed as Embed } from "discord.js";
import { IMessage } from "../../controllers/extended/Message";

export default class EvalCommand extends CommandComponent {
    constructor(client: AraiClient, submodule: string, path: string) {
        super(client, submodule, path);
        this.conf = {
            aliases: ["ev", "js-exec", "e", "evaluate"],
            cooldown: 3,
            requiredPermissions: [],
            devOnly: true,
            disable: false
        };

        this.help = {
            name: "eval",
            description: "Only the developer can use this command.",
            usage: "eval <some js code>",
            example: ""
        };
    }

    public async run(message: IMessage) {
        const msg = message;
        const client = this.client;

        const embed = new Embed()
            .setColor("GREEN")
            .addField("Input", "```js\n" + message.args.join(" ") + "```");

        try {
            const code = message.args.slice(0).join(" ");
            if (!code) return this.client.util.argsMissing(message, "No js code was provided", this.help);
            let evaled;
            if (message.flag.includes("silent") && message.flag.includes("async")) {
                await eval(`(async function() {
                        ${code}
                    })()`);
                return message;
            } else if (message.flag.includes("async")) {
                evaled = await eval(`(async function() {
                        ${code}
                    })()`);
            } else if (message.flag.includes("silent")) {
                await eval(code);
                return message;
            } else {
                evaled = await eval(code);
            }

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled, {
                    depth: 0
                });

            const outputRaw = this.clean(evaled);
            const output = outputRaw.replace(new RegExp(this.client.token!, "g"), "[TOKEN]");
            if (output.length > 1024) {
                const hastebin = await this.client.util.hastebin(output);
                embed.addField("Output", hastebin);
            } else {
                embed.addField("Output", "```js\n" + output + "```");
            }
            message.channel.send(embed);
        } catch (e) {
            const error = this.clean(e);
            if (error.length > 1024) {
                const hastebin = await this.client.util.hastebin(error);
                embed.addField("Error", hastebin);
            } else {
                embed.addField("Error", "```js\n" + error + "```");
            }
            message.channel.send(embed);
        }

        return message;
    }

    private clean(text: string): string {
        if (typeof text === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
    }
}
