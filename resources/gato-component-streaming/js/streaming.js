// https://github.com/Zod-/jsVideoUrlParser, Copyright (c) 2014 Julian Hangstörfer The MIT License (MIT)
function URLParser(){"use strict";this.plugins={}}function cloneObject(a){"use strict";if(null===a||"object"!=typeof a)return a;var b=a.constructor();for(var c in a)b[c]=cloneObject(a[c]);return b}function getQueryParams(a){"use strict";a=a.split("+").join(" ");for(var b,c={},d=/[\?#&]([^=]+)=([^&#]*)/g;b=d.exec(a);)c[decodeURIComponent(b[1])]=decodeURIComponent(b[2]);return c}function combineParams(a){"use strict";var b="",c=0,d=Object.keys(a.params);if(0===d.length)return"";for(d.sort(),a.hasParams||(b+="?"+d[0]+"="+a.params[d[0]],c+=1);c<d.length;c+=1)b+="&"+d[c]+"="+a.params[d[c]];return b}function getTime(a){"use strict";var b,c=0,d={s:1,m:60,h:3600,d:86400,w:604800};if(!a.match(/^(\d+[smhdw]?)+$/))return 0;a=a.replace(/([smhdw])/g," $1 ").trim(),b=a.split(" ");for(var e=0;e<b.length;e+=2)c+=parseInt(b[e],10)*d[b[e+1]||"s"];return c}URLParser.prototype.parse=function(a){"use strict";var b,c=this,d=a.match(/(?:(?:https?:)?\/\/)?(?:[^\.]+\.)?(\w+)\./i),e=d?d[1]:void 0;return d&&e&&c.plugins[e]&&c.plugins[e].parse&&(b=c.plugins[e].parse.call(this,a,getQueryParams(a)))?(b.params&&0===Object.keys(b.params).length&&delete b.params,b.provider=c.plugins[e].provider,b):void 0},URLParser.prototype.bind=function(a){"use strict";var b=this;if(b.plugins[a.provider]=a,a.alternatives)for(var c=0;c<a.alternatives.length;c+=1)b.plugins[a.alternatives[c]]=a},URLParser.prototype.create=function(a){"use strict";var b=this,c=a.videoInfo,d=a.params,e=b.plugins[c.provider];return d="internal"===d?c.params:d||{},e&&(a.format=a.format||e.defaultFormat,e.formats.hasOwnProperty(a.format))?e.formats[a.format](c,cloneObject(d)):void 0};var urlParser=new URLParser;urlParser.bind({provider:"dailymotion",alternatives:["dai"],parse:function(a,b){"use strict";var c,d,e={params:b};return c=a.match(/(?:\/video|ly)\/([A-Za-z0-9]+)/i),d=c?c[1]:void 0,b.hasOwnProperty("start")&&(b.start=getTime(b.start)),d?(e.mediaType="video",e.id=d,e):void 0},defaultFormat:"long",formats:{"short":function(a){"use strict";return"https://dai.ly/"+a.id},"long":function(a,b){"use strict";return"https://dailymotion.com/video/"+a.id+combineParams({params:b})},embed:function(a,b){"use strict";return"//www.dailymotion.com/embed/video/"+a.id+combineParams({params:b})}}}),urlParser.bind({provider:"twitch",parse:function(a,b){"use strict";var c,d,e,f,g={};return c=a.match(/twitch\.tv\/(\w+)(?:\/(.)\/(\d+))?/i),e=c?c[1]:void 0,f=c?c[2]:void 0,d=c?c[3]:void 0,(e=b.channel||b.utm_content||e)?(d?(g.mediaType="video",g.id=d,g.idPrefix=f):g.mediaType="stream",g.channel=e,g):void 0},defaultFormat:"long",formats:{"long":function(a,b){"use strict";var c="";return"stream"===a.mediaType?c="https://twitch.tv/"+a.channel:"video"===a.mediaType&&(c="https://twitch.tv/"+a.channel+"/"+a.idPrefix+"/"+a.id),c+=combineParams({params:b})},embed:function(a,b){"use strict";return"//www.twitch.tv/"+a.channel+"/embed"+combineParams({params:b})}}}),urlParser.bind({provider:"vimeo",alternatives:["vimeopro"],parse:function(a){"use strict";var b,c;return b=a.match(/(?:\/(?:channels\/[\w]+|(?:album\/\d+\/)?videos?))?\/(\d+)/i),c=b?b[1]:void 0,c?{mediaType:"video",id:c}:void 0},defaultFormat:"long",formats:{"long":function(a,b){"use strict";return"https://vimeo.com/"+a.id+combineParams({params:b})},embed:function(a,b){"use strict";return"//player.vimeo.com/video/"+a.id+combineParams({params:b})}}}),urlParser.bind({provider:"youtube",alternatives:["youtu"],parse:function(a,b){"use strict";var c,d,e,f={params:b};if(c=a.match(/(?:(?:v|be|videos|embed)\/(?!videoseries)|v=)([\w\-]{11})/i),d=c?c[1]:void 0,b.v===d&&delete b.v,b.list===d?delete b.list:e=b.list,b.hasOwnProperty("start")&&(b.start=getTime(b.start)),b.hasOwnProperty("t")&&(b.start=getTime(b.t),delete b.t),d)f.mediaType="video",f.id=d,e&&(f.list=e);else{if(!e)return void 0;f.mediaType="playlist",f.list=e}return f},defaultFormat:"long",formats:{"short":function(a,b){"use strict";var c="https://youtu.be/"+a.id;return b.start&&(c+="#t="+b.start),c},embed:function(a,b){"use strict";var c="//youtube.com/embed";return"playlist"===a.mediaType?b.listType="playlist":(c+="/"+a.id,1==b.loop&&(b.playlist=a.id)),c+=combineParams({params:b})},"long":function(a,b){"use strict";var c="",d=b.start;return delete b.start,"playlist"===a.mediaType?(b.feature="share",c+="https://youtube.com/playlist"):(b.v=a.id,c+="https://youtube.com/watch"),c+=combineParams({params:b}),"playlist"!==a.mediaType&&d&&(c+="#t="+d),c},"default":"long"}});

var flowPlayerFormats = ['mp4', 'webm', 'ogv', 'm3u8', 'flv'];
var flowPlayerTypes = {
  "mp4": "video/mp4",
  "webm": "video/webm",
  "ogv": "video/off",
  "m3u8": "application/x-mpegurl",
  "flv": "video/flash"
}

function getVideoInfo(url) {
  var vInfo = {};
  vInfo.url = url;
  urlInfo = urlParser.parse(vInfo.url);

  if (urlInfo) {
    vInfo.playerType = urlInfo.provider;
    vInfo.videoId = urlInfo.id;
  } else if (url.match(/^https:\/\/mediaflo\.txstate\.edu/)) {
    vInfo.playerType = "mediaflo";
  } else if (url.startsWith("<iframe") || url.startsWith("<div")) {
    vInfo.playerType = "embed";
  } else if (jQuery.inArray(getFileExtension(url), flowPlayerFormats) != -1) {
    vInfo.playerType = "flow";
  } else {
    vInfo.playerType = "unknown";
  }

  return vInfo;
}

function getFileExtension(url) {
  var dot = url.lastIndexOf('.');
  if (dot == -1) { return ''; }

  return url.substr(dot + 1);
}

function buildFlowPlayer(el, url) {
  var container = jQuery("<div></div>");
  jQuery(el).append(container);
  var ext = getFileExtension(url);
  flowplayer(container, {
    clip: {
      sources: [{ type: flowPlayerTypes[ext], src: url}]
    }
  });
}

function buildEmbed(el, embedCode) {
  jQuery(el).append(embedCode);
}

function buildMediaflo(el, url) {
  jQuery(el).append('<iframe class="mediaflo-frame" src="' + url + '"></iframe>');
}

function buildUstreamPlayer(el, videoId) {
  var ustreamUrl = "http://www.ustream.tv/embed/" + videoId + "?html5ui=1&autoplay=false";
  var iframe = '<iframe src="' + ustreamUrl + '" webkitallowfullscreen mozallowfullscreen allowfullscreen frameborder="0"></iframe>';
  jQuery(el).append(iframe);
}

function buildVimeoPlayer(el, videoId) {
  var vimeoUrl = "http://player.vimeo.com/video/" + videoId + "?api=1&player_id=" + el.id + "-vimeo" +"&autoplay=0";
  var iframe = '<iframe id="' + el.id + '-vimeo" src="' + vimeoUrl + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
  jQuery(el).append(iframe);
}

function buildYoutubePlayer(el, videoId) {
  jQuery(el).append('<div id="' + el.id + '-youtube"></div>');
  var player = new YT.Player(el.id + '-youtube', { videoId: videoId });
}

function buildPlayer(el, videoInfo) {
  switch(videoInfo.playerType) {
    case "youtube":
      waitForYoutube().then(function() { buildYoutubePlayer(el, videoInfo.videoId); });
      break;
    case "vimeo":
      buildVimeoPlayer(el, videoInfo.videoId);
      break;
    case "ustream":
      buildUstreamPlayer(el, videoInfo.videoId);
      break;
    case "embed":
      buildEmbed(el, videoInfo.url);
      break;
    case "flow":
      buildFlowPlayer(el, videoInfo.url);
      break;
    case "mediaflo":
      buildMediaflo(el, videoInfo.url);
      break;
    case "unknown":
      el.innerHTML = "Sorry, we're unable to play this video.";
      break;
  }

  var iframe = jQuery(el).find('iframe');
  if (iframe.length && !iframe.attr('title')) {
    iframe.attr('title', 'Video Player');
  }
}

jQuery(document).ready(function() {
  jQuery('.gatoEmbedContainer').each(function(i) {
    var container = this;
    container.id = 'gato-player-' + i;

    var videoInfo = getVideoInfo(jQuery(container).data("url"));
    buildPlayer(container, videoInfo);
  });
});

function onPlayerReady(event) {
  event.target.playVideo();
}

function loadStreamingDialog(def, node, el) {
  var container = jQuery('<div class="gatoEmbedContainer" id="videoPreviewContainer"></div>')[0];
  jQuery(container).width(530);
  jQuery(el).append(container);

  var spinnerOptions = {
    lines: 10,
    length: 25,
    width: 12,
    radius: 40,
    rotate: 0,
    color: '#000',
    speed: 1,
    trail: 60,
    shadow: false,
    hwaccel: false,
    zIndex: 2e9
  };

  var spinner = new Spinner(spinnerOptions);

  function loadPreview() {
    spinner.stop();
    var url = jQuery('.videoUrl')[0].value;

    if (url != "") {
      var videoInfo = getVideoInfo(url);
      buildPlayer(container, videoInfo);
    }
  }

  jQuery('.videoUrl').keyup(function() {
    clearTimeout(el.previewTimeout);
    jQuery(container).empty();
    spinner.spin(el);
    el.previewTimeout = setTimeout(loadPreview, 1000);
  });

  jQuery('.videoUrl').change(function() {
    clearTimeout(el.previewTimeout);
    jQuery(container).empty();
    loadPreview();
  })

  // Wait for Vaadin stuff to happen. Wish we didn't have to do this,
  // but it's just a preview of the video so shouldn't be a big deal if
  // it doesn't load right away.
  setTimeout(loadPreview, 500);
}

var youtubeApiPromise = jQuery.Deferred();

function waitForYoutube() {
  loadYoutubeScript();
  return youtubeApiPromise;
}

function loadYoutubeScript() {
  if (jQuery('#ytApiScript').length) { return; }

  var script = document.createElement('script');
  script.src = "https://youtube.com/iframe_api";
  script.id = 'ytApiScript';

  document.body.appendChild(script);
}

function onYouTubeIframeAPIReady() {
  youtubeApiPromise.resolve();
}
