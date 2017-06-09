/* 
	初始化全局变量
*/
asideRatio = 0.3;	/* 左侧菜单占窗口的比例 */
maxAsideWidth = 150;	/* 左侧菜单最大尺寸 */
minWinWidth	= 320	/* 窗口最小尺寸 */
minDeviceWidth = 1025;	/* 移动设置最小尺寸 iphone 6plus */
resizeRatio = 0.8;	/* 缩放比例 */
iframeSize = '80%';	/* 弹出页面尺寸比例 */
iframeMsgSize = '80%'; /* OA界面弹出处理页面尺寸 */

$(document).ready(function(){
	/* 页面尺寸发生变化后，重新计算框架元素的尺寸 */
	resizeWindow();
	
	/* 框架菜单 */
	doMenu();	/* 框架菜单切换 */
	toggleAside();	/* 框架菜单显示隐藏 */
	$("div[id='main']").bind('touchend click',function(){	/* 左侧菜单关闭提示 */
		if($("aside").is(":not(:hidden)")){
			$("aside").hide();
			layer.tips('菜单已关闭', $("header ul li:eq(0)"));
			resizeWindow();
		}
	});
	
	/* 框架主体 */
	$(".smarticker").Scroll({line:1,speed:500,timer:3000});	/* 顶部滚动文字 */
	search_btn_submit();	/* 回车提交搜索 */
	resetFormValue();	/* 重置搜索框 */
	stoprepeatsubmit();	/* 阻止多次点击提交 */
	addIcon();	/* 框架本身展现样式批量加图标 */
	showTips(); /* 表格内容溢出后鼠标提示 */
	resetTable();	/* 处理框架本身表格展现形式 */
	
	/* layer组件 */
	openLayer();	/* 处理弹出页面 */
	resetLayer();	/* 页面尺寸发生变化后，重新计算弹出页面的位置 */
	closeBtn();	/* 处理弹出页面关闭动作 */
	
	/* 框架内页面处理 */
	iframeTable();	/* 处理弹出页面内表格展现形式 */
	uploadTips();	/* 选择文件后的提示语 */
	slideTag();	/* 处理弹出页面内窗口切换 */
	
	/* OA审批 */
	iframeOAPopWin();	/* 处理弹出页面内OA审批动作 */
});

$(window).on("resize load", function(){
	resizeWindow();
	resetLayer();
	resetTable();
	iframeTable();
});

window.addEventListener("orientationchange", function(){
	if(!$("body").hasClass("iframe")) {
		layer.msg('设备方向已发生变化！',{time:1000});
	}
}, false);

function resizeWindow() {
	/* get device width & aside maxwidth */
	var winWidth = $(window).width(),
		winHeight = $(window).height();
	/* 
		1.if device width is too small, hide aside to get max viewport;
		2.force device minwidth;
	*/
	if(winWidth < minWinWidth) {
		$("aside").hide();
		winWidth = minWinWidth;
	}
	/* aside ratios */
	var asideWidth = (winWidth * asideRatio > maxAsideWidth) ? maxAsideWidth : winWidth * asideRatio;
	if($("aside").is(":hidden")){
		mainWidth = winWidth;
	} else {
		mainWidth = winWidth - asideWidth;
	}
	$("aside").width(asideWidth);
	/* calc aside menu height */
	var logoHeight = $("aside ul li:eq(0)").outerHeight();
	$("aside ul li:eq(1)").height(winHeight - logoHeight);
	/* setting header height by width */
	var liHeight = $("header").outerHeight();
	$("header ul li").css({
		'height' : liHeight + 'px',
		'line-height' : liHeight + 'px'
	});
	$("header ul li i").css({
		'height' : liHeight + 'px',
		'line-height' : liHeight + 'px'
	});
	/* reset width */
	var headerHeight = $("header").outerHeight();
	$("div[id='main']").width(mainWidth);
	$("div[id='main'] header").width(mainWidth);
	$("div[id='main'] article").width(mainWidth);
	$("div[id='main'] article").height(winHeight - headerHeight);
	/*  */
	window.scrollTo(0, 1);
}

/* high light current menu */
function setMenu(i,j) {
	$("aside h4").hide().removeClass("selected");
	$("aside h3").show().removeClass("selected");
	$("aside h3[data-name='"+i+"']").addClass("selected");
	$("aside h4[data-name^='"+i+"']").show();
	$("aside h4[data-name='"+i + "_" + j +"']").addClass("selected");
}

