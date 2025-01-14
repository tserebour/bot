
const axios = require("axios");
const { profile } = require("console");

const puppeteer = require('puppeteer-core');
const fs = require('fs').promises;

const api_url = "http://localhost:3001/v1.0/auth/login-with-token";
// const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiN2ZhYTgzYjE5ZTU5NjEzNDIzYTdhNDEwNDBlMzg2YjliZjY5ZDNiMjFkOWI4ZDk3ODFiZTJkMzZkMmY0MmE1Yzg5OGM3NTUxM2U3NWFhOGQiLCJpYXQiOjE3MjQzNDExMDUuMTQ4NTY3LCJuYmYiOjE3MjQzNDExMDUuMTQ4NTcsImV4cCI6MTc1NTg3NzEwNS4xMzkwNjQsInN1YiI6IjM2NzU1NjAiLCJzY29wZXMiOltdfQ.YqT6Fnk2MKHzdba3w_6lTsR93pyyl6VBOA_6wYIg8lWFsMt_iRUdkjaUAQ1ooYNkVvNu9CJX4j_bjUgO_FF8tL4vghpsiEvwC6vQYkvIktaZDj6Djt9bnFomaEBwqIJlWXlV7PsEa783T1FvY4vlQkBA0psFzwNYrTcalGpWPpNf1oaTa1fZuFQ1QlK3cWAhNgC-cVX9eXKACQKLiQjEJP7DXx-6JcuoJz2tWvUUJt0GUcHp3mtpIlA4aGYZynSMyOJk4qCLSyBxNaCw3ul2hKPbTYlnr_u7yiGm1Vh6bZhXME665P_RnrkXuWklp1VuSSbxVlvX5qaXInSOx7Rb_smdcOBtXEIdbRv9EXeROh2qP3vT2b2VCFzFS2zLTwyuNklSlDD3_bV2eX3TgPEpkvp0pYH-ADnbnb4Et15IgL9-xsBnHNfeFuqPKQJQQf_bJ90lB0jp9DMXwjAJZ7tZ-vlZSKwsDSp0UySPtVfYGFD3qbc9VnGOzi5owvOpCcJvrKRh7zybBbJYz-krXibj0QCo7dGdR_eo7eWJDEMjyQQ6gS28Z-SDUGjvRV21kqALVXfnXXShFZU3Oqfg7npDOimq0U0DucB-D6syyKpq6HtZgIs_W8d8pO-RMY2rHt9kZGJnaTgEW6Z883rqP6ogLyN5lbMpNvCBVELtB58ZLks"

// const request_data = { token: token };

// async function login() {
//     try {
//         const response = await axios.post(api_url, request_data, {
//             headers: { 'Content-Type': 'application/json' }
//         });
//         console.log("hello: ", response.data);
//     } catch (err) {
//         console.error("Login error: ", err.message);
//     }
// }


async function getSettingsFromJson(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        // console.log(data);
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading setting.JSON file: ", err.message);
        return [];
    }
}



async function getProfiles(settings) {


    console.log("Getting profiles");
    
    try {
        var token = settings.api_key;
        var config = {
            method: 'get',
            url: 'http://localhost:8848/api/agent/profile/list?page=&pageSize=&s=&tags&groupId=',
            headers: { 
                'x-api-key': token,
            }
         };
         
         axios(config)
        console.log("got profiles");
        return JSON.stringify(response.data)
     
    } catch (err) {
        console.error("Error getting profiles: ", err.message);
        return null;
    }
}

async function open_profile(profile_id, settings) {

    try {
        var token = settings.api_key;
        var config = {
            method: 'get',
            url: `http://localhost:8848/api/agent/${profile_id}/start/`,
            headers: { }
         };
         
         return await axios(config)
    } catch (err) {
        console.error("Error opening profile: ", err.message);
        return null;
    }
}

async function close_profile(profile_id,settings) {
    try {
        var token = settings.api_key;
        const get_url = `http://localhost:3001/v1.0/browser_profiles/${profile_id}/stop`;
        const response = await axios.get(get_url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (err) {
        console.error("Error closing profile: ", err.message);
    }
}

async function delete_profile(profile_id, settings) {
    let data = "";
    var token = settings.api_key;

    let config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: `https://dolphin-anty-api.com/browser_profiles/${profile_id}?forceDelete=1`,
        headers: {
            'Authorization': `Bearer ${token}`,
         },
        data : data
      };
      
      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
}

async function autoScrollDown(page, distance, interval) {
    try {
        const totalHeight = await page.evaluate(() => document.body.scrollHeight);
        let scrolledHeight = 0;

        while (scrolledHeight < totalHeight) {
            await page.evaluate(y => window.scrollTo(0, y), scrolledHeight + distance);
            await new Promise(resolve => setTimeout(resolve, interval));
            scrolledHeight += distance;
        }
    } catch (err) {
        console.error("Error in autoScrollDown: ", err.message);
    }
}

async function autoScrollUp(page, distance, interval) {
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

async function scrollToMiddle(page, distance, interval) {
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
        console.error("Error in scrollToMiddle: ", err.message);
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
        console.error("Error in slowScrollDownAndUp: ", err.message);
    }
}

async function openNewTab(browser, url,settings) {
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
        console.error("Error in openNewTab: ", err.message);
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
        console.error("Error in closeAllTabs: ", err.message);
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
        console.error("Error in closeAllTabs: ", err.message);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function openBrowser(id, links,settings) {
    console.log(`Opening browser profile ID: ${id}`);

    var randomWaitingTimeToStartBrowsing = Math.floor(Math.random() * settings.randomTimeToStartBrowsing)
        console.log(`Browser ${id} will be started in ${randomWaitingTimeToStartBrowsing/60000} minute(s)`)
        await sleep(randomWaitingTimeToStartBrowsing); 

    try {
        links = shuffleList(links)
        const response = await open_profile(id,settings);
        if (!response) return;

        const port = response.port;
        const wsEndpoint = response.wsEndpoint;

        
         

        const browser = await puppeteer.connect({
            browserWSEndpoint: `ws://127.0.0.1:${port}${wsEndpoint}`
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
        console.error("Error in openBrowser: ", err.message);
    }
}


function shuffleList(array) {
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
      console.error("Error fetching data:", error.message);
      return 0;
  }
}

function divideWorkIntoTwo(profile_ids){
    console.log("divideWorkIntoTwo");
    var halfwayLength = Math.floor(profile_ids.length/2)

    return [profile_ids.slice(0, halfwayLength), profile_ids.slice(halfwayLength)];
    
    
}


async function openAllProfilesInParallel(profile_ids, links,settings) {
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

            const profiles = profiles_response.data;
            const profile_ids = profiles.map(profile => profile.id);

            const probabilityToRunInParallelOrSeries = Math.floor(Math.random() * 100);

            
                console.log("Running all profiles in parallel");

                openAllProfilesInParallel(profile_ids,shuffleAr,settings)
                


            

            



            

        }else{
          return;
        }
    
    } catch (err) {
        console.error("Error in main function: ", err.message);
    }
}




main();










