import {AraiClient} from "./controllers/AraiClient";
import {Store} from "./store";

const client = new AraiClient({ disableMentions: "everyone", fetchAllMembers: true });

client.setToken(Store.token as string);
client.build();