/* toggle menu */
function doMenu() {
	$("aside h3").click(function(){
		$("aside h4").hide().removeClass("selected");
		$("aside h3").show().removeClass("selected");
		$(this).addClass("selected");
		var hname = $(this).attr("data-name");
		$("aside h4[data-name^='"+hname+"']").show();
	});
}

/* toggle aside */
function toggleAside() {
	/* get width & aside maxwidth */
	var winWidth = $(window).width();
	if(winWidth < minWinWidth) {
		winWidth = minWinWidth;
	}
	var asideWidth = (winWidth * asideRatio > maxAsideWidth) ? maxAsideWidth : winWidth * asideRatio;
	/* close aside */
	$("header ul li:eq(0)").click(function(event){
		event.stopPropagation();
		if($("aside").is(":hidden")){
			$("aside").show();
			mainWidth = winWidth - asideWidth;
		}else{
			$("aside").hide();
			mainWidth = winWidth;
		}
		$("div[id='main']").width(mainWidth);
		$("div[id='main'] header").width(mainWidth);
		$("div[id='main'] article").width(mainWidth);
		resizeWindow();
	});
}

/* simulate enter event */
function search_btn_submit() {
	$(".btnenter").siblings("input").focus(function(){
		$(document).keyup(function(event){
			if(event.keyCode ==13){
				$(".btnenter").trigger("click");
			}
		});
	});
}

/* reset search condition */
function resetFormValue() {
	$(".btnenter").val('搜索');
	$(".btnreset").val('重置');
	$(".btnreset").click(function(){
		var ele = $(this).parent("form").find("*");
		$(ele).each(function(){
			stype = $(this).attr("type");
			if(stype != "submit" && stype != "button") {
				$(this).val('');
			}
		});
		window.location.reload();
	});
}

/* stop repeat submit */
function stoprepeatsubmit(){
	$("input[type='submit']").click(function (){
		layer.msg('数据处理中，请稍等...', {icon: 6, shade: [0.8, '#393D49']});
	});
}

/* for main layout-1 */
function addIcon() {
	$("div[id='main'] section ul li").find("p").prepend('<i class="fa fa-tablet"></i>');
	$("div[id='main'] section ul li").find("p").append('<i class="fa fa-pencil"></i>');
}

/* show tips */
function showTips(){
	/* for .flexul > ul > li > p */
	$(".flexul p").bind("click touchend",function(){
		$(this).siblings().css({
			'background-color':'rgba(241,241,241,1)',
			'color':'rgba(31,181,173,1)'
		});
		$(this).siblings().find("i").css({
			'color':'rgba(31,181,173,1)'
		});
		$(this).css({
			'background-color':'rgba(31,181,173,1)',
			'color':'rgba(255,255,255,1)'
		});
		$(this).find("i").css({
			'color':'rgba(255,255,255,1)'
		});
	});
	/* for .datalisttable > table[class!='approvaltable'] > tbody > tr > td > span */
	$(".datalisttable table[class!='approvaltable'] td span:not(:last-child)").bind("click touchend",function(){
		$(this).parents("tr:eq(0)").siblings().find("span").css({
			'background-color':'rgba(241,241,241,1)',
			'border-color':'rgba(241,241,241,1)'
		});
		$(this).parent().find("span").css({
			'background-color':'rgba(31,181,173,1)',
			'border-color':'rgba(31,181,173,1)'
		});
		layer.tips($(this).text(), this, {
			tips: 4,
			time:  3000,
			style: ['background-color:#06f; color:#fff', '#06f'],
			maxWidth:100
		});
	});
	/* for .datalisttable > table > tbody > tr > td > span */
	$(".datalisttable table[class='approvaltable'] td span:not(:last-child)").bind("click touchend",function(){
		layer.tips($(this).text(), this, {
			tips: 4,
			time:  3000,
			style: ['background-color:#06f; color:#fff', '#06f'],
			maxWidth:100
		});
});
}

