# YouTube-ViewBot
YouTube view bot. Supports multiple proxy tunneling, parallel task execution and lightweight

#### Features
- Inbuilt proxy scraper
- Inbuilt rapid proxy checker
- Option to use custom proxies, rather than the proxies from the scraper
- Concurrency
- Lightweight

#### How does it work
> When you start this CLI tool, it will scrape proxies, and check those scraped proxies for maximum 1 minute straight.
> You can also use custom proxies instead of the proxies from the inbuilt scraper.
>
> When the threads start, it distributes 5 parallel workers for the chromedriver bot. It'll use the scanned working proxies for tunneling.
> It runs a rate of maximum 5 concurrent running workers, when one is freed, it immediately starts a new worker.

# Note
YouTube does not update their view count immediately. Before judging, consider view botting 5 hours long, and look at the views one day later.
> **This tool is innovted to be very unique, lightweight and concurrent at the same time. Although it is not throughoutly tested**

# Usage
```<bin -h```
