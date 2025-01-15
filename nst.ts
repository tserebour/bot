

// import { profile } from "console";

import puppeteer from 'puppeteer-core';
import { Settings } from "./models/settings.ts";
import { divideWorkIntoTwo, fetchData, getSettingsFromJson, shuffleList, sleep } from "./helper_functions/random_helper_functions.ts";
import { close_profile, delete_profile, getProfiles, open_profile } from "./helper_functions/profile_helper_functions.ts";
import { closeAllTabs, closeAllTabsButOne, openNewTab } from "./helper_functions/browser_helper_functions.ts";
import { slowScrollDownAndUp } from "./helper_functions/page_helper_functions.ts";



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
        const browserWSEndpoint = response.webSocketDebuggerUrl;
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
        await page.setViewport({ width: 1200, height: 768 });



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










async function openAllProfilesInParallel(profile_ids: string[], links: string[],settings: Settings) {
    // Shuffle the array of links once before passing it to each profile
    const shuffledLinks = shuffleList([...links]);
    console.log("in openAllProfilesInParallel function")

    const slicedProfileIds = divideWorkIntoTwo(profile_ids);
    console.log("slicedProfileIds: ", slicedProfileIds);

    if(profile_ids.length > 4) {

        for(const slicedProfileId of slicedProfileIds){

            // Map each profile ID to a promise that runs openBrowser
            const tasks = slicedProfileId.map(id => openBrowser(id, shuffledLinks, settings));
    
            // Run all tasks concurrently
            await Promise.all(tasks);
            
        }

    }else{
        

            // Map each profile ID to a promise that runs openBrowser
            const tasks = profile_ids.map(id => openBrowser(id, shuffledLinks, settings));
    
            // Run all tasks concurrently
            await Promise.all(tasks);
            
        
    }

    

    
}






async function main() {
    try {

        if(await fetchData() == 1){

            const settings = await getSettingsFromJson("./setting.json");
            const shuffleAr = shuffleList(settings.links);
            const profiles_response = await getProfiles(settings);
            if (!profiles_response) return;

            const profiles = profiles_response;
            const profile_ids = profiles.map(profile => profile.profileId);

            // const probabilityToRunInParallelOrSeries = Math.floor(Math.random() * 100);

            
                console.log("Running all profiles in parallel");

                openAllProfilesInParallel(profile_ids,shuffleAr,settings)
                

        }else{
            console.log("connect to internet")
          return;
        }
    
    } catch (err) {
        console.error("Error in main function: ", err);
    }
}




main();