/* for main reset table style */
function resetTable() {
	var winWidth = $(window).width();
	/* 
		find table with attr class = datalisttable
	*/
	var tableCount = $("div[id='main'] .datalisttable table").size();
	if(tableCount > 0) {
		for(var k = 0; k < tableCount;k++) {
			var targetTable = $("div[id='main'] .datalisttable table:eq("+k+")");
			var tdCount = targetTable.find("tbody tr:eq(0) td span").size();
			var thTitle = '';
			var thContent = '';
			var flexStr = '';
			if(tdCount > 0) {
				for(var i = 0; i < tdCount; i++){
					/* get flex data to set span width for table */
					var tdFlex = targetTable.find("tbody tr:eq(0) td span:eq("+i+")").attr("data-flex");
						if(tdFlex) {
							targetTable.find("tr").each(function(){
								if(winWidth > minDeviceWidth) {
									/* for big screnn */
									$(this).find("td span:eq("+i+")").css({
										'-o-flex':tdFlex,
										'-ms-flex':tdFlex,
										'-moz-flex':tdFlex,
										'-webkit-flex':tdFlex,
										'flex':tdFlex
									});
								} else {
									/* special style for small screen */
									$(this).find("td span:eq("+i+")").css({
										'-o-flex':'none',
										'-ms-flex':'none',
										'-moz-flex':'none',
										'-webkit-flex':'none',
										'flex':'none'
									});
								}
								/* extra style using css to control */
							});
							flexStr = 'data-flex="' + tdFlex + '"';
						} else {
							flexStr = 'data-flex=1';
						}
					/* get title for thead */
					var thTitle = targetTable.find("tbody tr:eq(0) td span:eq("+i+")").attr("data-title");
						if(!thTitle) thTitle = '';
						thContent += '<span ' + flexStr + '>'+ thTitle +'</span>';
				}
			}
			/* 
				1.clean more theads if rotate more times;
				2.create thead for table in big screen;
			*/
			targetTable.find("thead").each(function(){
				$(this).remove();
			})
			/* show in big screen */
			if(winWidth > minDeviceWidth) {
				/* for big screnn */
				targetTable.find("tbody").before('<thead><tr><th>' + thContent + '</th></tr></thead>');
				targetTable.find("thead span").each(function(){
					var thFlex = $(this).attr("data-flex");
						if(!thFlex) thFlex = 1;
							if(winWidth > minDeviceWidth) {
								$(this).css({
									'-o-flex':thFlex,
									'-ms-flex':thFlex,
									'-moz-flex':thFlex,
									'-webkit-flex':thFlex,
									'flex':thFlex
								});
								/* span title,extra style using css to control */
							}
				});
			}
		}
	}
}

/* open page popWin and iframe */
function openLayer(){
	/* limit element */
	$("div[id='main'] article section div a").click(function(){
		/* open when a has attr data-url */
		var dataUrl = $(this).attr("data-url");
		if(dataUrl) {
			/* if mobile device, don't fix iframe to justify unnormal mobile device */
			var ifFix = true;
			if(checkplatform()) {
				ifFix = false;
			}
			/* call layer */
			var index = layer.open({
				type: 2,
				area: [iframeSize,iframeSize],
				fix: ifFix,
				move: false,
				title: 'loading...',
				content: [dataUrl,'no'],
				success: function(layero, index){
					layer.iframeAuto(index);
					/* reset title */
					var title = layer.getChildFrame('html', index).find("title").html();
					if(title) {
						layer.title(title, index);
					}
					/* add extra css for iframe body */
					var html = layer.getChildFrame('html', index);
					if(html) {
						$(html).find("body").addClass("iframe");
					}
					/* re-calc iframe position */
					resetLayer();
				}
			});
		}
	});
}

/* re-calc iframe position */
function resetLayer() {
	/* get width & aside maxwidth */
	var winWidth = $(window).width(),
		winHeight = $(window).height();
	if(winWidth < minWinWidth) {
		$("aside").hide();
		winWidth = minWinWidth;
	}
	/* judge if has iframe && get iframe structure */
	var targetLayer = $("body").find("div[class*='layui-layer-iframe']"),
		targetTitle = targetLayer.find("div[class*='layui-layer-title']"),
		targetContent = targetLayer.find("div[class*='layui-layer-content']");
	if(targetLayer.length > 0){
		var targetWidth = Math.floor(winWidth * resizeRatio),
			targetHeight = Math.floor(winHeight * resizeRatio),
			targetTitleHeight = Math.floor(targetTitle.outerHeight()),
			targetContentHeight = Math.floor(targetContent.outerHeight());
		targetLayer.css({
			width: targetWidth,
			height: targetHeight,
			top: Math.floor((winHeight - targetHeight) / 2),
			left: Math.floor((winWidth - targetWidth) / 2)
		});
		targetContent.css({
			height: (targetHeight - targetTitleHeight) + 'px',
			width: targetWidth + 'px'
		});
		targetContent.find("iframe").css({
			height: (targetHeight - targetTitleHeight) + 'px',
			width: targetWidth + 'px'
		});
	}
}

