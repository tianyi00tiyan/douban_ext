/**
 * 在豆瓣话题页 例如https://www.douban.com/gallery/topic/43657/ 
 * 在当前页面显示图片预览，而不是打开新的页面
 * @author t.zhou
 */

const HD = 1; //高清大图
const FHD = 2; //全高清大图

var isShow = false; //弹层是否显示
var ratio = FHD; //图片质量

/**
 * 绑定每个图片的点击事件
 */
function bindEvent(dom) {
	let children = dom.children();

	//为每一个图片绑定点击事件
	children.on("click", function (evt) {
		let urls = [];
		let tartget  = evt.currentTarget;
		let index = $(tartget).index();
		let imgs = $(tartget).parent().children();

		//阻止事件冒泡
		evt.stopPropagation();

		//获得当前文章的所有图片链接
		for (let index = 0; index < imgs.length; index++) {
			const element = imgs[index];
			urls.push($(element).attr('style').match(/http(\S)*jpg/g)[0])
		}

		showSwiper(dourls(urls), index);
	});

	//绑定弹层关闭的事件
	$('.swiper').on('click', function (evt) {
		//阻止事件冒泡
		evt.stopPropagation();
	});
	$('body').on('click', function (evt) {
		if (!isShow) return;

		hideSwiper();
	});
}

/**
 * 初始化滑动播放的窗体
 */
function initSwiper() {
	//引入样式
	var $linkTag = $('<link href="https://www.swiper.com.cn/dist/css/swiper.min.css" rel="stylesheet" type="text/css" charset="utf-8"/>');
	$('head').append($linkTag);
	
	//创建弹层
	var $wrapper = $('<div class="swiper" style="display:none;position: fixed;width: 80%;height: 80%;z-index: 3000;background-color: black;top: 50%;left: 50%;margin-left: -40%;margin-top: -20%;"></div>');
	$('body').append($wrapper);
}

/**
 * 展示弹层
 */
function showSwiper(urls, index) {
	//展示弹层
	$('.swiper').show();
	isShow = true;

	//容器
	var $swiperContainer = $('<div class="swiper-container" style="height: 80%;width:100%;margin-top: 5%;"><div class="swiper-wrapper"></div></div>');
	$('.swiper').append($swiperContainer);

	//播放按钮
	var str = `<div class="swiper-button-next"></div><div class="swiper-button-prev"></div>`;
	$(".swiper-container").append($(str));

	var str = '';
	for (let index = 0; index < urls.length; index++) {
		str += `<div class="swiper-slide" style="display: flex;justify-content: center;">
			<img src="${urls[index]}" style="height: 100%">
		</div>`;
	}
	$(".swiper-wrapper").append($(str));

	var swiper = new Swiper('.swiper-container', {
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		initialSlide: index
	});
}

/**
 * 收起弹层
 */
function hideSwiper() {
	//关闭弹层 并消掉swiper-container
	$('.swiper').hide()
	$('.swiper-container').remove();
	isShow = false;
}

/**
 * 处理图片链接（小图转大图）
 */
function dourls(urls) {
	/**
	 * 根据配置的图片分辨率逐项做URL处理
	 * https://img3.doubanio.com/view/status/m/public/55165169-1f85dceb253be32.jpg
	 * https://img1.doubanio.com/view/status/l/public/364c1a0fc6f448a.webp
	 * https://img1.doubanio.com/view/status/raw/public/364c1a0fc6f448a.jpg
	 */
	for (let index = 0; index < urls.length; index++) {
		urls[index] = urls[index].replace(/\/[m|s]\//, '/raw/').replace(/(\d)*-/, '');
	}

	if (ratio == HD) {
		for (let index = 0; index < urls.length; index++) {
			urls[index] = urls[index].replace(/\/raw\//, '/l/').replace(/\.jpg/, '.webp');
		}
	}

	return urls;
}


/**
 * 从主函数main开始执行
 */
function main () {
	//初始化
	initSwiper();

	//可操作的DOM
	let dom = $("ul.status-pics");

	//重置移除掉原来的跳转链接
	if (dom.length) {
		dom.parent().removeAttr('href');
		bindEvent(dom);
	}

	console.log("done")
}

/**
 * 等待服务加载完成再执行main()
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.status == "onCompleted") {
		main();
	}		
});
