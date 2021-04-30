const puppeteer = require("puppeteer");
const db = require("../config.json").offers;
const NEW_QUERY_PARAM = "f_new=true";

const delay = (timeout) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });

const openPage = async (browser, url) => {
const page = await browser.newPage();
await page.setExtraHTTPHeaders({
    "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
});
await page.setDefaultNavigationTimeout(0);
await page.goto(url, { waitUntil: "networkidle0" });
return page;
};

const getPrices = async (page) =>
await page.$$eval("span.olpOfferPrice", (elements) =>
elements.map((element) =>
    Number(element.innerHTML.replace(/[^0-9.-]+/g, ""))
)
);

const isProductAvailable = async (page, site) => {
try {
    const prices = await getPrices(page);
    for (const price of prices) {
        if (price <= site.maxPrice) {
            // prevent notification spam
            if (site.isProductAvailable) {
                return false;
            }
            site.isProductAvailable = true;
                return true;
        }
    }
} catch (err) {
    console.log(err);
}

site.isProductAvailable = false;
return false;
};

const createPages = async (browser) => {
for (const site of db) {
    const page = await openPage(
    browser,
    `${OFFER_LISTING}/${site.offerListing}?${NEW_QUERY_PARAM}`
    );
    site.page = page;
    site.isProductAvailable = false;
}
};

const refreshPages = async (message) => {
for (const site of db) {
    page = site.page;
    await page.reload({ waitUntil: "networkidle0" });
    const isAvailable = await isProductAvailable(page, site);
    if (isAvailable) {
    message.channel.send(
        `@&${90182872316510208} ${site.name} is in stock - ${OFFER_LISTING}/${site.offerListing}`
    );
    }
}
};

const start = async (message) => {
// debug
// const browser = await puppeteer.launch({devtools: true});

// UNIX
// const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-extensions'], executablePath: '/usr/bin/chromium-browser'});

// Windows headless
const browser = await puppeteer.launch();

await createPages(browser);

while (true) {
    await refreshPages(message);
    await delay(10000);
}
};
module.exports.start = start