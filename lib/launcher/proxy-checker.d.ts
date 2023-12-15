type ProxyH = {
    [key: string]: string;
} | {
    ip: string;
    port: string;
};
declare class ProxyChecker_Launcher {
    private path;
    constructor(path: string);
    scrape(): Promise<Boolean>;
    startChecking(args: Array<string>, killer: AbortController): Promise<void>;
    readWorkingProxies(): Array<ProxyH>;
}
export { ProxyChecker_Launcher as default, ProxyH };
