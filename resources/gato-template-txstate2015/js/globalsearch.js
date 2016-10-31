jQuery(document).ready(function($) {
  // config
  var perpage_web = 10;
  var perpage_people = 10;

  var container = $('.search-container');

  var change_tab = function (type) {
    if (type == 'people') {
      container.removeClass('web');
      container.addClass('people');
    } else { // web
      container.removeClass('people');
      container.addClass('web');
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
        html += buildPagination(query, page, data.total);
        $('.search-web').html(html);
      })
      .fail(function(e){
        console.log(e)
      })
  }

  var fill_people_search = function (query, page, perpage) {
    $.ajax("https://secure.its.txstate.edu/iphone/people/json.pl?q="+encodeURIComponent(query))
      .done(function(data) {
        console.log(data);
        var html = '';
        var htmlshort = '';
        $.each(data.results, function (i, result) {
          html += html_result_people(result);
          htmlshort += html_result_people_short(result);
        });
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
    if (result.title.length > 0)
      html += '<div class="person-title">'+result.title+'</div>';
    else
      html += '<div class="person-category">'+result.category+'</div>';
    html += '<div class="person-phone">'+result.phone+'</div>';
    if (result.email != 'unauthenticated')
      html += '<a class="person-email" href="mailto:'+result.email+'">'+result.email+'</a>';
    html += '</div>';
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
});
