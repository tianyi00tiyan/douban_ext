const BG = chrome.extension.getBackgroundPage(); //获得BG
const ALL_TABS = true; //是否所有的tab都要通知

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
    //绑定BG.canUseBtn点击事件
    $('#canUseBtn').on('click', function (evt) {
        BG.canUse = !BG.canUse;
        BG.sendMessage("BG.canUse", BG.canUse, ALL_TABS);
        render();
    })

    //绑定ratioBtn点击事件
    $('#ratioBtn').on('click', function (evt) {
        console.log("ratioBtn");
        BG.curRatio = BG.curRatio == BG.HD ? BG.FHD : BG.HD;
        BG.sendMessage("BG.curRatio", BG.curRatio, ALL_TABS);
        render();
    })
}

/**
 * 更新页面
 */
function render() {
    $('#canUseBtn').html(BG.canUse == false ? "启用" : "禁用");
    $('#ratioBtn').html(BG.curRatio == BG.HD ? "启用" : "禁用");
}

/**
 * 入口函数
 */
function popup() {
    init();
    bindEvent();
}

popup();

