import tf from "@tensorflow/tfjs"

if (process.env.GPU) {
    if (process.platform == "linux") {
        import("@tensorflow/tfjs-node-gpu");
    } else {
        import("@tensorflow/tfjs-node");
    }
}
