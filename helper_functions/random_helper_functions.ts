
import axios from "axios";


export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  export function divideWorkIntoTwo(profile_ids: string[]){
      console.log("divideWorkIntoTwo");
      const halfwayLength = Math.floor(profile_ids.length/2)
  
      return [profile_ids.slice(0, halfwayLength), profile_ids.slice(halfwayLength)];
      
      
  }
export function shuffleList(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index between 0 and i
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements array[i] and array[j]
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

export function getRandomDistinctElements<T>(array: T[]): T[] {
    if (array.length < 3) {
      return array;
    }
  
    const shuffledArray = [...array].sort(() => Math.random() - 0.5);
    return shuffledArray.slice(0, 3);
  }

export async function fetchData() {
  
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

export async function getSettingsFromJson(filePath: string) {
    try {
        const data = await Deno.readTextFile(filePath, 'utf-8');
        // console.log(data);
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading setting.JSON file: ", err);
        return {};
    }
}


export function randomlySelectLinks(links:string[], n: number){
    let extractedLinks: string[] = [];

    if(n >= links.length){
        extractedLinks = links
    }else{
        while (extractedLinks.length < n) {
            const randomSelectedIndex = Math.floor(Math.random() * links.length);
            
            if(randomSelectedIndex < links.length){
                extractedLinks.push(
                    links[randomSelectedIndex]
                )
    
                
               links =  links.filter(function(item){
                    return item !== links[randomSelectedIndex]
                })
                  
    
    
            }
    
        }
    }
    
      
    console.log("Random links =")
    console.log(extractedLinks) 

    return extractedLinks;


}
        // they won't all run at same time and at least separately


export async function listJsonFiles(folderUrl: string): Promise<string[]> {
    try {
      const files: string[] = [];
      for await (const entry of Deno.readDir(folderUrl)) {
        if (entry.isFile && entry.name.endsWith(".json")) {
          files.push(entry.name);
        }
      }
      return files;
    } catch (error) {
      console.error("Error reading directory:", error);
      return [];
    }
  }


  