(function($) {
var featured_url = 'https://featured.search.txstate.edu/search';
window.Search = function(opts) {
  opts = opts || {};
  if (!(this instanceof Search)) {
    return new Search(opts);
  }
  this.opts = {
    num: opts.num || 5,
    start: opts.start || 1,
    url: opts.url || 'https://www.googleapis.com/customsearch/v1/siterestrict',
    sitesearch: opts.sitesearch || 'txstate.edu',
    sort: opts.sort || 'relevance',
    site: opts.site || 'txstate_no_users',
    client: opts.client || 'txstate'
  }
  var cxMap = {
    'txstate_no_users': '004527626732577828901:1rcpwk8svkk',
    'support_sites': '004527626732577828901:eevz8v8a43c'
  }
  this.opts.cx = cxMap[this.opts.site] || opts.cx;
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
    var googleresults = [];
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
      googleresults.push(itemobj);
    }
    self.featured(params.q, true).then(function (featuredresults) {
      var seen = {}
      for (var i = 0; i < featuredresults.length; i++) {
        seen[featuredresults[i].url] = true;
      }
      for (var i = 0; i < googleresults.length; i++) {
        if (!seen[googleresults[i].url]) featuredresults.push(googleresults[i]);
      }
      result.results = featuredresults;
    }).fail(function (e) {
      result.results = googleresults;
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

Search.prototype.featured = function (query, complete) {
  var dfd = $.Deferred();
  var opts = {q: query};
  if (!complete) opts.asyoutype = 1;
  $.get(featured_url, opts).then(function (featured) {
    var results = [];
    for (var i = 0; i < featured.length; i++) {
      var item = featured[i];
      results.push({
        title: item.title,
        summary_html: "",
        url: item.url,
        url_display: item.url,
        date: "",
        featured: true
      });
    }
    dfd.resolve(results);
  }).fail(function (e) {
    dfd.reject(e);
  })
  return dfd.promise();
}
})(jQuery);
