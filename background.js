const videoLinks = {};

chrome.webRequest.onCompleted.addListener((details) => {
    const { tabId, url } = details;
    if (tabId < 0 || !url.match(/\.(mp4|webm|ogg|m3u8|mpd)/i)) {
        return;
    }
    if (!videoLinks[tabId]) videoLinks[tabId] = [];
    if (!videoLinks[tabId].some(item => item.url === url)) {
        videoLinks[tabId].push({url: url});
    }
}, {
    urls: ["<all_urls>"],
    types: ["media", "xmlhttprequest"]
});

chrome.tabs.onRemoved.addListener(tabId => delete videoLinks[tabId]);
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === "loading") delete videoLinks[tabId];
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getVideos") {
        sendResponse(videoLinks[message.tabId] || []);
    }
});
