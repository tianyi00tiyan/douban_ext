/**
 * 在产品详情页 例如https://item.jd.com/100012014970.html
 *
 * TODO：
 *
 * @author t.zhou
 */
// const HD = 1; //高清大图
// const FHD = 2; //全高清大图
// const WINDOW_WIDTH = window.screen.availWidth; //网页可见区域宽高
// const WINDOW_HEIGHT = window.screen.availHeight;
// const WIDTH = WINDOW_WIDTH * 0.8; //弹层的宽高
// const HEIGHT = WINDOW_HEIGHT * 0.8;
// const SWIPER_WIDTH = WIDTH; //SWIPER的宽高
// const SWIPER_HEIGH = HEIGHT * 0.9;

// var isShow = false; //弹层是否显示
// var curRatio = HD; //图片质量
var canUse = true; //是否使用插件

/**
 * 绑定每个图片的点击事件
 */
// function bindEvent(dom) {
//   dom.on('click', function (evt) {
//     if (!canUse) {
//       return;
//     }
//   });
// }

/**
 * 初始化滑动播放的窗体
 */
// function initSwiper() {
//   //如果有就不需要重复绘制
//   if ($('.swiper').length) {
//     return;
//   }

//   //引入样式
//   var $linkTag = $(
//     '<link href="https://www.swiper.com.cn/dist/css/swiper.min.css" rel="stylesheet" type="text/css" charset="utf-8"/>',
//   );
//   $('head').append($linkTag);

//   //创建弹层
//   var $wrapper = $(
//     `<div class="swiper" style="display:none;position: fixed;width: ${WIDTH}px;height: ${HEIGHT}px;z-index: 3000;background-color: black;top: 50%;left: 50%;margin-left: -40%;margin-top: ${
//       -HEIGHT / 2
//     }px;"></div>`,
//   );
//   $('body').append($wrapper);
// }

/**
 * 展示弹层
 */
// function showSwiper(urls, index) {
//   //判断当前是否有弹层展示,有则移除
//   if (isShow) {
//     hideSwiper();
//   }

//   //展示弹层
//   $('.swiper').show();
//   isShow = true;

//   //容器
//   var $swiperContainer = $(
//     `<div class="swiper-container" style="height:${SWIPER_HEIGH}px;width:${SWIPER_WIDTH}px;margin-top:${
//       (HEIGHT - SWIPER_HEIGH) / 2
//     }px"><div class="swiper-wrapper"></div></div>`,
//   );
//   $('.swiper').append($swiperContainer);

//   //播放按钮
//   var str = `<div class="swiper-button-next"></div><div class="swiper-button-prev"></div>`;
//   $('.swiper-container').append($(str));

//   var str = '';
//   for (let index = 0; index < urls.length; index++) {
//     str += `<div class="swiper-slide" style="display: flex;justify-content: center;">
// 			<img src="${urls[index]}" style="height: 100%">
// 		</div>`;
//   }
//   $('.swiper-wrapper').append($(str));

//   var swiper = new Swiper('.swiper-container', {
//     navigation: {
//       nextEl: '.swiper-button-next',
//       prevEl: '.swiper-button-prev',
//     },
//     initialSlide: index,
//     mousewheel: true,
//   });
// }

/**
 * 收起弹层
 */
// function hideSwiper() {
//   //关闭弹层 并消掉swiper-container
//   $('.swiper').hide();
//   $('.swiper-container').remove();
//   isShow = false;
// }

/**
 * 处理图片链接（小图转大图）
 */
// function dourls(urls) {
//   /**
//    * 根据配置的图片分辨率逐项做URL处理
//    * https://img3.doubanio.com/view/status/m/public/55165169-1f85dceb253be32.jpg
//    * https://img1.doubanio.com/view/status/l/public/364c1a0fc6f448a.webp
//    * https://img1.doubanio.com/view/status/raw/public/364c1a0fc6f448a.jpg
//    */
//   for (let index = 0; index < urls.length; index++) {
//     urls[index] = urls[index].replace(/\/[m|s]\//, '/raw/').replace(/(\d)*-/, '');
//   }

//   if (curRatio == HD) {
//     for (let index = 0; index < urls.length; index++) {
//       urls[index] = urls[index].replace(/\/raw\//, '/l/').replace(/\.jpg/, '.webp');
//     }
//   }

//   return urls;
// }

/**
 * 从主函数main开始执行
 */
function main() {
  //初始化
  // initSwiper();

  //可操作的DOM

  //重置移除掉原来的跳转链接
  // if (dom.length) {
  // bindEvent(dom);
  gogogo();
  // }
}

function gogogo() {
  setInterval(() => {
    if (canUse) {
      // btn-reservation
      let dom = $('#btn-reservation');
      if (dom.length) {
        window.location.href = dom.attr('href');
        console.log('btn-reservation.click();');
      }

      // presaleEarnest
      let dom2 = $('#presaleEarnest');
      if (dom2.length) {
        dom2.prop('checked', true);
        console.log('presaleEarnest.click();');
      }

      // presaleEarnest
      let dom3 = $('#order-submit');
      if (dom3.length) {
        dom3.click();
        console.log('order-submit.click();');
      }
    }
  }, 1000);
}

/**
 * 等待服务加载完成再执行main()
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.type) {
    case 'BG.onCompleted':
      main();
      break;
    case 'BG.canUse':
      canUse = request.value;
      break;
    // case 'BG.curRatio':
    //   curRatio = request.value;
    //   break;
    default:
      break;
  }
});