/* how to close iframe */
function closeBtn() {
	/* 
	back class
	backgIfrmae-1
	backgIfrmae-2
	backgIfrmae-n
	
	close class
	backgIfrmae-c
	backgIfrmae-r
	*/
	$("a[class*='backIframe']").click(function(){
		var index = parent.layer.getFrameIndex(window.name);
		str = $(this).attr("class");
		re = new RegExp("backIframe-", "g");
		str = str.replace(re, "");
		if(!isNaN(str)) {
			history.go('-' + str);	/* back by steps */
		} else {
			if(str == 'c') {
				parent.layer.close(index);	/* close current iframe */
			} else if(str == 'r') {
				parent.location.reload();	/* refresh parent */
			}
		}
	});
}

/* calc iframe table, like resetTable() */
function iframeTable() {
	var index = parent.layer.getFrameIndex(window.name);
	var winWidth = $(window).width();
	if(index > 0) {
		var tableCount = $("article[class='datalisttable'] table").size();
		if(tableCount > 0) {
			/* loop all tables */
			for(var k = 0; k < tableCount; k++) {
				var targetTable = $("article[class='datalisttable'] table:eq("+k+")");
				var targetSpan = targetTable.find("tr td span");
				var thContent = '';
				targetSpan.each(function(){
					spanFlex = $(this).attr("data-flex");
					if(!spanFlex) spanFlex = 1;
					if(winWidth > (minDeviceWidth * resizeRatio)) {
						$(this).css({
							'-o-flex':spanFlex,
							'-ms-flex':spanFlex,
							'-moz-flex':spanFlex,
							'-webkit-flex':spanFlex,
							'flex':spanFlex
						});
					} else {
						$(this).css({
							'-o-flex':'none',
							'-ms-flex':'none',
							'-moz-flex':'none',
							'-webkit-flex':'none',
							'flex':'none'
						});
					}
				});

				targetTable.find("tbody tr:eq(0) td span").each(function(){
					spanFlex = $(this).attr("data-flex");
					if(!spanFlex) spanFlex = 1;
					flexStr = 'data-flex="' + spanFlex + '"';
					var thTitle = $(this).attr("data-title");
					if(!thTitle) thTitle = '';
					thContent += '<span ' + flexStr + '>'+ thTitle +'</span>';
				});

				targetTable.find("thead").each(function(){
					$(this).remove();
				});
				
				if(winWidth > minDeviceWidth) {
					if(targetTable.hasClass("approvaltable")) {
						targetTable.find("tbody").before('<thead><tr><th>' + thContent + '</th></tr></thead>');
						targetTable.find("thead span").each(function(){
							var thFlex = $(this).attr("data-flex");
								if(!thFlex) thFlex = 1;
									if(winWidth > minDeviceWidth) {
										$(this).css({
											'-o-flex':thFlex,
											'-ms-flex':thFlex,
											'-moz-flex':thFlex,
											'-webkit-flex':thFlex,
											'flex':thFlex
										});
									}
						});
						$(targetTable).find("th").css({
							'background-color' : 'rgba(255,255,255,1)'
						});
					}
				}
			}
		}
		
		/* 非自适应类表格设置flex */
		var unautoFitTable = $("article[class!='datalisttable'] table");
		for(m = 0; m < unautoFitTable.size(); m++) {
			unautoFitTargetTable = unautoFitTable.eq(m);
			unautoFitTargetTable.find("span").each(function(index){
				var unautoFlex = $(this).attr("data-flex");
				if(!unautoFlex) unautoFlex = 1;
				$(this).css({
					'-o-flex':unautoFlex,
					'-ms-flex':unautoFlex,
					'-moz-flex':unautoFlex,
					'-webkit-flex':unautoFlex,
					'flex':unautoFlex
				});
			});
			/* 小尺寸的屏幕对第1个标签做放大2倍处理 */
			if(winWidth < minDeviceWidth) {
				unautoFitTargetTable.find("td").each(function(){
					scaleFlex = $(this).find("span:eq(0)").attr("data-flex");
					if(!scaleFlex) scaleFlex = 1;
					scaleFlex = scaleFlex * 2;
					 $(this).find("span:eq(0)").css({
						'-o-flex':scaleFlex +' 1 0%',
						'-ms-flex':scaleFlex +' 1 0%',
						'-moz-flex':scaleFlex +' 1 0%',
						'-webkit-flex':scaleFlex +' 1 0%',
						'flex':scaleFlex +' 1 0%'
					 });
				});
			}
		}
	}
}

