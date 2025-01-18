import axios from "axios";
import { Settings } from "../models/settings.ts";

const baseUrl = "http://127.0.0.1:54345";


export async function getProfiles(settings: Settings) {


    console.log("Getting profiles");
    
    try {
        
        const config = {
            method: 'post',
            url: `${baseUrl}/browser/list`,
            headers: { 
                'x-api-key': settings.api_key,
            },
            data: {
                'page': 0,
                'pageSize': 100
            }
         };
         
         const response = await axios(config)
        console.log("got profiles");
        console.log(response.data.data.list);
        return response.data.data.list;
     
    } catch (err) {
        console.error("Error getting profiles: ", err);
        return null;
    }
}



export async function open_profile(profile_id: string, settings: Settings) {

    try {
        
        const config = {
            method: 'post',
            url: `${baseUrl}/browser/open`,
            headers: { 
                'x-api-key': settings.api_key,
            },
            data:{
                'id': profile_id
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
        
        const get_url = `${baseUrl}/browser/close`;
        const response = await axios.post(get_url, {
            headers: { 
                'x-api-key': settings.api_key,
            },
            data:{
                
                'id': profile_id            
            }
        });
        return response;
    } catch (err) {
        console.error("Error closing profile: ", err);
    }
}

export async function delete_profile(profile_id: string,settings: Settings) {
    

    const config = {
        method: 'post',
        url: `${baseUrl}/browser/delete`,
        headers: { 
            'x-api-key': settings.api_key,
        },
        data:{
            'id': profile_id
        }
    };
      
    try{
        const response =  await axios.request(config)
        return response;
    }catch(e){
        console.error("Error deleting profile: ", e);
    }
      
}