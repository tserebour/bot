
import { Settings } from "./models/settings.ts";
import { divideWorkIntoTwo, fetchData, getSettingsFromJson, listJsonFiles, randomlySelectLinks, shuffleList } from "./helper_functions/random_helper_functions.ts";
import { createBrowser, getProfiles } from "./bitb_helper_functions/profile_helper_functions.ts";
import { BrowserProfile } from "./models/bitb_models/profile.ts";
import MyMap from "./models/map.ts";
import { Country } from "./models/country.ts";
import { openBrowser } from "./helper_functions/browser_helper_functions.ts";




const myMap = new MyMap<string,Country>();

myMap.set(
    "fr", 
    {
        name: "Français",
        language: "fr",
        region: "FR",
        country: "France",
        timezone: "Europe/Paris",
        locale: "fr_FR",
        cookie_filename: "fr.json"

    }
);

myMap.set(
    "us", {
        name: "English",
        language: "en",
        region: "US",
        country: "United States",
        timezone: "America/New_York",
        locale: "en_US",
        cookie_filename: "us.json"
    }
) 


myMap.set(
    "de", {
        name: "Deutsch",
        language: "de",
        region: "DE",
        country: "Germany",
        timezone: "Europe/Berlin",
        locale: "de_DE",
        cookie_filename: "de.json"
    }
)

myMap.set(
    "ca", {
        name: "Canadian",
        language: "fr",
        region: "CA",
        country: "Canada",
        timezone: "America/Toronto",
        locale: "fr_CA",
        cookie_filename: "ca.json"
    }
)

myMap.set(
    "au",{
        name: "English",
        language: "en",
        region: "GB",
        country: "Australia",
        timezone: "",
        locale: "en_GB",
        cookie_filename: "gb.json"
    }
)














async function openAllProfilesInParallel(profile_ids: string[], links: string[],settings: Settings) {
    // Shuffle the array of links once before passing it to each profile
    const shuffledLinks = shuffleList([...links]);
    console.log("in openAllProfilesInParallel function")
    const randomlyExtractedLinks = randomlySelectLinks(shuffledLinks, settings.number_of_links)
    

    const slicedProfileIds = divideWorkIntoTwo(profile_ids);
    console.log("slicedProfileIds: ", slicedProfileIds);

    if(profile_ids.length > 4) {

        for(const slicedProfileId of slicedProfileIds){

            // Map each profile ID to a promise that runs openBrowser
            const tasks = slicedProfileId.map(id => openBrowser(id, randomlyExtractedLinks, settings));
    
            // Run all tasks concurrently
            await Promise.all(tasks);
            
        }

    }else{
        

            // Map each profile ID to a promise that runs openBrowser
            const tasks = profile_ids.map(id => openBrowser(id, randomlyExtractedLinks, settings));
    
            // Run all tasks concurrently
            await Promise.all(tasks);
            
        
    }

    

    
}







async function createNumberOfProfiles(settings: Settings){
    const countries = [
        "us","ca","au","gb",
        "us","de","ca","gb",
        "us","ca","au","fr",
        "us","ca","au"
    ];

    


    const jsonFiles: string[] = await listJsonFiles(`${Deno.cwd()}/cookies`);

    console.log("jsonFiles: ", jsonFiles)




    for (let i = 1; i <= settings.number_of_profiles_to_be_created; i++){
        const country = myMap.get(countries[Math.floor(Math.random()*countries.length)]);
        // const allCookies = await getSettingsFromJson(`cookies/${country?.cookie_filename ?? ""}`);
        const selectedCookieUrl = jsonFiles[Math.floor(Math.random() * jsonFiles.length+1)]
        const cookie = await getSettingsFromJson(`cookies/${selectedCookieUrl ?? ""}`)

        console.log(`creating profile_${i} with a ${country?.country} proxy with ${selectedCookieUrl}` )
        
        // gw.dataimpulse.com:823:a70ef09b110946ca7233_cr.us:9cc4d201254273a7

        const browserProfile: BrowserProfile = {
            platform: "",
            platformIcon: "",
            url: "",
            name: `My ${country?.country} Browser_${i}`,
            remark: "",
            userName: "",
            password: "",
            proxyMethod: 2,
            proxyType: "https",
            host: settings.host,
            port: settings.port,
            proxyUserName: `${settings.proxyUserName}__cr.${country?.region.toLowerCase()}`,
            proxyPassword: settings.proxyPassword,
            cookie: JSON.stringify(cookie),
            browserFingerPrint: {
              id: "",
              browserId: "",
              ostype: "",
              os: "",
              coreVersion: "130",
              version: "",
              userAgent: "",
              isIpCreateTimeZone: true,
              timeZone: "",
              webRTC: "0",
              position: "1",
              isIpCreatePosition: true,
              isIpCreateLanguage: true,
              resolutionType: "0",
              resolution: "",
              fontType: "0",
              canvas: "0",
              webGL: "0",
              webGLMeta: "0",
              webGLManufacturer: "",
              webGLRender: "",
              audioContext: "0",
              mediaDevice: "0",
              clientRects: "0",
              hardwareConcurrency: "",
              deviceMemory: "",
              deviceNameType: "",
              deviceName: "",
              doNotTrack: "",
              flash: "",
              portScanProtect: "",
              portWhiteList: "",
              isDelete: 0,
              colorDepth: 32,
              devicePixelRatio: 1.2,
              createdBy: "",
              createdTime: "",
              updateBy: "",
              updateTime: "",
            },
            abortImage: false,
            stopWhileNetError: true,
          };
        
          try {
            await createBrowser(browserProfile);
            // console.log("API Response:", response);
          } catch (error) {
            console.error("Error:", error);
          }

    }
    
}






async function main() {
    try {
        

        if(await fetchData() == 1){

            const settings = await getSettingsFromJson("./setting.json");
            const shuffleAr = shuffleList(settings.links);
            if(settings.create_profiles){
                await createNumberOfProfiles(settings)
            }
            const profiles_response = await getProfiles(settings);


            
            if (!profiles_response) return;

            const profiles = profiles_response;
            const profile_ids = profiles.map(profile => profile.id);

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













