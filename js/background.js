/**
 * 需要在后台设计记录当前配置状态
 */
var HD = 1; //高清大图
var FHD = 2; //全高清大图
var curRatio = HD; //图片质量
var canUse = true; //是否使用插件

/**
 * 初始化
 */
function init() {
    //通知给前台当前canUse状态
    sendMessage("BG.canUse", canUse);

    //通知给前台当前canUse状态
    sendMessage("BG.curRatio", curRatio);
}

/**
 * 绑定事件
 */
function bindEvent() {
    /**
     * 监听网络请求和发送网络请求完毕信号
     * Request URL: https://m.douban.com/rexxar/api/v2/gallery/topic/54054/items?sort=hot&start=0&count=20&status_full_text=1&guest_only=0&ck=q6_u
     */
    chrome.webRequest.onCompleted.addListener(function(details) {
            sendMessage("BG.onCompleted");
        },
        {urls: [ "https://m.douban.com/rexxar/api/v2/gallery/topic/*" ]}
    );
}

/**
 * 向前台发送消息
 */
function sendMessage(type, value) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: type, value: value});
    });
}

/**
 * 入口函数
 */
function background() {
    init();
    bindEvent();
}

background();