/**
 * 入口文件
 * @author t.zhou
 */

const DELAY_TIME = 5000; //等待页面结构加载完成的延时
var isShow = false; //弹层是否显示

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
		let imgs = $(tartget).parent().children();//

		for (let index = 0; index < imgs.length; index++) {
			const element = imgs[index];
			urls.push($(element).attr('style').match(/http(\S)*jpg/g))
		}
		

		showSwiper(urls, index);
	})
}

/**
 * 初始化滑动播放的窗体
 */
function initSwiper() {
	//引入样式
	var $linkTag = $('<link href="https://www.swiper.com.cn/dist/css/swiper.min.css" rel="stylesheet" type="text/css" charset="utf-8"/>');
	$('head').append($linkTag);
	
	//创建弹层
	var $wrapper = $('<div class="swiper" style="display:none;position: absolute;width: 80%;height: 60%;z-index: 3000;background-color: gray;top: 50%;left: 50%;margin-left: -40%;margin-top: -15%;"></div>');
	$('body').append($wrapper);

	var $swiperContainer = $('<div class="swiper-container" style="height: 100%;width:100%;"><div class="swiper-wrapper"></div></div>');
	$('.swiper').append($swiperContainer);

	var str = `<div class="swiper-button-next"></div><div class="swiper-button-prev"></div>`;
	$(".swiper-container").append($(str));
}

/**
 * 展示弹层
 */
function showSwiper(urls, index) {
	//TODO: 去展示弹层，并传入index
	var str = '';

	

	for (let index = 0; index < urls.length; index++) {
		str += `<div class="swiper-slide" style="width: 100%">
			<img src="${urls[index]}" style="height: 100%">
		</div>`;
	}
	console.log(str);
	$(".swiper-wrapper").append($(str));

	

	// setTimeout(function() {
		var swiper = new Swiper('.swiper-container', {
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			}
		});
		
	
		$('.swiper').show();
		isShow = true;
	// }, 5000)

	
}

/**
 * 收起弹层
 */
function hideSwiper(urls, index) {
	//关闭弹层 并消掉swiper-container
	$('.swiper').remove('.swiper-container').hide();
	isShow = false;
}

/**
 * 处理图片链接（小图转大图）
 */
function dourls(urls, index) {
	//关闭弹层 并消掉swiper-container
	$('.swiper').remove('.swiper-container').hide();
	isShow = false;
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
 * 等待页面结构加载完成再执行main()
 */
setTimeout(function(){
	main();
}, DELAY_TIME);
