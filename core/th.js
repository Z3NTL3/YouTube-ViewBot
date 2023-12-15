"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const process = require("process");
const th = require("worker_threads");
const YoutubeViewBot = require(path.join(__dirname, "../", "lib", "config", "bot.js"));
if (th.parentPort === null) {
    console.log("null");
    process.exit(-1);
}
;
(async () => {
    try {
        let bot = new YoutubeViewBot(String((th.workerData["proxy"]["ip"]) + ":" +
            (th.workerData["proxy"]["port"])));
        await bot.init();
        await bot.navigate(th.workerData["video"]);
        th.parentPort.postMessage({ id: th.workerData["id"], msg: `thread-${th.workerData["id"]} sent view` });
    }
    catch (err) {
        th.parentPort.postMessage({ id: th.workerData["id"], msg: `thread-${th.workerData["id"]} failed ${err}` });
    }
})();
