import axios from "axios";
import { Settings } from "../models/settings.ts";

const baseUrl = "http://localhost:8848";


export async function getProfiles(settings: Settings) {


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

export async function open_profile(profile_id: string, settings: Settings) {

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

export async function close_profile(profile_id: string,settings: Settings) {
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

export async function delete_profile(profile_id: string,settings: Settings) {
    

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
        console.error("Error deleting profile: ", e);
    }
      
}