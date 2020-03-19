import {CommandComponent} from "../../controllers/ModuleLoader";
import {AraiClient} from "../../controllers/AraiClient";
import {IMessage} from "../../controllers/extended/Message";
import {GPU} from "gpu.js"
import {Message, MessageAttachment, MessageEmbed} from "discord.js";

export default class extends CommandComponent {
    constructor(client: AraiClient, submodule: string, path: string) {
        super(client, submodule, path);
        this.conf = {
            aliases: ["drawgpu", "gpu", "gpucanvas"],
            cooldown: 3,
            requiredPermissions: [],
            devOnly: true,
            disable: true
        };

        this.help = {
            name: "draw",
            description: "Only the developer can use this command.",
            usage: "draw <some vertex and nodes>",
            example: ""
        };
    }

    public async run(message: IMessage) {
        const gpu = new GPU({mode: "gpu"});
        const render = gpu.createKernel(function () {
            // @ts-ignore
            this.color(this.thread.x/500, this.thread.y/500, 0.4, 1);
        })
            .setOutput([500, 500])
            .setGraphical(true);

        render();

        message.channel.send(new MessageEmbed()
            // @ts-ignore
            .attachFiles(new MessageAttachment(render.exec(), "file.jpg"))
        )
    }
}
