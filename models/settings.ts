export interface Settings {
    number_of_links: number;
    create_profiles: boolean;
    number_of_profiles_to_be_created: number;
    delete_profiles_after: boolean;
    block_black_list: boolean;
    black_list: string[];
    api_key: string;
    bingUrl: string;
    googleUrl: string;
    googleSearchWords: string;
    scroll_speed: number;
    randomTimeToStartBrowsing: number;
    links: string[];
    host: string;
    port: number;
    proxyUserName: string;
    proxyPassword: string;
}