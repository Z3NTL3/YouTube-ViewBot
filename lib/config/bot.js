"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require('puppeteer');
class Bot {
    proxy;
    browser;
    initializedOnce;
    constructor(proxy) {
        this.proxy = proxy;
        this.browser = puppeteer.launch({
            headless: false,
            args: [`--headless=new`, `--proxy-server=${proxy}`],
        });
        this.initializedOnce = false;
    }
    async init() {
        if (!this.initializedOnce) {
            await this.browser;
            this.initializedOnce = true;
        }
    }
    getProxy() {
        return this.proxy;
    }
}
class YoutubeViewBot extends Bot {
    constructor(proxy) {
        super(proxy);
    }
    async navigate(video_url) {
        const browser = await this.browser;
        const page = await browser.newPage();
        await page.goto(video_url);
        await page.waitForSelector('body', {
            timeout: 10000,
        });
        const button = await page.waitForSelector('#content > div.body.style-scope.ytd-consent-bump-v2-lightbox > div.eom-buttons.style-scope.ytd-consent-bump-v2-lightbox > div:nth-child(1) > ytd-button-renderer:nth-child(2) > yt-button-shape > button > yt-touch-feedback-shape > div > div.yt-spec-touch-feedback-shape__fill', {
            timeout: 10000,
        });
        if (button !== null)
            await button.click();
    }
}
module.exports = YoutubeViewBot;
