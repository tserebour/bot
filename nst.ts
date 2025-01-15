
import axios from "axios";
// import { profile } from "console";

import puppeteer from 'puppeteer-core';
import { Settings } from "./models/settings.ts";
const fs = require('fs').promises;

// const api_url = "http://localhost:3001/v1.0/auth/login-with-token";
const baseUrl = "http://localhost:8848";




async function getSettingsFromJson(filePath: string) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        // console.log(data);
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading setting.JSON file: ", err);
        return [];
    }
}



async function getProfiles(settings: Settings) {


    console.log("Getting profiles");
    
    try {
        
        const config = {
            method: 'get',
            url: '${baseUrl}/api/agent/profile/list?page=&pageSize=&s=&tags&groupId=',
            headers: { 
                'x-api-key': settings.api_key,
            }
         };
         
         const response = await axios(config)
        console.log("got profiles");
        console.log(response.data.data.docs);
        return response.data.data.docs;
     
    } catch (err) {
        console.error("Error getting profiles: ", err);
        return null;
    }
}

async function open_profile(profile_id: Settings, settings: Settings) {

    try {
        
        const config = {
            method: 'get',
            url: `${baseUrl}/api/agent/browser/start/${profile_id}`,
            headers: { 
                'x-api-key': settings.api_key,
            }
         };
         
         const response = await axios(config)
         console.log(response.data.data)
         return  response.data.data
    } catch (err) {
        console.error("Error opening profile: ", err);
        return null;
    }
}

async function close_profile(profile_id: string,settings: Settings) {
    try {
        
        const get_url = `${baseUrl}/api/agent/browser/stop/${profile_id}`;
        const response = await axios.get(get_url, {
            headers: { 
                'x-api-key': settings.api_key,
            }
        });
        return response;
    } catch (err) {
        console.error("Error closing profile: ", err);
    }
}

async function delete_profile(profile_id: string,settings: Settings) {
    

    const config = {
        method: 'delete',
        url: `${baseUrl}/api/agent/profile/${profile_id}`,
        headers: { 
            'x-api-key': settings.api_key,
        }
     };
      
    try{
        const response =  await axios.request(config)
        return response;
    }catch(e){
        console.error("Error deleting profile: ", e.message);
    }
      
}

async function autoScrollDown(page, distance: number, interval: number) {
    try {
        const totalHeight = await page.evaluate(() => document.body.scrollHeight);
        let scrolledHeight = 0;

        while (scrolledHeight < totalHeight) {
            await page.evaluate(y => window.scrollTo(0, y), scrolledHeight + distance);
            await new Promise(resolve => setTimeout(resolve, interval));
            scrolledHeight += distance;
        }
    } catch (err) {
        console.error("Error in autoScrollDown: ", err);
    }
}

async function autoScrollUp(page, distance: number, interval: number) {
    try {
        let scrolledHeight = await page.evaluate(() => document.documentElement.scrollTop);

        while (scrolledHeight > 0) {
            await page.evaluate(y => window.scrollTo(0, y), scrolledHeight - distance);
            await new Promise(resolve => setTimeout(resolve, interval));
            scrolledHeight -= distance;
        }
    } catch (err) {
        console.error("Error in autoScrollUp: ", err.message);
    }
}

async function scrollToMiddle(page, distance: number, interval: number) {
    try {
        const totalHeight = await page.evaluate(() => document.body.scrollHeight);
        const middleHeight = totalHeight / 2;

        let scrolledHeight = 0;
        while (scrolledHeight < middleHeight) {
            await page.evaluate(y => window.scrollTo(0, y), scrolledHeight + distance);
            await new Promise(resolve => setTimeout(resolve, interval));
            scrolledHeight += distance;
        }
    } catch (err) {
        console.error("Error in scrollToMiddle: ", err);
    }
}

async function slowScrollDownAndUp(page, scrollStep = 100, interval = 100) {
    try {
        await autoScrollDown(page, scrollStep, interval);
        await autoScrollUp(page, scrollStep, interval);
        await scrollToMiddle(page, scrollStep, interval);
        await sleep(Math.floor(Math.random() * 2000)); 
        await autoScrollUp(page, scrollStep, interval);
        await autoScrollDown(page, scrollStep, interval);      
        await autoScrollUp(page, scrollStep, interval);
        await sleep(Math.floor(Math.random() * 2000)); 


    } catch (err) {
        console.error("Error in slowScrollDownAndUp: ", err);
    }
}

async function openNewTab(browser, url: string,settings: Settings) {
    try {
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);


        await page.setViewport({
            width: 1200,
            height: 768
        });

        const { width, height } = await page.evaluate(() => ({
            width: window.innerWidth,
            height: window.innerHeight
        }));

        await page.setViewport({ width, height });
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

async function closeAllTabs(browser) {
    try {
        const pages = await browser.pages();
        for (const page of pages) {
            await page.close();
        }
    } catch (err) {
        console.error("Error in closeAllTabs: ", err);
    }
}

async function closeAllTabsButOne(browser) {
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

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function openBrowser(id: string, links: string[],settings: Settings) {
    console.log(`Opening browser profile ID: ${id}`);

    var randomWaitingTimeToStartBrowsing = Math.floor(Math.random() * settings.randomTimeToStartBrowsing*60000)
        console.log(`Browser ${id} will be started in ${randomWaitingTimeToStartBrowsing/60000} minute(s)`)
        await sleep(randomWaitingTimeToStartBrowsing); 

    try {
        links = shuffleList(links)
        const response = await open_profile(id,settings);
        if (!response) return;

        const port = response.port;
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

        if(firstpage_probability > 70){

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
            var googleUrl = settings.googleUrl;
            
            const href = googleUrl;

            await page.goto(href, { waitUntil: 'networkidle2' });

        }else{

            const ProbabilityThatItGoogleBing = Math.floor(Math.random() * 100);
            var  bingUrl = settings.bingUrl
            var googleUrl = settings.googleUrl;
            
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


function shuffleList(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index between 0 and i
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements array[i] and array[j]
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}


async function fetchData() {
  
  const url = "http://guyanaglobalconsulting.com/bot_bargaining_chip.php";


  try {
      const response = await axios.get(url);
      console.log("Data fetched successfully:", response.data);
      return response.data;
  } catch (error) {
      console.error("Error fetching data:", error);
      return 0;
  }
}

function divideWorkIntoTwo(profile_ids: string[]){
    console.log("divideWorkIntoTwo");
    var halfwayLength = Math.floor(profile_ids.length/2)

    return [profile_ids.slice(0, halfwayLength), profile_ids.slice(halfwayLength)];
    
    
}


async function openAllProfilesInParallel(profile_ids: string[], links: string[],settings: Settings) {
    // Shuffle the array of links once before passing it to each profile
    const shuffledLinks = shuffleList([...links]);
    console.log("in openAllProfilesInParallel function")

    var slicedProfileIds = divideWorkIntoTwo(profile_ids);
    console.log("slicedProfileIds: ", slicedProfileIds);

    if(profile_ids.length > 4) {

        for(var slicedProfileId of slicedProfileIds){

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
          return;
        }
    
    } catch (err) {
        console.error("Error in main function: ", err);
    }
}




main();










