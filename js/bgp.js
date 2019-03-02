/**
 * 监听网络请求
 */
chrome.webRequest.onCompleted.addListener(function(details) {
    console.log("details")
        //Request URL: https://m.douban.com/rexxar/api/v2/gallery/topic/54054/items?sort=hot&start=0&count=20&status_full_text=1&guest_only=0&ck=q6_u
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {type: "onCompleted"});
        });
    },
    {urls: [ "https://m.douban.com/rexxar/api/v2/gallery/topic/*" ]}
);