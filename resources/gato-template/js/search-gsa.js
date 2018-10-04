(function($) {
var featured_url = 'https://mwsfeaturedsearchqa1.tr.qual.txstate.edu/search';
window.Search = function(opts) {
  opts = opts || {};
  if (!(this instanceof Search)) {
    return new Search(opts);
  }
  this.opts = {
    num: opts.num || 5,
    start: opts.start || 1,
    url: opts.url || 'https://www.googleapis.com/customsearch/v1',
    sitesearch: opts.sitesearch || 'txstate.edu',
    sort: opts.sort || 'relevance',
    site: opts.site || 'txstate_no_users',
    client: opts.client || 'txstate'
  }
  var cxMap = {
    'txstate_no_users': '004527626732577828901:1rcpwk8svkk'
  }
  this.opts.cx = cxMap[this.opts.site];
}

Search.prototype.doSearch = function(query) {
  var self = this;
  self.query = query;
  var params = {
    cx: self.opts.cx,
    key: 'AIzaSyAmrKoaQqaobY1foPLpmsDwOQrdCyIpyvs',
    siteSearch: self.opts.sitesearch,
    start: self.opts.start,
    num: self.opts.num,
    q: self.query,
    sort: (self.opts.sort == 'date' ? 'date:a:s' : '')
  };

  var dfd = $.Deferred();
  $.get(self.opts.url, params).then(function (data) {
    var result = {};
    result.total = parseInt(data.queries.request[0].totalResults, 10);
    result.start = params.start;
    result.end = (params.start + params.num - 1) > result.total ? result.total : (params.start + params.num - 1);
    result.type = "web";
    result.results = [];
    var seen = {};
    for (var i = 0; data.items && i < data.items.length; i++) {
      var item = data.items[i];
      var itemobj = {
        title: item.title,
        summary_html: item.htmlSnippet,
        url: item.link,
        url_display: item.displayLink,
        date: "",
        featured: false
      };
      try {
        itemobj.date = item.pagemap.metatags[0]['dc.date'];
      } catch (e) {
        // no date
      }
      seen[item.link] = true;
      result.results.push(itemobj);
    }
    self.featured(params.q, seen).then(function (featuredresults) {
      result.results = featuredresults.concat(result.results)
    }).fail(function (e) {
      console.log(e);
    }).always(function () {
      dfd.resolve(result);
    });
  }).fail(function (e) {
    dfd.reject({
      pages: [],
      error: e
    });
  });

  return dfd.promise();
}

Search.prototype.featured = function (query, seen) {
  if (!seen) seen = {};
  var dfd = $.Deferred();
  $.get(featured_url, {q: query}).then(function (featured) {
    var results = [];
    for (var i = 0; i < featured.length; i++) {
      var item = featured[i];
      if (!seen[item.url]) {
        results.push({
          title: item.title,
          summary_html: "",
          url: item.url,
          url_display: item.url,
          date: "",
          featured: true
        });
      }
    }
    dfd.resolve(results);
  }).fail(function (e) {
    dfd.reject(e);
  })
  return dfd.promise();
}
})(jQuery);
