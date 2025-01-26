import { Settings } from "../models/settings.ts";
import { blockRequest } from "../helper_functions/page_helper_functions.ts";
import { slowScrollDownAndUp } from "./page_helper_functions.ts";
import { shuffleList, sleep } from "./random_helper_functions.ts";
import puppeteer from 'puppeteer-core';
import { close_profile, delete_profile, open_profile } from "../bitb_helper_functions/profile_helper_functions.ts";


async function openBrowser(id: string, links: string[],settings: Settings) {
    console.log(`Opening browser profile ID: ${id}`);

    const randomWaitingTimeToStartBrowsing = Math.floor(Math.random() * settings.randomTimeToStartBrowsing*60000)
    console.log(`Browser ${id} will be started in ${randomWaitingTimeToStartBrowsing/60000} minute(s)`)
    await sleep(randomWaitingTimeToStartBrowsing); 

    try {
        links = shuffleList(links)
        const response = await open_profile(id,settings);
        if (!response) return;

        // const port = response.port;
        const browserWSEndpoint = response.ws;
        console.log(browserWSEndpoint)

        
         

        const browser = await puppeteer.connect({
            browserWSEndpoint: browserWSEndpoint,
            defaultViewport: null,
          });

        // enough time for all the extensions to  load 
        await sleep(Math.floor(Math.random() * 30000));


        await closeAllTabsButOne(browser)


        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);
        // await page.setViewport({ width: 1200, height: 768 });
        if(settings.block_black_list){
            blockRequest(page, settings.black_list)
        }



        //it might run all the browsers in parallel
        // this statement is to make sure that if the browser is running in parallel
        // they won't all run at same time and at least separately

        
        


        
        const firstpage_probability = Math.floor(Math.random() * 100);

        if(firstpage_probability > 90){

            await page.goto('https://www.google.com', { waitUntil: 'networkidle2' });
             await sleep(Math.floor(Math.random() * 2000)); 
            

        //random number between 200 500

            const typing_speed = Math.floor(Math.random() * 100) + 300;


            await page.type('#APjFqb', settings.googleSearchWords, {delay: typing_speed});
               await sleep(Math.floor(Math.random() * 1000)); 
            
            await Promise.all([
                page.keyboard.press('Enter'),
                page.waitForNavigation({ waitUntil: 'networkidle2' })
            ]);

            // const ProbabilityThatItGoogleBing = Math.floor(Math.random() * 100);
            // var  bingUrl = "https://www.bing.com/ck/a?!&&p=5a6c3a945ff62b6fJmltdHM9MTcyNDM3MTIwMCZpZ3VpZD0wMGY5Zjc3YS1kYmQzLTZkMzktMGZlZC1lMzllZGEzZTZjZjEmaW5zaWQ9NTE4MA&ptn=3&ver=2&hsh=3&fclid=00f9f77a-dbd3-6d39-0fed-e39eda3e6cf1&u=a1aHR0cHM6Ly9tZXRhbHdvcmtpbmdwcm8uY29tL2Jsb2cv&ntb=1"
            const googleUrl = settings.googleUrl;
            
            const href = googleUrl;

            await page.goto(href, { waitUntil: 'networkidle2' });

        }else{

            const ProbabilityThatItGoogleBing = Math.floor(Math.random() * 100);
            const  bingUrl = settings.bingUrl
            const googleUrl = settings.googleUrl;
            
            const href = ProbabilityThatItGoogleBing < 15 ? bingUrl : googleUrl;

            await page.goto(href, { waitUntil: 'networkidle2' });

        }

        
        await sleep(Math.floor(Math.random() * 2000));
        

        const scrollStep = 100;
        const randomScrollStep = Math.floor(Math.random() * scrollStep) + 100;
        const randomScrollTimeInterval = Math.floor(Math.random() * 100) + settings.scroll_speed;

        await slowScrollDownAndUp(page, randomScrollStep, randomScrollTimeInterval);

        for (const link of links) {
            console.log(`Opening link:   ${link} in browser profile ${id}`)
            await openNewTab(browser, link, settings);
        }

        await closeAllTabs(browser);
        await close_profile(id,settings);
        if(settings.delete_profiles_after){
            await delete_profile(id, settings);
        }
        await browser.close();

    } catch (err) {
        console.error("Error in openBrowser: ", err);
    }
}

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