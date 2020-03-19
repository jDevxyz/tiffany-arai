import {EventEmitter} from "events"
import {AraiClient} from "./AraiClient";
import {IMessage} from "./extended/Message";
import {read, readdir} from "fs";

export class BehaviorController extends EventEmitter {
    constructor(private client: AraiClient, private path: string) {
        super();
        readdir(path, (err, behaviors: string[]) => {
            if (err) client.console.error("BEHAVIOR_CONTROLLER_ERROR: ", err);
            client.console.info(`Found ${behaviors.length} of behaviors`);
            behaviors.forEach(behaviorpath => {
                try {
                    const Behavior = require(`${path}/${behaviorpath}`).default;
                    const behavior: BehaviorComponent = new Behavior(client, this);
                } catch(err) {
                    if (new RegExp("is not a constructor", "gi").exec(err.message)!.length !== 0) {
                        client.console.warn("BEHAVIOR_CONTROLLER_WARN: ", new Error(`${behaviorpath} is not implementing proper Behavior Constructor`));
                    } else {
                        client.console.error("BEHAVIOR_CONTROLLER_ERROR: ", err);
                    }
                }
            })
        })

    }
}

export class BehaviorComponent extends EventEmitter implements IBehaviorComponent {
    public name = "n/a";
    constructor(public client: AraiClient, public contr: BehaviorController) {
        super();

        this.init().then()
    }

    private async init() {
        this.client.behavior.set("this.name", this)
    }
}

export interface IBehaviorComponent {
    name?: string
    trigger?(message: IMessage): boolean | undefined
    response?(message: IMessage): IMessage
    forward?(callback: Function): void
}
