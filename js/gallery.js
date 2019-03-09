/**
 * 在豆瓣话题页 例如https://www.douban.com/gallery/topic/43657/ 
 * 新开Tab页来展示，所有文章的图片
 * 
 * TODO：
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

chrome.webRequest.onBeforeSendHeaders.addListener(
	function(details){
			details.requestHeaders.push({name: "Origin", value: "https://www.douban.com"});
			console.log(details.requestHeaders);
			return {requestHeaders: details.requestHeaders};
	},
	{
			urls: [
					"https://m.douban.com/rexxar/api/v2/gallery/topic/*"
			]
	},
	[
			"blocking",
			"requestHeaders"
	]
);

/**
 * 初始化
 */
function init() {
	
	getGallery()
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
 * 向后台发送消息
 */
function sendMessage(type, value) {
	chrome.runtime.sendMessage({
		type: type,
		value: value
	})
}


/**
 * 从主函数main开始执行
 */
function main() {
	//初始化
	init();
}
main();