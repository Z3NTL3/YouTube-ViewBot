"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = void 0;
const node_child_process_1 = __importDefault(require("node:child_process"));
const undici_1 = require("undici");
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
class ProxyChecker_Launcher {
    path = process.env["proxy_checker_bin"];
    constructor(path) {
        if (!(path === "")) {
            this.path = path;
        }
    }
    scrape() {
        return new Promise(async (resolve, reject) => {
            let req = await (0, undici_1.request)(process.env['api']);
            if (req.statusCode !== 200) {
                return reject(`status code not 200 but ${req.statusCode}`);
            }
            let bodyStr = await req.body.text();
            node_fs_1.default.writeFileSync(node_path_1.default.join(node_path_1.default.dirname(this.path), "proxies.txt"), bodyStr, {
                mode: "0755",
                flag: "w"
            });
            resolve(true);
        });
    }
    startChecking(args, killer) {
        return new Promise((resolve, reject) => {
            node_child_process_1.default.execFile(this.path, [...args], {
                cwd: node_path_1.default.dirname(this.path),
                killSignal: "SIGKILL",
                //uid: 0,
                encoding: "utf8",
                signal: killer.signal,
                maxBuffer: 10_000_000
            }, (err, stdout, stderr) => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
            setTimeout(() => {
                killer.abort("timeout");
            }, 1000 * 60); // 1min
        });
    }
    readWorkingProxies() {
        let proxies = node_fs_1.default.readFileSync(node_path_1.default.join(node_path_1.default.dirname(this.path), "saves", "goods-http.txt"), {
            encoding: "utf8"
        });
        let list = proxies.trim().split("\n");
        let fresh = [];
        if (list[0] === '') {
            process.stderr.write("no proxies found");
            process.exit(-1);
        }
        for (var i = 0; i < list.length; i++) {
            let proxy = list[i].split(":");
            fresh.push({ ip: proxy[0].replaceAll("\r", ""), port: proxy[1].replaceAll("\r", "") });
        }
        return fresh;
    }
}
exports.default = ProxyChecker_Launcher;
