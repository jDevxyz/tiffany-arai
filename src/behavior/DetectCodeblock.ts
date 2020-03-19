import {BehaviorComponent, BehaviorController} from "../controllers/BehaviorController";
import {AraiClient} from "../controllers/AraiClient";
import {IMessage} from "../controllers/extended/Message";

export default class extends BehaviorComponent {
    constructor(public client: AraiClient, public contr: BehaviorController) {
        super(client, contr);
    }

    public trigger(message: IMessage): boolean | undefined {
        return message.mentions.users.has(message.client.user!.id) ? true : false
    }

    public response(message: IMessage): IMessage {


        return message
    }
}
