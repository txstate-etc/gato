jQuery(document).ready(function($) {
  // config
  var perpage_web = 10;
  var perpage_people = 10;

  var container = $('.search-container');
  var tab_web = $('.search-tab-web');
  var tab_people = $('.search-tab-people');
  var results_web = $('.search-web');
  var results_people = $('.search-people');

  var change_tab = function (type) {
    var params = getUrlParameters();
    if (params.type != type) {
      params.type = type;
      history.pushState(null, null, createUrlQuery(params));
    }
    if (type == 'people') {
      container.removeClass('web');
      container.addClass('people');
      tab_web.attr('aria-selected', 'false');
      tab_people.attr('aria-selected', 'true');
    } else { // web
      container.removeClass('people');
      container.addClass('web');
      tab_web.attr('aria-selected', 'true');
      tab_people.attr('aria-selected', 'false');
    }
  }

  var fill_web_search = function (query, sort, page, perpage) {
    if (!page || page < 1) page = 1;
    var search = new Search({start: (page-1)*perpage, num: 10, sort: sort});
    search.doSearch(query)
      .done(function(data){
        console.log(data);
        var html = '';
        $.each(data.results, function (i, result) {
          html += html_result_web(result);
        });
        html += html_pagination(page, Math.ceil(data.total / perpage));
        $('.search-web').html(html);
      })
      .fail(function(e){
        console.log(e)
      })
  }

  var fill_people_search = function (query, page, perpage) {
    if (!page || page < 1) page = 1;
    $.ajax("https://secure.its.txstate.edu/iphone/people/json.pl?q="+encodeURIComponent(query)+'&n=500')
      .done(function(data) {
        console.log(data);
        var html = '';
        var htmlshort = '';
        var sortvalue = function (cat) {
          if (cat == "Staff") return 0;
          if (cat == "Faculty") return 1;
          if (cat == "Retired Staff") return 2;
          if (cat == "Retired Faculty") return 3;
          if (cat == "Doctoral") return 4;
          if (cat == "Masters") return 5;
          return 10;
        }
        data.results.sort(function (a,b) {
          return sortvalue(a.category) - sortvalue(b.category);
        });
        var start = (page-1)*perpage;
        for (var i = start; i < start+perpage; i++) {
          html += html_result_people(data.results[i]);
        }
        for (var i = 0; i < 3; i++) {
          htmlshort += html_result_people_short(data.results[i]);
        }
        html += html_pagination(page, Math.ceil(data.count / perpage));
        $('.search-people').html(html);
        $('.search-side-results').html(htmlshort);
      })
      .fail(function(jqxhr, status, error) {
        console.log(error);
      })
  }

  var search = function (params) {
    change_tab(params.type);
    fill_web_search(params.q, params.sort, params.webpage, perpage_web);
    fill_people_search(params.q, params.peoplepage, perpage_people);
  }

  var load_from_state = function () {
    var params = getUrlParameters();
    $('.search-form .search').val(params.q);
    search(params);
  }

  var update_state = function (params) {
    history.pushState(null, null, createUrlQuery(params));
    load_from_state();
  }

  var html_result_web = function (result) {
    return '<div class="result">' +
             '<a class="result-title" href="' + result.url +'">' + result.title + '</a>' +
             '<p class="summary">' + result.summary_html + '</p>' +
             '<a class="result-url-display" href="' + result.url + '">' + result.url_display + '</a>' +
           '</div>';
  }

  var html_result_people = function (result) {
    return '<div class="person">'+
             '<div class="person-name">'+result.firstname+' '+result.lastname+'</div>'+
             '<div class="person-title">'+result.title+'</div>'+
             '<div class="person-department">'+result.department+'</div>'+
             '<div class="person-category">'+result.category+'</div>'+
             '<div class="person-address">'+result.address+'</div>'+
             '<div class="person-phone">'+result.phone+'</div>'+
             (result.email != 'unauthenticated' ?
               '<a class="person-email" href="mailto:'+result.email+'">'+result.email+'</a>' : '')+
           '</div>';
  }

  var html_result_people_short = function (result) {
    var html = '<div class="person">';
    html += '<div class="person-name">'+result.firstname+' '+result.lastname+'</div>';
    html += '<div class="person-category">'+result.category+'</div>';
    html += '<div class="person-phone">'+result.phone+'</div>';
    if (result.email != 'unauthenticated')
      html += '<a class="person-email" href="mailto:'+result.email+'">'+result.email+'</a>';
    html += '</div>';
    return html;
  }

  var html_pagination = function (page, lastpage) {
    var html = '<div class="visuallyhidden">Pagination</div>';
    html += '<ul role="navigation" class="pagination">';
    html += '<li><a href="#" class="pagination-link" aria-label="Previous Page" data-page="'+Math.max(page-1, 1)+'" aria-disabled="'+(page == 1 ? 'true' : 'false')+'">Prev</a></li>';
    for (var i = Math.max(page-3, 1); i <= Math.min(page+3, lastpage); i++) {
      if (i == page)
        html += '<li><a href="#" class="pagination-link active" aria-label="You are currently reading page '+i+'" data-page"'+i+'">'+i+'</a></li>';
      else
        html += '<li><a href="#" class="pagination-link" aria-label="Page '+i+'" data-page"'+i+'">'+i+'</a></li>';
    }
    html += '<li><a href="#" class="pagination-link" aria-label="Next Page" data-page="'+Math.min(page+1, lastpage)+'" aria-disabled="'+(page == lastpage ? 'true' : 'false')+'">Next</a></li>';
    html += '</ul>';
    return html;
  }

  load_from_state();
  $(window).on("popstate", load_from_state);

  $('.search-form').submit(function(e){
    e.preventDefault();
    var params = getUrlParameters();
    params.q = $('.search-form .search').val();
    update_state(params);
  });

  tab_web.blurclick(function(e){
    change_tab('web');
  });
  tab_web.keydown(function(e){
    if (e.keyCode == 37 || e.keyCode == 39) { //left and right arrows
      e.preventDefault();
      e.stopPropagation();
      tab_people.focus();
    }
  });
  tab_people.blurclick(function(e){
    change_tab('people');
  });
  tab_people.keydown(function(e){
    if (e.keyCode == 37 || e.keyCode == 39) { //left and right arrows
      e.preventDefault();
      e.stopPropagation();
      tab_web.focus();
    }
  });
});
