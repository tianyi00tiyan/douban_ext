/**
 * 需要在后台设计记录当前配置状态
 */
// var HD = 1; //高清大图
// var FHD = 2; //全高清大图
// var curRatio = HD; //图片质量
var canUse = true; //是否使用插件

/**
 * 绑定事件
 */
function bindEvent() {
  /**
   * 监听网络请求和发送网络请求完毕信号
   * Request URL: https://item.jd.com/100012014970.html
   */
  chrome.webRequest.onCompleted.addListener(
    function (details) {
      //通知给前台当前canUse状态
      sendMessage('BG.canUse', canUse);

      //通知给前台当前curRatio状态
      // sendMessage('BG.curRatio', curRatio);

      //通知加载完毕
      sendMessage('BG.onCompleted');
    },
    { urls: ['https://item.jd.com/100012014970.html', 'https://trade.jd.com/shopping/*'] },
  );
}

/**
 * 向前台发送消息
 */
function sendMessage(type, value, allTabs) {
  if (!allTabs) {
    chrome.tabs.query({ active: true }, function (tabs) {
      console.log(tabs);
      if (tabs && tabs.length) {
        console.log(tabs[0].id);
        console.log({ type: type, value: value });
        setTimeout(() => {
          chrome.tabs.sendMessage(tabs[0].id, { type: type, value: value });
        }, 500);
      }
    });
  } else {
    chrome.tabs.query({ url: 'https://item.jd.com/*' }, function (tabs) {
      for (let index = 0; index < tabs.length; index++) {
        chrome.tabs.sendMessage(tabs[index].id, { type: type, value: value });
      }
    });
  }
}

/**
 * 入口函数
 */
function background() {
  bindEvent();
}

background();
