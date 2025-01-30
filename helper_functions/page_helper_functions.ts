import { sleep } from "./random_helper_functions.ts";

export async function autoScrollDown(page, distance: number, interval: number) {
    try {
        const totalHeight = await page.evaluate(() => document.body.scrollHeight);
        let scrolledHeight = 0;

        while (scrolledHeight < totalHeight) {
            await page.evaluate(y => window.scrollTo(0, y), scrolledHeight + distance);
            const moreRandomInterval = interval+ Math.floor(Math.random()* (0.5*interval))
            await new Promise(resolve => setTimeout(resolve, moreRandomInterval));
            scrolledHeight += distance;
        }
    } catch (err) {
        console.error("Error in autoScrollDown: ", err);
    }
}

export async function autoScrollUp(page, distance: number, interval: number) {
    try {
        let scrolledHeight = await page.evaluate(() => document.documentElement.scrollTop);

        while (scrolledHeight > 0) {
            await page.evaluate(y => window.scrollTo(0, y), scrolledHeight - distance);
            const moreRandomInterval = interval+ Math.floor(Math.random()* (0.5*interval))
            await new Promise(resolve => setTimeout(resolve, moreRandomInterval));
            scrolledHeight -= distance;
        }
    } catch (err) {
        console.error("Error in autoScrollUp: ", err);
    }
}

export async function scrollToMiddle(page, distance: number, interval: number) {
    try {
        const totalHeight = await page.evaluate(() => document.body.scrollHeight);
        const middleHeight = totalHeight / 2;

        let scrolledHeight = 0;
        while (scrolledHeight < middleHeight) {
            await page.evaluate(y => window.scrollTo(0, y), scrolledHeight + distance);
            const moreRandomInterval = interval+ Math.floor(Math.random()* (0.5*interval))
            await new Promise(resolve => setTimeout(resolve, moreRandomInterval));
            scrolledHeight += distance;
        }
    } catch (err) {
        console.error("Error in scrollToMiddle: ", err);
    }
}

export async function slowScrollDownAndUp(page, scrollStep = 100, interval = 100) {
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



export async function blockRequest(page,blacklist:string[]) {
    await page.setRequestInterception(true);

    page.on("request", (request) => {
        const url = request.url();
    
        if (blacklist.some((blockedUrl) => url.startsWith(blockedUrl))) {
          console.log(`Blocked: ${url}`);
          request.abort(); // Block the request
        } else {
          request.continue(); // Allow other requests
        }
      });
    
}