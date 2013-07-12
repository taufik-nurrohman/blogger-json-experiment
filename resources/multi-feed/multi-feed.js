// Multi Feed Loader Script by Taufik Nurrohman
// URL: http://www.dte.web.id, https://plus.google.com/108949996304093815163/about

var mf_defaults = {
	feedsUri: [
		{
			name: "Posting JQuery",
			url: "http://www.dte.web.id",
			tag: "JQuery"
		},
		{
			name: "Posting CSS",
			url: "http://www.dte.web.id",
			tag: "CSS"
		},
		{
			name: "Widget-Widget Blogger",
			url: "http://www.dte.web.id",
			tag: "Widget"
		}
	],
	numPost: 4,
	showThumbnail: true,
	showSummary: true,
	summaryLength: 80,
	titleLength: "auto",
	thumbSize: 72,
	newTabLink: false,
	containerId: "feed-list-container",
	listClass: "list-entries",
	readMore: {
		text: "More",
		endParam: "?max-results=20"
	},
	autoHeight: false,
	current: 0,
	onLoadFeed: function(i) {
		// console.log(this.feedsUri[i].name);
	},
	onLoadComplete: function() {
		// console.log('Fully Loaded!');
	},
	loadFeed: function(index) {
		var head = document.getElementsByTagName('head')[0],
			cont = document.getElementById(this.containerId),
			script = document.createElement('script');
			script.type = "text/javascript";
			script.src = this.feedsUri[index].url + '/feeds/posts/summary' + (this.feedsUri[index].tag ? '/-/' + this.feedsUri[index].tag : '') + '?alt=json-in-script&max-results=' + this.numPost + '&callback=listEntries';
		head.appendChild(script);
	}
};

for (var i in mf_defaults) {
	mf_defaults[i] = (typeof (multiFeed[i]) !== undefined && typeof (multiFeed[i]) !== 'undefined') ? multiFeed[i] : mf_defaults[i];
}

function listEntries(json) {
	var entry = json.feed.entry,
		o = mf_defaults,
		ct = document.getElementById(o.containerId),
		div = document.createElement('div'),
		skeleton = "<ul>",
		total = o.feedsUri.length,
		title, link, summ, img;
	for (var i = 0; i < o.numPost; i++) {
		if (i == entry.length) break;
		title = (o.titleLength !== "auto") ? entry[i].title.$t.substring(0, o.titleLength) + (o.titleLength < entry[i].title.$t.length ? '&hellip;' : '') : entry[i].title.$t;
		summ = ("summary" in entry[i]) ? entry[i].summary.$t.replace(/<br ?\/?>/g, " ").replace(/<.*?>/g, "").replace(/[<>]/g, "") : "";
		summ = (o.summaryLength < summ.length) ? summ.substring(0, o.summaryLength) + '&hellip;' : summ;
		img = ("media$thumbnail" in entry[i]) ? '<img src="' + entry[i].media$thumbnail.url.replace(/\/s72(\-c)?\//, "/s" + o.thumbSize + "-c/") + '" style="width:' + o.thumbSize + 'px;height:' + o.thumbSize + 'px;">' : '<span class="fake-img" style="width:' + o.thumbSize + 'px;height:' + o.thumbSize + 'px;"></span>';
		for (var j = 0, jen = entry[i].link.length; j < jen; j++) {
			link = (entry[i].link[j].rel == 'alternate') ? entry[i].link[j].href : '#';
		}
		skeleton += '<li><div class="inner"' + (!o.autoHeight ? ' style="height:' + o.thumbSize + 'px;overflow:hidden;"' : '') + '>';
		skeleton += (o.showThumbnail) ? img : '';
		skeleton += '<div class="title"><a href="' + link + '"' + (o.newTabLink ? ' target="_blank"' : '') + '>' + title + '</a></div>';
		skeleton += '<div class="summary">';
		skeleton += '<span' + (!o.showSummary ? ' style="display:none;"' : '')  + '>';
		skeleton += (o.showSummary) ? summ : '';
		skeleton += '</span></div>';
		skeleton += '<span style="display:block;clear:both;"></span></div></li>';
	}
	skeleton += '</ul>';
	skeleton += '<div class="more-link"><a href="' + o.feedsUri[o.current].url.replace(/\/$/, "") + '/search/label/' + o.feedsUri[o.current].tag + o.readMore.endParam + '"' + (o.newTabLink ? ' target="_blank"' : '') + '>' + o.readMore.text + '</a></div>';
	div.className = o.listClass;
	div.innerHTML = '<div class="main-title"><h4>' + o.feedsUri[o.current].name + '</h4></div>' + skeleton;
	ct.appendChild(div);
	o.onLoadFeed(o.current);
	if ((o.current + 1) < total) o.loadFeed(o.current + 1);
	if ((o.current + 1) == total) o.onLoadComplete();
	o.current++;
}

mf_defaults.loadFeed(0);