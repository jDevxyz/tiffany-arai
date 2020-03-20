import { CommandComponent } from "../../controllers/ModuleLoader";
import { AraiClient } from "../../controllers/AraiClient";
import { IMessage } from "src/controllers/extended/Message";
import { Message, MessageEmbed } from "discord.js";

export default class PingCommand extends CommandComponent {
    constructor(client: AraiClient, submodule: string, path: string) {
        super(client, submodule, path);

        this.conf = {
            aliases: ["pong", "peng", "p"],
            cooldown: 3,
            requiredPermissions: [],
            devOnly: true,
            disable: false
        }

        this.help = {
            name: "ping",
            description: "Shows the current ping of the bot",
            usage: "ping",
            example: ""
        }
    }

    public run(message: IMessage) {
        const before = Date.now();
        message.channel.send("🏓 Pong!").then((msg: IMessage | Message | any) => {
            const latency = Date.now() - before;
            const wsLatency = this.client.ws.ping.toFixed(0);
            const embed = new MessageEmbed()
                .setAuthor("🏓 PONG!", this.client.util.getAvatar(message.client.user))
                .setColor(this.searchHex(wsLatency))
                .addFields({
                    name: "📶 Message Latency",
                    value: `**\`${latency}\`** ms`,
                    inline: true
                },{
                    name: "🌐 WebSocket Latency",
                    value: `**\`${wsLatency}\`** ms`,
                    inline: true
                })
                .setFooter(`Requested by: ${message.author.tag}`, this.client.util.getAvatar(message.author))
                .setTimestamp();

            msg.edit(embed);
            msg.edit("");
        });
        return message;
    }

    private searchHex(ms: string): string | number {
        const listColorHex = [
            [0, 20, "#0DFF00"],
            [21, 50, "#0BC700"],
            [51, 100, "#E5ED02"],
            [101, 150, "#FF8C00"],
            [150, 200, "#FF6A00"]
        ];

        const defaultColor = "#FF0D00";

        const min = listColorHex.map(e => e[0]);
        const max = listColorHex.map(e => e[1]);
        const hex = listColorHex.map(e => e[2]);
        let ret: string | number = "#000000";

        for (let i = 0; i < listColorHex.length; i++) {
            if (min[i] <= ms && ms <= max[i]) {
                ret = hex[i];
                break;
            }
            else {
                ret = defaultColor;
            }
        }
        return ret;
    }
}
