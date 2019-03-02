const HD = 1; //高清大图
const FHD = 2; //全高清大图

var curRatio = HD; //图片质量
var canUse = true; //是否使用插件

/**
 * 初始化界面
 */
function init() {
    render()
}

/**
 * 绑定事件
 */
function bindEvent() {
    //绑定canUseBtn点击事件
    $('#canUseBtn').on('click', function (evt) {
        canUse = !canUse;
        sendMessage("canUse", canUse);
        render();
    })

    //绑定ratioBtn点击事件
    $('#ratioBtn').on('click', function (evt) {
        console.log("ratioBtn");
        curRatio = curRatio == HD ? FHD : FHD;
        sendMessage("curRatio", curRatio);
        render();
    })
}

/**
 * 更新页面
 */
function render() {
    $('#canUseBtn').html(canUse == false ? "启用" : "禁用");
    $('#ratioBtn').html(curRatio == HD ? "启用" : "禁用");
}

/**
 * 发送事件
 */
function sendMessage(type, value) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: type, value: value});
    });
}

/**
 * 入口函数
 */
function popup() {
    init();
    bindEvent();
}

popup()

