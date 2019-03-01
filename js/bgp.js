/**
 * 监听网络请求
 */
chrome.webRequest.onCompleted.addListener(function(details) {
        //Request URL: https://m.douban.com/rexxar/api/v2/gallery/topic/54054/items?sort=hot&start=0&count=20&status_full_text=1&guest_only=0&ck=q6_u
        console.log(JSON.stringify(details));
        chrome.runtime.sendMessage('onCompleted', function(response){
            console.log("onCompleted");
        });
    },
    {urls: [ "https://m.douban.com/rexxar/api/v2/gallery/topic/*" ]}
);