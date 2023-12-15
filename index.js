"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const worker_threads_1 = require("worker_threads");
const commander_1 = require("commander");
const os_1 = require("os");
const proxy_checker_1 = __importDefault(require("./lib/launcher/proxy-checker"));
const path_1 = __importDefault(require("path"));
const promises_1 = require("timers/promises");
var targetURL = null;
var timeout = 0;
var retries = 0;
var custom = false;
const program = new commander_1.Command()
    .name("Youtube ViewBot")
    .description("CLI for YouTube views bot - by @z3ntl3")
    .version("v1-BETA")
    .option("-custom", "Whether your going to load custom proxies, you have to put it in '/ProxyBeast/proxies.txt'", (val, prev) => {
    custom = true;
});
program
    .command("video <url> <timeout> <retries>")
    .description('Sets the target video url')
    .action((vid, tm, rt) => {
    try {
        new URL(vid);
        if (typeof tm === "number" &&
            tm >= 5) {
            throw new Error("timeout needs to be >= 5 (in seconds)");
        }
        if (typeof rt === "number" &&
            rt >= 2) {
            throw new Error("retries needs to be >= 2 (in seconds)");
        }
        timeout = tm;
        retries = rt;
        return targetURL = vid;
    }
    catch (err) {
        process.stderr.write(String(err));
        process.exit(-1);
    }
});
program.parse(process.argv);
var workers = [];
const random = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
};
(async () => {
    (0, dotenv_1.config)();
    let cores = (0, os_1.cpus)().length;
    if (cores <= 5) {
        process.stderr.write("Below 5 cores available, which is to less");
        process.exit(-1);
    }
    let checker = new proxy_checker_1.default("");
    // first: scrape and check proxies
    if (!custom) {
        console.log("'going to scrape & check proxies, can take maximum 1min'");
        if (!(await checker.scrape().catch((err) => {
            process.stderr.write(err.message);
            process.exit(-1);
        }))) {
            process.stderr.write("Failed scraping proxies");
            process.exit(-1);
        }
    }
    console.log("starting checking proxies, takes maximum 1min");
    let c = new AbortController();
    await checker.startChecking(["--timeout", String(timeout),
        "--retry", String(retries),
        "--protocol", "http"], c).catch((err) => {
        if (err.message === "The operation was aborte") {
            process.stderr.write(err.message);
            process.exit(-1);
        }
    });
    let id = 0;
    let proxies = checker.readWorkingProxies();
    console.log("starting threads");
    setInterval(() => {
        console.log("active threads: ", workers.length, "/", 5);
    }, 10000);
    while (true) {
        await (0, promises_1.setTimeout)(200, null);
        if (workers.length < 5) {
            id++;
            let proxy = random(proxies);
            let w = new worker_threads_1.Worker(path_1.default.join(__dirname, "core", "th.js"), { workerData: {
                    proxy: {
                        ip: proxy.ip,
                        port: proxy.port
                    },
                    id,
                    video: targetURL
                } });
            workers.push({ id, worker: w });
            w.on("message", async (msg) => {
                console.log(msg.msg);
                for (let i = 0; i < workers.length; i++) {
                    let el = workers[i];
                    if (el.id === msg.id) {
                        await el.worker.terminate();
                        workers.splice(i, 1);
                        break;
                    }
                }
            });
        }
    }
})();
