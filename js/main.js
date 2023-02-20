const HD = 1; //高清大图
const FHD = 2; //全高清大图
const WINDOW_WIDTH = window.screen.availWidth; //网页可见区域宽高
const WINDOW_HEIGHT = window.screen.availHeight; 
const WIDTH = WINDOW_WIDTH * 0.8; //弹层的宽高
const HEIGHT = WINDOW_HEIGHT * 0.8;
const SWIPER_WIDTH = WIDTH; //SWIPER的宽高
const SWIPER_HEIGH = HEIGHT;

var isShow = false; //弹层是否显示
var curIndex = 0; //当前图片的索引

/**
 * 绑定每个图片的点击事件
 */
function bindEvent(doms) {
	//为每一个图片绑定点击事件
	doms.on("click", function (evt) {
		let urls = [];
		let tartget  = evt.currentTarget;
		let tartgetImage = $(tartget).attr('data-original');

		evt.stopPropagation();
		evt.preventDefault();

		for (let index = 0; index < doms.length; index++) {
			const element = doms[index];
			urls.push($(element).attr('data-original'))
		}

		curIndex = urls.indexOf(tartgetImage);
		showSwiper(dourls(urls));
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
	//如果有就不需要重复绘制
	if ($('.swiper').length) {
		return
	}

	//引入样式
	var $linkTag = $('<link href="https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.css" rel="stylesheet" type="text/css" charset="utf-8"/>');
	$('head').append($linkTag);
	
	//创建弹层
	var $wrapper = $(`<div class="swiper" style="display:none;position: fixed;width: ${WIDTH}px;height: ${HEIGHT}px;z-index: 3000;background-color: black;top: 50%;left: 50%;margin-left: -40%;margin-top: ${-HEIGHT/2}px;"></div>`);
	$('body').append($wrapper);
}

/**
 * 展示弹层
 */
function showSwiper(urls) {
	//判断当前是否有弹层展示,有则移除
	if (isShow) {
		hideSwiper();
	}

	//展示弹层
	$('.swiper').show();
	isShow = true;

	//容器
	var $swiperContainer = $(`
		<div class="swiper-container" style="height:${SWIPER_HEIGH}px;width:${SWIPER_WIDTH}px;margin-top:${(HEIGHT - SWIPER_HEIGH)/2}px">
			<div class="swiper-current" style="font-size: 16px;color: #fff;position: absolute;top: 50px;left: 50px;"></div>
			<div class="swiper-wrapper"></div>
		</div>`);
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

	document.removeEventListener('keydown', onKeydown);
	var swiper = new Swiper('.swiper-container', {
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		initialSlide: curIndex,
		mousewheel: true,
		lazy: {
			loadPrevNext: true,
		},
		on: {
			slideChange: function () {
				curIndex = this.activeIndex;
				$('.swiper-current').text(`${curIndex + 1}/${urls.length}`);
			},
		},
	});

	document.addEventListener('keydown', (event) => onKeydown(event, swiper));
}

/**
 * 收起弹层
 */
function hideSwiper() {
	//关闭弹层 并消掉swiper-container
	$('.swiper').hide()
	$('.swiper-container');
	isShow = false;
}

/**
 * 收起弹层
 */
function onKeydown(event, swiper2) {
	console.log("dada", event.key, "dadsa");

	if (event.defaultPrevented) {
		return; // 如果事件已经在进行中，则不做任何事。
	}

	const keyName = event.key;

	if (keyName === ' ' || keyName === 'ArrowDown') {
		// do not alert when only Control key is pressed.
		swiper2.slideNext();

		// 取消默认动作，从而避免处理两次。
		event.preventDefault();
	}

	if (keyName === 'ArrowUp') {
		// do not alert when only Control key is pressed.
		swiper2.slidePrev();

		// 取消默认动作，从而避免处理两次。
		event.preventDefault();
	}
}

	

/**
 * 处理图片链接（小图转大图）
 */
function dourls(urls) {
	/**
	 * 根据配置的图片分辨率逐项做URL处理
	 * https://note.mafengwo.net/img/37/ca/2566d645637cf38415d25d4d0501c74c.jpeg
	 */
	for (let index = 0; index < urls.length; index++) {
		urls[index] = urls[index] && urls[index].replace(/\?\S*/, '')
	}

	// console.log(urls);
	return urls.filter(item => !!item);
}


/**
 * 从主函数main开始执行
 */
function main () {
	//初始化
	initSwiper();

	//可操作的DOM
	let dom = $(".photoTemplate img");

	//重置移除掉原来的跳转链接
	if (dom.length) {
		bindEvent(dom);
	}
}

setTimeout(function () {
	main();
}, 1000);
