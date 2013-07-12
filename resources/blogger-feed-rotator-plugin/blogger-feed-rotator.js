// Blogger Feed Rotator Plugin by Taufik Nurrohman
// URL: http://www.dte.web.id :: http://hompimpaalaihumgambreng.blogspot.com

(function($) {
	$.fn.customRotator = function(o) {

		o = $.extend({
			interval: 6000,
			speed: 1000,
			hoverPause: true,
			autoHeight: false,
			crossFade: false,
			autoSlide: true,
			hide: function(index) {},
			show: function(index) {}
		}, o);
		
		var done = true;

		return this.each(function() {
			var $this = $(this),
			$item = $this.children().hide(),
			$nav = $this.next(),
			slideshow = null,
			over = 0,
			i = 0;
			function rotateSlide() {
				o.hide(i);
				$nav.find('.current').removeClass('current');
				done = false;
				if ($item.eq(i).next().length) {
					if (!o.crossFade) {
						$item.eq(i).fadeOut(o.speed, function() {
							$(this).next().fadeIn(o.speed, function() {
								o.show(i);
								done = true;
							});
							if (o.autoHeight) {
								$this.stop().animate({
									height: $item.eq(i + 1).height()
								}, o.speed/2);
							}
							i++;
						});
					} else {
						$item.eq(i).fadeOut(o.speed);
						$item.eq(i).next().fadeIn(o.speed, function() {
							o.show(i);
							done = true;
							i++;
						});
						if (o.autoHeight) {
							$this.stop().animate({
								height: $item.eq(i + 1).height()
							}, o.speed/2);
						}
					}
					$nav.find('.rotator-num a').eq(i + 1).addClass('current');
				} else {
					if (!o.crossFade) {
						$item.eq(i).fadeOut(o.speed, function() {
							i = 0;
							$item.first().fadeIn(o.speed, function() {
								o.show(i);
								done = true;
							});
							if (o.autoHeight) {
								$this.stop().animate({
									height: $item.eq(i).height()
								}, o.speed/2);
							}
						});
					} else {
						$item.eq(i).fadeOut(o.speed);
						$item.first().fadeIn(o.speed, function() {
							o.show(0);
							done = true;
							i = 0;
						});
						if (o.autoHeight) {
							$this.stop().animate({
								height: $item.eq(0).height()
							}, o.speed/2);
						}
					}
					$nav.find('.rotator-num a').first().addClass('current');
				}
				if (over == 0 && o.autoSlide) {
					slideshow = setTimeout(rotateSlide, o.interval);
				}
			}
			if ($item.length > 1) {
				o.hide(i);
				$item.first().fadeIn(o.speed, function() {
					o.show(i);
					done = true;
				});
				if (o.autoHeight) {
					$this.stop().animate({
						height: $item.eq(0).height()
					}, o.speed/2);
				}
				if (o.hoverPause && o.autoSlide) {
					$this.mouseenter(function() {
						clearTimeout(slideshow);
						over = 1;
					}).mouseleave(function() {
						slideshow = setTimeout(rotateSlide, o.interval);
						over = 0;
					}).trigger("mouseleave");
				} else {
					slideshow = (o.autoSlide) ? setTimeout(rotateSlide, o.interval) : null;
				}
				$nav.find('.rotator-num a').click(function() {
					if (done) {
						done = false;
						if (o.autoSlide) {
							clearTimeout(slideshow);
							slideshow = setTimeout(rotateSlide, o.interval);
						}
						i = $(this).index();
						$(this).parent().find('.current').removeClass('current');
						$(this).addClass('current');
						o.hide(i);
						$item.fadeOut(o.speed).eq(i).fadeIn(o.speed, function() {
							o.show(i);
							done = true;
						});
						if (o.autoHeight) {
							$this.stop().animate({
								height: $item.eq(i).height()
							}, o.speed/2);
						}
					}
					return false;
				});
				$nav.find('.rotator-advancer a').click(function() {
					if (done) {
						done = false;
						var hash = this.hash.replace('#',""),
							len = $item.length;
						if (o.autoSlide) {
							clearTimeout(slideshow);
							slideshow = setTimeout(rotateSlide, o.interval);
						}
						if (hash == 'next') {
							i = (i < len-1) ? i + 1 : 0;
						} else {
							i = (i > 0) ? i - 1 : len - 1;
						}
						$nav.find('.current').removeClass('current');
						$nav.find('.rotator-num a').eq(i).addClass('current');
						o.hide(i);
						$item.fadeOut(o.speed).eq(i).fadeIn(o.speed, function() {
							o.show(i);
							done = true;
						});
						if (o.autoHeight) {
							$this.stop().animate({
								height: $item.eq(i).height()
							}, o.speed/2);
						}
					}
					return false;
				});
			}
		});

	};
})(jQuery);

