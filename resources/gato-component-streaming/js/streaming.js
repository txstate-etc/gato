// https://github.com/Zod-/jsVideoUrlParser, Copyright (c) 2018 Julian Hangstörfer The MIT License (MIT)
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.urlParser=t()}(this,function(){"use strict";function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(t)}var t=function(t){if("object"!==e(t))return"";t.params=t.params||{};var r="",i=0,a=Object.keys(t.params);if(0===a.length)return"";for(a.sort(),t.hasParams||(r+="?"+a[0]+"="+t.params[a[0]],i+=1);i<a.length;i+=1)r+="&"+a[i]+"="+t.params[a[i]];return r},r=function(e){return void 0===e?0:e.match(/^(\d+[smhdw]?)+$/)?function(e){var t,r=0,i={s:1,m:60,h:3600,d:86400,w:604800};t=(e=e.replace(/([smhdw])/g," $1 ").trim()).split(" ");for(var a=0;a<t.length;a+=2)r+=parseInt(t[a],10)*i[t[a+1]||"s"];return r}(e):e.match(/^(\d+:?)+$/)?function(e){for(var t=0,r=[1,60,3600,86400,604800],i=e.split(":"),a=0;a<i.length;a++)t+=parseInt(i[a],10)*r[i.length-a-1];return t}(e):0},i=function(e){if("string"!=typeof e)return{};var t,r={},i=(e=e.split("+").join(" ")).match(/(?:[?](?:[^=]+)=(?:[^&#]*)(?:[&](?:[^=]+)=(?:[^&#]*))*(?:[#].*)?)|(?:[#].*)/);if(null===i)return{};t=i[0].substr(1).split(/[&#=]/);for(var a=0;a<t.length;a+=2)r[decodeURIComponent(t[a])]=decodeURIComponent(t[a+1]||"");return r};function a(){for(var e=["parseProvider","parse","bind","create"],t=0;t<e.length;t++){var r=e[t];this[r]=this[r].bind(this)}this.plugins={}}var s=a;a.prototype.parseProvider=function(e){var t=e.match(/(?:(?:https?:)?\/\/)?(?:[^.]+\.)?(\w+)\./i);return t?t[1]:void 0},a.prototype.parse=function(e){if(void 0!==e){var t,r=this.parseProvider(e),a=this.plugins[r];if(r&&a&&a.parse)return(t=a.parse.call(a,e,i(e)))&&((t=function(e){e.params&&0===Object.keys(e.params).length&&delete e.params;return e}(t)).provider=a.provider),t}},a.prototype.bind=function(e){if(this.plugins[e.provider]=e,e.alternatives)for(var t=0;t<e.alternatives.length;t+=1)this.plugins[e.alternatives[t]]=e},a.prototype.create=function(e){var t=e.videoInfo,r=e.params,i=this.plugins[t.provider];if(r="internal"===r?t.params:r||{},i&&(e.format=e.format||i.defaultFormat,i.formats.hasOwnProperty(e.format)))return i.formats[e.format].apply(i,[t,Object.assign({},r)])};var o=new s,p=t;function n(){this.provider="canalplus",this.defaultFormat="embed",this.formats={embed:this.createEmbedUrl},this.mediaTypes={VIDEO:"video"}}n.prototype.parseParameters=function(e){return delete e.vid,e},n.prototype.parse=function(e,t){var r={mediaType:this.mediaTypes.VIDEO,id:t.vid};if(r.params=this.parseParameters(t),r.id)return r},n.prototype.createEmbedUrl=function(e,t){var r="http://player.canalplus.fr/embed/";return t.vid=e.id,r+=p({params:t})},o.bind(new n);var d=t;function l(){this.provider="coub",this.defaultFormat="long",this.formats={long:this.createLongUrl,embed:this.createEmbedUrl},this.mediaTypes={VIDEO:"video"}}l.prototype.parseUrl=function(e){var t=e.match(/(?:embed|view)\/([a-zA-Z\d]+)/i);return t?t[1]:void 0},l.prototype.parse=function(e,t){var r={mediaType:this.mediaTypes.VIDEO,params:t,id:this.parseUrl(e)};if(r.id)return r},l.prototype.createUrl=function(e,t,r){var i=e+t.id;return i+=d({params:r})},l.prototype.createLongUrl=function(e,t){return this.createUrl("https://coub.com/view/",e,t)},l.prototype.createEmbedUrl=function(e,t){return this.createUrl("//coub.com/embed/",e,t)},o.bind(new l);var m=t,c=r;function u(){this.provider="dailymotion",this.alternatives=["dai"],this.defaultFormat="long",this.formats={short:this.createShortUrl,long:this.createLongUrl,embed:this.createEmbedUrl},this.mediaTypes={VIDEO:"video"}}u.prototype.parseParameters=function(e){return this.parseTime(e)},u.prototype.parseTime=function(e){return e.start&&(e.start=c(e.start)),e},u.prototype.parseUrl=function(e){var t=e.match(/(?:\/video|ly)\/([A-Za-z0-9]+)/i);return t?t[1]:void 0},u.prototype.parse=function(e,t){var r={mediaType:this.mediaTypes.VIDEO,params:this.parseParameters(t),id:this.parseUrl(e)};return r.id?r:void 0},u.prototype.createUrl=function(e,t,r){return e+t.id+m({params:r})},u.prototype.createShortUrl=function(e){return this.createUrl("https://dai.ly/",e,{})},u.prototype.createLongUrl=function(e,t){return this.createUrl("https://dailymotion.com/video/",e,t)},u.prototype.createEmbedUrl=function(e,t){return this.createUrl("//www.dailymotion.com/embed/video/",e,t)},o.bind(new u);var h=t,y=r;function f(){this.provider="twitch",this.defaultFormat="long",this.formats={long:this.createLongUrl,embed:this.createEmbedUrl},this.mediaTypes={VIDEO:"video",STREAM:"stream",CLIP:"clip"}}f.prototype.seperateId=function(e){return{pre:e[0],id:e.substr(1)}},f.prototype.parseChannel=function(e,t){var r=t.channel||t.utm_content||e.channel;return delete t.utm_content,delete t.channel,r},f.prototype.parseUrl=function(e,t,r){var i;return(i=e.match(/(clips\.)?twitch\.tv\/(?:(?:videos\/(\d+))|(\w+))?/i))&&i[2]?t.id="v"+i[2]:r.video?(t.id=r.video,delete r.video):r.clip?(t.id=r.clip,t.isClip=!0,delete r.clip):i&&i[1]&&i[3]?(t.id=i[3],t.isClip=!0):i&&i[3]&&(t.channel=i[3]),t},f.prototype.parseMediaType=function(e){var t;return e.channel?t=this.mediaTypes.STREAM:e.id&&(e.isClip?(t=this.mediaTypes.CLIP,delete e.isClip):t=this.mediaTypes.VIDEO,delete e.channel),t},f.prototype.parseParameters=function(e){return e.t&&(e.start=y(e.t),delete e.t),e},f.prototype.parse=function(e,t){var r={};return(r=this.parseUrl(e,r,t)).channel=this.parseChannel(r,t),r.mediaType=this.parseMediaType(r),r.params=this.parseParameters(t),r.channel||r.id?r:void 0},f.prototype.createLongUrl=function(e,t){var r="";(e.mediaType===this.mediaTypes.STREAM&&(r="https://twitch.tv/"+e.channel),e.mediaType===this.mediaTypes.VIDEO)&&(r="https://twitch.tv/videos/"+this.seperateId(e.id).id,t.start&&(t.t=t.start+"s",delete t.start));return e.mediaType===this.mediaTypes.CLIP&&(r="https://clips.twitch.tv/"+e.id),r+=h({params:t})},f.prototype.createEmbedUrl=function(e,t){var r="https://player.twitch.tv/";return e.mediaType===this.mediaTypes.STREAM&&(t.channel=e.channel),e.mediaType===this.mediaTypes.VIDEO&&(t.video=e.id,t.start&&(t.t=t.start+"s",delete t.start)),e.mediaType===this.mediaTypes.CLIP&&(r="https://clips.twitch.tv/embed",t.clip=e.id),r+=h({params:t})},o.bind(new f);var v=t,T=r;function U(){this.provider="vimeo",this.alternatives=["vimeopro"],this.defaultFormat="long",this.formats={long:this.createLongUrl,embed:this.createEmbedUrl},this.mediaTypes={VIDEO:"video"}}U.prototype.parseUrl=function(e){var t=e.match(/(?:\/(?:channels\/[\w]+|(?:(?:album\/\d+|groups\/[\w]+)\/)?videos?))?\/(\d+)/i);return t?t[1]:void 0},U.prototype.parseParameters=function(e){return this.parseTime(e)},U.prototype.parseTime=function(e){return e.t&&(e.start=T(e.t),delete e.t),e},U.prototype.parse=function(e,t){var r={mediaType:this.mediaTypes.VIDEO,params:this.parseParameters(t),id:this.parseUrl(e)};return r.id?r:void 0},U.prototype.createUrl=function(e,t,r){var i=e+t.id,a=r.start;return delete r.start,i+=v({params:r}),a&&(i+="#t="+a),i},U.prototype.createLongUrl=function(e,t){return this.createUrl("https://vimeo.com/",e,t)},U.prototype.createEmbedUrl=function(e,t){return this.createUrl("//player.vimeo.com/video/",e,t)},o.bind(new U);var b=t,g=r;function I(){this.provider="wistia",this.alternatives=[],this.defaultFormat="long",this.formats={long:this.createLongUrl,embed:this.createEmbedUrl,embedjsonp:this.createEmbedJsonpUrl},this.mediaTypes={VIDEO:"video",EMBEDVIDEO:"embedvideo"}}I.prototype.parseUrl=function(e){var t=e.match(/(?:(?:medias|iframe)\/|wvideo=)([\w-]+)/);return t?t[1]:void 0},I.prototype.parseChannel=function(e){var t=e.match(/(?:(?:https?:)?\/\/)?([^.]*)\.wistia\./),r=t?t[1]:void 0;if("fast"!==r&&"content"!==r)return r},I.prototype.parseParameters=function(e,t){return e.wtime&&(e.start=g(e.wtime),delete e.wtime),e.wvideo===t.id&&delete e.wvideo,e},I.prototype.parseMediaType=function(e){return e.id&&e.channel?this.mediaTypes.VIDEO:e.id?(delete e.channel,this.mediaTypes.EMBEDVIDEO):void 0},I.prototype.parse=function(e,t){var r={id:this.parseUrl(e),channel:this.parseChannel(e)};if(r.params=this.parseParameters(t,r),r.mediaType=this.parseMediaType(r),r.id)return r},I.prototype.createUrl=function(e,t,r){return t.start&&(t.wtime=t.start,delete t.start),r+=b({params:t})},I.prototype.createLongUrl=function(e,t){if(e.mediaType!==this.mediaTypes.VIDEO)return"";var r="https://"+e.channel+".wistia.com/medias/"+e.id;return this.createUrl(e,t,r)},I.prototype.createEmbedUrl=function(e,t){var r="https://fast.wistia.com/embed/iframe/"+e.id;return this.createUrl(e,t,r)},I.prototype.createEmbedJsonpUrl=function(e){return"https://fast.wistia.com/embed/medias/"+e.id+".jsonp"},o.bind(new I);var E=t;function w(){this.provider="youku",this.defaultFormat="long",this.formats={embed:this.createEmbedUrl,long:this.createLongUrl,flash:this.createFlashUrl,static:this.createStaticUrl},this.mediaTypes={VIDEO:"video"}}w.prototype.parseUrl=function(e){var t=e.match(/(?:(?:embed|sid)\/|v_show\/id_|VideoIDS=)([a-zA-Z0-9]+)/);return t?t[1]:void 0},w.prototype.parseParameters=function(e){return e.VideoIDS&&delete e.VideoIDS,e},w.prototype.parse=function(e,t){var r={mediaType:this.mediaTypes.VIDEO,id:this.parseUrl(e),params:this.parseParameters(t)};if(r.id)return r},w.prototype.createUrl=function(e,t,r){var i=e+t.id;return i+=E({params:r})},w.prototype.createEmbedUrl=function(e,t){return this.createUrl("http://player.youku.com/embed/",e,t)},w.prototype.createLongUrl=function(e,t){return this.createUrl("http://v.youku.com/v_show/id_",e,t)},w.prototype.createStaticUrl=function(e,t){return this.createUrl("http://static.youku.com/v1.0.0638/v/swf/loader.swf?VideoIDS=",e,t)},w.prototype.createFlashUrl=function(e,t){var r="http://player.youku.com/player.php/sid/"+e.id+"/v.swf";return r+=E({params:t})},o.bind(new w);var L=t,A=r;function P(){this.provider="youtube",this.alternatives=["youtu","ytimg"],this.defaultFormat="long",this.formats={short:this.createShortUrl,long:this.createLongUrl,embed:this.createEmbedUrl,shortImage:this.createShortImageUrl,longImage:this.createLongImageUrl},this.imageQualities={0:"0",1:"1",2:"2",3:"3",DEFAULT:"default",HQDEFAULT:"hqdefault",SDDEFAULT:"sddefault",MQDEFAULT:"mqdefault",MAXRESDEFAULT:"maxresdefault"},this.defaultImageQuality=this.imageQualities.HQDEFAULT,this.mediaTypes={VIDEO:"video",PLAYLIST:"playlist",SHARE:"share"}}P.prototype.parseUrl=function(e){var t=e.match(/(?:(?:v|vi|be|videos|embed)\/(?!videoseries)|(?:v|ci)=)([\w-]{11})/i);return t?t[1]:void 0},P.prototype.parseParameters=function(e,t){return(e.start||e.t)&&(e.start=A(e.start||e.t),delete e.t),e.v===t.id&&delete e.v,e.list===t.id&&delete e.list,e},P.prototype.parseMediaType=function(e){if(e.params.list&&(e.list=e.params.list,delete e.params.list),e.id&&!e.params.ci)e.mediaType=this.mediaTypes.VIDEO;else if(e.list)delete e.id,e.mediaType=this.mediaTypes.PLAYLIST;else{if(!e.params.ci)return;delete e.params.ci,e.mediaType=this.mediaTypes.SHARE}return e},P.prototype.parse=function(e,t){var r={params:t,id:this.parseUrl(e)};return r.params=this.parseParameters(t,r),r=this.parseMediaType(r)},P.prototype.createShortUrl=function(e,t){var r="https://youtu.be/"+e.id;return t.start&&(r+="#t="+t.start),r},P.prototype.createLongUrl=function(e,t){var r="",i=t.start;return delete t.start,e.mediaType===this.mediaTypes.PLAYLIST&&(t.feature="share",r+="https://youtube.com/playlist"),e.mediaType===this.mediaTypes.VIDEO&&(t.v=e.id,r+="https://youtube.com/watch"),e.mediaType===this.mediaTypes.SHARE&&(t.ci=e.id,r+="https://www.youtube.com/shared"),e.list&&(t.list=e.list),r+=L({params:t}),e.mediaType!==this.mediaTypes.PLAYLIST&&i&&(r+="#t="+i),r},P.prototype.createEmbedUrl=function(e,t){var r="//youtube.com/embed";return e.mediaType===this.mediaTypes.PLAYLIST?t.listType="playlist":(r+="/"+e.id,"1"===t.loop&&(t.playlist=e.id)),e.list&&(t.list=e.list),r+=L({params:t})},P.prototype.createImageUrl=function(e,t,r){return e+t.id+"/"+(r.imageQuality||this.defaultImageQuality)+".jpg"},P.prototype.createShortImageUrl=function(e,t){return this.createImageUrl("https://i.ytimg.com/vi/",e,t)},P.prototype.createLongImageUrl=function(e,t){return this.createImageUrl("https://img.youtube.com/vi/",e,t)},o.bind(new P);var S=t,D=r;function O(){this.provider="soundcloud",this.defaultFormat="long",this.formats={long:this.createLongUrl,embed:this.createEmbedUrl},this.mediaTypes={TRACK:"track",PLAYLIST:"playlist",APITRACK:"apitrack",APIPLAYLIST:"apiplaylist"}}return O.prototype.parseUrl=function(e,t){var r=e.match(/soundcloud\.com\/(?:([\w-]+)\/(sets\/)?)([\w-]+)/i);return r?(t.channel=r[1],"playlists"===r[1]||r[2]?t.list=r[3]:t.id=r[3],t):t},O.prototype.parseParameters=function(e){return e.t&&(e.start=D(e.t),delete e.t),e},O.prototype.parseMediaType=function(e){return e.id&&("tracks"===e.channel?(delete e.channel,delete e.params.url,e.mediaType=this.mediaTypes.APITRACK):e.mediaType=this.mediaTypes.TRACK),e.list&&("playlists"===e.channel?(delete e.channel,delete e.params.url,e.mediaType=this.mediaTypes.APIPLAYLIST):e.mediaType=this.mediaTypes.PLAYLIST),e},O.prototype.parse=function(e,t){var r={};if((r=this.parseUrl(e,r)).params=this.parseParameters(t),(r=this.parseMediaType(r)).id||r.list)return r},O.prototype.createLongUrl=function(e,t){var r="",i=t.start;return delete t.start,e.mediaType===this.mediaTypes.TRACK&&(r="https://soundcloud.com/"+e.channel+"/"+e.id),e.mediaType===this.mediaTypes.PLAYLIST&&(r="https://soundcloud.com/"+e.channel+"/sets/"+e.list),e.mediaType===this.mediaTypes.APITRACK&&(r="https://api.soundcloud.com/tracks/"+e.id),e.mediaType===this.mediaTypes.APIPLAYLIST&&(r="https://api.soundcloud.com/playlists/"+e.list),r+=S({params:t}),i&&(r+="#t="+i),r},O.prototype.createEmbedUrl=function(e,t){var r="https://w.soundcloud.com/player/";return delete t.start,e.mediaType===this.mediaTypes.APITRACK&&(t.url="https%3A//api.soundcloud.com/tracks/"+e.id),e.mediaType===this.mediaTypes.APIPLAYLIST&&(t.url="https%3A//api.soundcloud.com/playlists/"+e.list),r+=S({params:t})},o.bind(new O),o});

var flowPlayerTypes = {
  "mp4": "video/mp4",
  "m4v": "video/mp4",
  "webm": "video/webm",
  "ogv": "video/ogg",
  "m3u8": "application/x-mpegurl",
  "flv": "video/flash"
}

function getVideoInfo(url) {
  var vInfo = {};
  vInfo.url = url;
  var urlInfo = urlParser.parse(vInfo.url);

  if (urlInfo) {
    vInfo.playerType = urlInfo.provider;
    vInfo.videoId = urlInfo.id;
  } else if (url.match(/^https:\/\/mediaflo\.txstate\.edu/)) {
    vInfo.playerType = "mediaflo";
  } else if (url.startsWith("<iframe") && url.endsWith("</iframe>")) {
    vInfo.playerType = "embed";
    vInfo.embed = url;
  } else if (flowPlayerTypes[getFileExtension(url)]) {
    vInfo.playerType = "flow";
    vInfo.videoType = flowPlayerTypes[getFileExtension(url)];
  } else {
    vInfo.playerType = "unknown";
  }

  return vInfo;
}

function getFileExtension(url) {
  url = url.split('?', 2)[0];
  var dot = url.lastIndexOf('.');
  if (dot == -1) { return ''; }

  return url.substr(dot + 1);
}

function createPlayer(el, url) {
  var vInfo = getVideoInfo(url);

  var embedcode = jQuery(el).data('embed');
  if (!isBlank(embedcode)) return oEmbedFinished(el, embedcode, vInfo);

  if (vInfo.playerType == "embed") return oEmbedFinished(el, vInfo.embed, vInfo);
  if (vInfo.playerType == "flow") return buildFlowPlayer(el, vInfo);
  return oEmbedAutodiscover(el, vInfo);
}

function buildFlowPlayer(el, videoInfo) {
  var container = jQuery('<div class="functional"></div>');
  jQuery(el).append(container);
  var usehlsjs = false;
  var startflowplayer = function () {
    flowplayer(container, {
      embed: false,
      hlsjs: usehlsjs,
      autoplay: false,
      clip: {
        sources: [{ type: videoInfo.videoType, src: videoInfo.url}]
      }
    });
  }
  if (videoInfo.videoType == flowPlayerTypes['m3u8']) jQuery.ajax(videoInfo.url).done(function() { usehlsjs = {}; startflowplayer(); }).fail(startflowplayer);
  else startflowplayer();
  var iframe = jQuery(el).find('iframe');
  if (iframe.length && !iframe.attr('title')) {
    iframe.attr('title', 'Video Player');
  }
}

function oEmbedGetInfo(el, oembedurl, vInfo) {
  jQuery.ajax(oembedurl, {dataType: 'json'})
    .done(function(data) {
      oEmbedFinished(el, data.html, vInfo);
    })
    .fail(function () { buildUnknownPlayer(el, vInfo.url); });
}

function oEmbedAutodiscover(el, vInfo) {
  jQuery.ajax(vInfo.url, {dataType: 'xml'})
    .done(function(data) {
      var oembedurl = jQuery('link[type="application/json+oembed"]', data).attr('href');
      if (!isBlank(oembedurl)) oEmbedGetInfo(el, oembedurl, vInfo);
      else buildUnknownPlayer(el, vInfo.url);
    })
    .fail(function () { buildUnknownPlayer(el, vInfo.url); });
}

function oEmbedFinished(el, embedcode, vInfo) {
  el = jQuery(el);
  el.html(embedcode);
  var iframe = el.find('iframe');
  iframe.removeAttr('frameborder');
  var title = el.data('embedtitle');
  if (title) iframe.attr('title', title);
  else if (!iframe.attr('title')) iframe.attr('title', 'Video Player');
  if (vInfo.playerType == "youtube" && el.data('openinapp') && is_url_scheme_appropriate()) {
    var appurl = vInfo.url.replace(/^https?:/, 'vnd.youtube:');
    el.after('<div class="streaming-open-in-app"><a href="'+appurl+'">Open 360 video in YouTube <i class="fa fa-chevron-right" aria-hidden="true"></i></a></div>');
  }
}

function buildUnknownPlayer(el, url) {
  if (url.startsWith("http")) {
    jQuery(el).append('<a href="' + url + '">' + url + '</a>');
  } else {
    el.innerHTML = "Sorry, we're unable to play this video.";
  }
  jQuery(el).closest('.gatoEmbedContainer').removeClass('gatoEmbedContainer');
}

jQuery(document).ready(function($) {
  $('.gatoEmbedContainer').each(function(i) {
    var container = this;
    container.id = 'gato-player-' + i;
    createPlayer(container, jQuery(container).data("url"));
  });
});
