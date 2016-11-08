(function($) {
window.Search = function(opts) {
  opts = opts || {};
  if (!(this instanceof Search)) {
    return new Search(opts);
  }
  this.opts = {
    num: opts.num || 5,
    start: opts.start || 0,
    url: opts.url || 'http://search.txstate.edu/search',
    site: opts.site || 'txstate.edu',
    sort: opts.sort || 'relevance'
  }
}

Search.prototype.doSearch = function(query) {
  var self = this;
  self.query = query;
  var params = {
    url: self.opts.url,
    site: 'txstate_no_users',
    client: 'txstate',
    output: 'xml_no_dtd',
    sitesearch: self.opts.site,
    start: self.opts.start,
    num: self.opts.num,
    q: self.query,
    sort: (self.opts.sort == 'date' ? 'date:D:S:d1' : 'date:D:L:d1')
  };

  var dfd = $.Deferred();
  $.ajax({
    url: params.url,
    data: params,
    success: function(data, textStatus, jqXHR) {
      console.log(data);
      var result = {};
      result.total = parseInt($(data).find('M').text()) || 0;
      result.type = "web";
      result.results = $(data).find('R').map(function() {
        var url = $(this).find('U').text();
        var url_display = url.replace(/^\w+:\/\//, '');
        if (url_display.length > 40) url_display = url_display.substr(0,40)+"...";
        var title = $(this).find('T').text() || url;
        var summary = $(this).find('S').text() || 'No summary available.';
        var date = $(this).find('FS[NAME="date"]').attr('VALUE');
        return {
          title: title,
          summary_html: summary,
          url: url,
          url_display: url_display,
          date: date
        }
      }).get();
      dfd.resolve(result);
    },
    error: function(jqXHR, textStatus) {
      dfd.reject({
        pages: [],
        error: textStatus
      });
    }
  });

  return dfd.promise();
}
})(jQuery);