function makeSlider(config) {

	var defaults = {
		url: "http://www.dte.web.id", // Your blog URL
		numPost: 5, // Number of posts to display
		newTabLink: false, // `true` to automatically open link in new window tab
		labelName: null, // Show posts in specific label. Specify name of the post label, or `null` to show all posts
		showDetail: true, // `false` to hide the blog post title & description
		summaryLength: 60, // Length of post summary
		titleLength: "auto", // Length of the post title. "auto" by default, or specify number to crop the post title characters and truncate it with `...`
		showThumb: true, // `false` to hide the post thumbnails
		thumbWidth: 250, // Width of post thumbnail in pixels
		squareThumb: true, // Thumbnail mode: Square mode or use the scaled thumbnail with original width and height ratio
		noThumb: "http://3.bp.blogspot.com/-vpCFysMEZys/UOEhSGjkfnI/AAAAAAAAFwY/h1wuA5kfEhg/s72-c/grey.png", // Fallback thumbnail for no picture posts
		showNav: true, // `true` to show both next/prev navigation and navigation number, "next/prev" to show next/prev navigation only, "number" to show navigation number only, `false` to hide the navigation
		navText: {
			prev: "&lt;", // Label of the previous navigation
			next: "&gt;" // Label of the next navigation
		},
		containerId: "slider-rotator", // HTML element ID that is used to display the slideshow/rotator
		interval: 6000, // Slideshow interval
		speed: 1000, // Slideshow animation speed
		hoverPause: true, // `false` to make the slideshow/rotator keep running on mouse-over
		crossFade: false, // `true` if you want to make the slide change effect occurs simultaneously between disappearance and appearance
		autoHeight: false, // Animate the rotator to adjust the height of the displayed item
		autoSlide: true, // `false` to run the slideshow manually (with navigation)
		onInit: function() {}, // Callback function that will be executed when slideshow is starting
		onHide: function(index) {}, // Callback function that will be executed when slideshow is start hiding the slide item
		onShow: function(index) {} // Callback function that will be executed after the slideshow showing the slide item
	};
	for (var option in defaults) {
		defaults[option] = (typeof (config[option]) !== 'undefined' && typeof (config[option]) !== undefined) ? config[option] : defaults[option];
	}
	// console.log(defaults);

	$.get(defaults.url + '/feeds/posts/summary/' + (defaults.labelName === null ? "" : '-/' + defaults.labelName.replace(/\,(\s+)?/g,"/")) + '?alt=json-in-script&max-results=' + defaults.numPost, {}, function(json) {
		if (json.feed.entry !== undefined) {
			var entry = json.feed.entry, title, link, thumb, summary, skeleton = "", nav = "";
			for (var i = 0, len = entry.length; i < len; i++) {
				if (i == entry.length) break;
				title = entry[i].title.$t;
				thumb = ("media$thumbnail" in entry[i]) ? '<img alt="' + title + '" src="' + entry[i].media$thumbnail.url.replace(/\/s72\-c/, '/s' + defaults.thumbWidth + (defaults.squareThumb ? '-c' : '')) + '" style="width:' + defaults.thumbWidth + 'px;height:' + (defaults.squareThumb ? defaults.thumbWidth + 'px' : 'auto') + '">' : '<img src="' + defaults.noThumb + '" style="width:' + defaults.thumbWidth + 'px;height:' + (defaults.squareThumb ? defaults.thumbWidth + 'px' : 'auto') + '">';
				summary = ("summary" in entry[i] && defaults.summaryLength > 0) ? entry[i].summary.$t.replace(/<br ?\/?>/ig," ").replace(/<.*?>/g,"").replace(/[<>]/g,"") : "";
				summary = (defaults.summaryLength < summary.length) ? summary.substring(0, defaults.summaryLength) + '&hellip;' : summary;

				for (var j = 0, jen = entry[i].link.length; j < jen; j++) {
					link = (entry[i].link[j].rel == "alternate") ? entry[i].link[j].href : "#";
				}

				skeleton += '<div class="slider-item">';
				skeleton += (defaults.showThumb && defaults.showDetail) ? '<div class="image-wrapper">' + thumb + '</div>' : (defaults.showThumb && !defaults.showDetail) ? '<div class="image-wrapper"><a href="' + link + '" title="' + title + '"' + (defaults.newTabLink ? ' target="_blank"' : '') + '>' + thumb + '</a></div>' : '';
				skeleton += (defaults.showDetail) ? '<div class="detail-wrapper"><h4><a title="' + title + '" href="' + link + '"' + (defaults.newTabLink ? ' target="_blank"' : '') + '>' + ((defaults.titleLength == "auto") ? title : title.substring(0, defaults.titleLength) + (title.length > defaults.titleLength ? '&hellip;' : '')) + '</a></h4><p>' + summary + '</p></div>' : '';
				skeleton += '</div>';
				$('#' + defaults.containerId).css({
					'width': (defaults.showThumb) ? defaults.thumbWidth + 'px' : $('#' + defaults.containerId).css('width'),
					'height': (!defaults.showDetail && defaults.squareThumb) ? defaults.thumbWidth + 'px' : $('#' + defaults.containerId).css('height')
				});
			}
			nav = '<div class="slider-rotator-nav"' + (defaults.showNav === false ? ' style="display:none;"' : '') + '>';
			nav += (defaults.showNav === true || defaults.showNav == "next/prev") ? '<span class="rotator-advancer"><a href="#prev">' + defaults.navText.prev + '</a></span>' : '';
			if (defaults.showNav === true || defaults.showNav == "number") {
				nav += '<span class="rotator-num">';
				for (var k = 0; k < defaults.numPost; k++) {
					nav += '<a href="#slide-' + k + '" class="' + (k === 0 ? "current" : "") + '">' + (k + 1) + '</a>';
				}
				nav += '</span>';
			}
			nav += (defaults.showNav === true || defaults.showNav == "next/prev") ? '<span class="rotator-advancer"><a href="#next">' + defaults.navText.next + '</a></span>' : '';
			nav += '</div>';
			$('#' + defaults.containerId).html(skeleton).after(nav);
			defaults.onInit();
			$('#' + defaults.containerId).removeClass('loading').customRotator({
				interval: defaults.interval,
				speed: defaults.speed,
				autoHeight: defaults.autoHeight,
				hoverPause: defaults.hoverPause,
				crossFade: defaults.crossFade,
				autoSlide: defaults.autoSlide,
				hide: function(index) {
					defaults.onHide(index);
				},
				show: function(index) {
					defaults.onShow(index);
				}
			});
		} else {
			$('#' + defaults.containerId).removeClass('loading').css({
				width:"auto",
				height:"auto"
			}).html('Error or not found!');
		}
	}, "jsonp");
}

// Just personal notes. Ignore this!
// 1. http://stackoverflow.com/questions/6112671/settimeout-speeds-up-with-multiple-tabs/6112864#6112864
// 2. http://stackoverflow.com/questions/1157409/why-does-my-settimeout-speed-up-when-i-have-multiple-tabs-open-to-my-site