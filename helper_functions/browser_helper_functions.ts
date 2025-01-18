import { Settings } from "../models/settings.ts";
import { blockRequest } from "../helper_functions/page_helper_functions.ts";
import { slowScrollDownAndUp } from "./page_helper_functions.ts";
import { sleep } from "./random_helper_functions.ts";

export async function openNewTab(browser, url: string,settings: Settings) {
    try {
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);


        // await page.setViewport({
            // width: 1200,
            // height: 768
        // });

        const { width, height } = await page.evaluate(() => ({
            width: window.innerWidth,
            height: window.innerHeight
        }));

        await page.setViewport({ width, height });

        if(settings.block_black_list){
            blockRequest(page, settings.black_list)
        }


        await page.goto(url, { waitUntil: 'networkidle2' });

        await sleep(Math.floor(Math.random() * 2000));

        const scrollStep = 100;
        const randomScrollStep = Math.floor(Math.random() * scrollStep) + 100;
        const randomScrollTimeInterval = Math.floor(Math.random() * 100) + settings.scroll_speed;

        await slowScrollDownAndUp(page, randomScrollStep, randomScrollTimeInterval);
        return page;
    } catch (err) {
        console.error("Error in openNewTab: ", err);
        return null;
    }
}

export async function closeAllTabs(browser) {
    try {
        const pages = await browser.pages();
        for (const page of pages) {
            await page.close();
        }
    } catch (err) {
        console.error("Error in closeAllTabs: ", err);
    }
}

export async function closeAllTabsButOne(browser) {
    try {
        const pages = await browser.pages();
        pages.shift()
        for (const page of pages) {
            await page.close();
        }
    } catch (err) {
        console.error("Error in closeAllTabs: ", err);
    }
}