import { Responses } from "./responses"

const Store = {
    token: process.env.TOKEN,
    fullname: "Tiffany Arai",
    nickname: "Tiffany",
    prefix: "tif",
    rethink: {
        host: "127.0.0.1",
        port: 28015
    },
    staticServer: "https://hzmi.xyz/assets/"
};

const Developers = [
    "290159952784392202",
    "337028800929857536"
]

export { Store, Responses, Developers }
