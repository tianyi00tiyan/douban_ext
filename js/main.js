/**
 * 在豆瓣话题页 例如https://www.douban.com/gallery/topic/43657/ 
 * 在当前页面显示图片预览，而不是打开新的页面
 * 
 * TODO：
 * 1.增加popup弹窗 可以选择图片分辨率,是否使用工具,展示布局
 * 2.增加按钮打开新的页面来实现话题内所有图片的一次浏览（带文字）
 * 3.增加适用场景
 * 
 * @author t.zhou
 */
const HD = 1; //高清大图
const FHD = 2; //全高清大图
const WINDOW_WIDTH = window.screen.availWidth; //网页可见区域宽高
const WINDOW_HEIGHT = window.screen.availHeight; 
const WIDTH = WINDOW_WIDTH * 0.8; //弹层的宽高
const HEIGHT = WINDOW_HEIGHT * 0.8;
const SWIPER_WIDTH = WIDTH; //SWIPER的宽高
const SWIPER_HEIGH = HEIGHT * 0.9;

var isShow = false; //弹层是否显示
var curRatio = HD; //图片质量
var canUse = true; //是否使用插件

/**
 * 绑定每个图片的点击事件
 */
function bindEvent(dom) {
	let children = dom.children();

	//为每一个图片绑定点击事件
	children.on("click", function (evt) {
		if (!canUse) {
			return;
		}

		let urls = [];
		let tartget  = evt.currentTarget;
		let index = $(tartget).index();
		let imgs = $(tartget).parent().children();

		//阻止事件冒泡和<a>标签默认行为
		evt.stopPropagation();
		evt.preventDefault();

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

	//绑定topic-title的点击事件，来打开新的Tab
	$(".topic-title").click(function(evt) {
		var hash = window.location.hash;
		var id = chrome.runtime.id;
		var htmlPage = '/gallery.html';
		var tabUrl = 'chrome-extension://' + id + htmlPage;

		sendMessage("M.createTab", tabUrl + hash);
	})
}

/**
 * 初始化滑动播放的窗体
 */
function initSwiper() {
	//如果有就不需要重复绘制
	if ($('.swiper').length) {
		return
	}

	//引入样式
	var $linkTag = $('<link href="https://www.swiper.com.cn/dist/css/swiper.min.css" rel="stylesheet" type="text/css" charset="utf-8"/>');
	$('head').append($linkTag);
	
	//创建弹层
	var $wrapper = $(`<div class="swiper" style="display:none;position: fixed;width: ${WIDTH}px;height: ${HEIGHT}px;z-index: 3000;background-color: black;top: 50%;left: 50%;margin-left: -40%;margin-top: ${-HEIGHT/2}px;"></div>`);
	$('body').append($wrapper);
}

/**
 * 展示弹层
 */
function showSwiper(urls, index) {
	//判断当前是否有弹层展示,有则移除
	if (isShow) {
		hideSwiper();
	}

	//展示弹层
	$('.swiper').show();
	isShow = true;

	//容器
	var $swiperContainer = $(`<div class="swiper-container" style="height:${SWIPER_HEIGH}px;width:${SWIPER_WIDTH}px;margin-top:${(HEIGHT - SWIPER_HEIGH)/2}px"><div class="swiper-wrapper"></div></div>`);
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
		initialSlide: index,
		mousewheel: true

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

	if (curRatio == HD) {
		for (let index = 0; index < urls.length; index++) {
			urls[index] = urls[index].replace(/\/raw\//, '/l/').replace(/\.jpg/, '.webp');
		}
	}

	return urls;
}

/**
 * 获取
 */
function getGallery() {
	let param = {
		ck: "q6_u" || get_cookie("ck"),
		sort: "hot",
		start: 0,
		count: 200,
		status_full_text: 0,
		guest_only: 0
	};

	let url = "https://m.douban.com/rexxar/api/v2/gallery/topic/39565/items";
	
	ajax(param, url, function (res) {
		console.log(res)
	})
}

/**
 * ajax发送请求
 */
function ajax(param, url, success, error) {
	$.ajax({
		url: url,
		type: 'get',
		data: param,
		dataType: "json",
		contentType: "application/x-www-form-urlencoded",
		traditional: true,
		success: success,
		error: error
	})
}

/**
 * 向后台发送消息
 */
function sendMessage(type, value) {
    chrome.runtime.sendMessage(
		{type: type, value: value}
	)
}


/**
 * 从主函数main开始执行
 */
function main () {
	//初始化Swiper
	initSwiper();

	// getGallery();

	//可操作的DOM
	let dom = $("ul.status-pics");

	//重置移除掉原来的跳转链接
	if (dom.length) {
		bindEvent(dom);
	}
}

/**
 * 等待服务加载完成再执行main()
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(request)
	switch (request.type) {
		case "BG.onCompleted":
			main();
			break;
		case "BG.canUse":
			canUse = request.value;
			break;
		case "BG.curRatio":
			curRatio = request.value;
			break;
		default:
			break;
	}
});