/* select file on change show file name */
function uploadTips() {
	$("input[type='file']").on("change",function(){
		var filePath = $(this).val();
		var arr = filePath.split('\\');
		var fileName = arr[arr.length-1];
		/* $(this).siblings("i").html("您未上传文件，或者您上传文件类型有误！"); */
		$(this).siblings("small").html('已选择：' + fileName);
	});
}

/* iframe nav toggle */
function slideTag() {
	$("article section nav").siblings("table").hide();
	$("article section nav").siblings("table:eq(0)").show();
	$("article section nav span:eq(0)").addClass("selected");
	$("article section nav span").click(function(){
		var index = $(this).index();
		$(this).addClass("selected").siblings("span").removeClass("selected");
		$("article section nav").siblings("table").hide();
		$("article section nav").siblings("table:eq("+index+")").show();
	});
}

/* check PC ? Mobile */
function checkplatform(){
	var browser={
	    versions:function(){
	        var u = navigator.userAgent, app = navigator.appVersion;
	        return {
	            trident: u.indexOf('Trident') > -1,	/* IE内核 */
	            presto: u.indexOf('Presto') > -1,	/* opera内核 */
	            webKit: u.indexOf('AppleWebKit') > -1,	/* 苹果、谷歌内核 */
	            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,	/* 火狐内核 */
	            mobile: !!u.match(/AppleWebKit.*Mobile.*/),	/* 是否为移动终端 */
	            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),	/* iOS终端 */
	            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,	/* Android终端或者UC浏览器 */
	            iPhone: u.indexOf('iPhone') > -1,	/* 是否为iPhone或者QQHD浏览器 */
	            iPad: u.indexOf('iPad') > -1,	/* 是否iPad */
	            webApp: u.indexOf('Safari') == -1,	/* 是否web应用程序 */
	            weixin: u.indexOf('MicroMessenger') > -1,	/* 是否微信（2015-01-22新增） */
	            qq: u.match(/\sQQ/i) == " qq"	/* 是否QQ */
	        };
	    }(),
	    language:(navigator.browserLanguage || navigator.language).toLowerCase()
	}
	/* 判断是否其他内核 */
	if(!(browser.versions.presto || browser.versions.webKit || browser.versions.gecko || browser.versions.mobile)){
		$("#login input[type=submit]").val("无法提交！");
		$("#login input").attr("disabled",true);
		layer.alert("为了不影响您的正常使用和操作体验，\r\n请使用FireFox/Chrome/Safari浏览器！", 0, !1);
	}
	/* 如果移动端，则返回true */
	if(browser.versions.mobile) {
		return true;
	}
}

/* iframe oa check popwin */
function iframeOAPopWin() {
	var index = parent.layer.getFrameIndex(window.name);
	if(index > 0) {
		$("a[data-type]").click(function(){
			/* 
				get paramas and target form
				like <a data-target="#actionForm|id:2-pid:3-cid:4" data-type="oa_ok">example</a>
			*/
			var atarget = $(this).attr("data-target").split("|");
				$(atarget[0]).show().siblings("form").hide();
				$(atarget[0]).find("table").show();
				/* get oa check function type */
				if($(this).attr("data-type") == 'oa_ok') {
					$(atarget[0]).find("table select[name='approvalStep']").parents("tr:eq(0)").hide();
				} else {
					$(atarget[0]).find("table select[name='approvalStep']").parents("tr:eq(0)").show();
				}
				/* process paramas */
				atargetStr = atarget[1].split("-");
				layer.open({
					type: 1,
					shade: .6,
					move: false,
					title: false,
					closeBtn: 1,
					area: [iframeMsgSize, iframeMsgSize],
					content: $('.hiddenArea'),	/* action target */
					success: function(layero, index){
						var inputStr = '';
						/* clean alreay setting hidden value */
						$(atarget[0]).find("table thead").remove();
						 $.each(atargetStr, function(n,value) {
							 value = value.split(":");
							 inputStr += '<input type="hidden" name="' + value[0] + '" value="' + value[1] + '" />';
						 });
						 /* set new hidden value */
						$(atarget[0]).find("table tbody:eq(0)").prepend("<thead>" + inputStr + "</thead>");
					}
				});  
				
		});
	}
}

/* auto close iframe */
function djstime(){
	var i = 3;
	$("info_notice p label").html(i);
	var interval=setInterval(function(){
		i--;
		$("label").html(i);
		if(i<0){
			$("label").html("0");
			clearInterval(interval);
			$("[class^='backIframe']").trigger("click");
		}
	},1000);
}





