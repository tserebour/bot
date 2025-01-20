// Define the BrowserFingerPrint interface
interface BrowserFingerPrint {
    id: string;
    seq?: number;
    browserId: string;
    ostype: string;
    os: string;
    version: string;
    userAgent: string;
    isIpCreateTimeZone: boolean;
    timeZone: string;
    webRTC: string;
    coreVersion: string;
    position: string;
    isIpCreatePosition: boolean;
    isIpCreateLanguage: boolean;
    resolutionType: string;
    resolution: string;
    fontType: string;
    canvas: string;
    webGL: string;
    webGLMeta: string;
    webGLManufacturer: string;
    webGLRender: string;
    audioContext: string;
    mediaDevice: string;
    clientRects: string;
    hardwareConcurrency: string;
    deviceMemory: string;
    deviceNameType: string;
    deviceName: string;
    doNotTrack: string;
    flash: string;
    portScanProtect: string;
    portWhiteList: string;
    isDelete: number;
    colorDepth: number;
    devicePixelRatio: number;
    createdBy: string;
    createdTime: string;
    updateBy: string;
    updateTime: string;
  }
  
  // Extend the BrowserUpdateRequest interface to include BrowserFingerPrint
  interface BrowserProfile {
    platform: string;
    platformIcon: string;
    url: string;
    name: string;
    remark: string;
    userName: string;
    password: string;
    proxyMethod: number;
    proxyType: "noproxy" | "http" | "https" | "socks5" | "ssh";
    browserFingerPrint: BrowserFingerPrint;
    abortImage?: boolean;
    stopWhileNetError?: boolean;
    dynamicIpUrl?: string;
    dynamicIpChannel?: string;
    isDynamicIpChangeIp?: boolean;
    syncTabs?: boolean;
    syncCookies?: boolean;
    syncIndexedDb?: boolean;
    syncBookmarks?: boolean;
    syncAuthorization?: boolean;
    syncHistory?: boolean;
    ipCheckService?: string;
    allowedSignin?: boolean;
    clearCacheFilesBeforeLaunch?: boolean;
    clearCookiesBeforeLaunch?: boolean;
    clearHistoriesBeforeLaunch?: boolean;
    randomFingerprint?: boolean;
    disableGpu?: boolean;
    muteAudio?: boolean;
    abortMedia?: boolean;
    workbench?: string;
    isIpv6?: boolean;
    isGlobalProxyInfo?: boolean;
    syncExtensions?: boolean;
    syncUserExtensions?: boolean;
    credentialsEnableService?: boolean;
    syncLocalStorage?: boolean;
    refreshProxyUrl?: string;
    isValidUsername?: boolean;
    disableTranslatePopup?: boolean;
    abortImageMaxSize?: number;
    stopWhileIpChange?: boolean;
    stopWhileCountryChange?: boolean;
    disableNotifications?: boolean;
    disableClipboard?: boolean;
    host?: string,
    proxyUserName?: string;
    port?: number
    proxyPassword?: string;
  }
  