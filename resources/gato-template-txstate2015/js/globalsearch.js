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
    $('.search-web').html('');
    if (isBlank(query)) return;
    var start = (page-1)*perpage;
    var search = new Search({start: start, num: perpage, sort: sort});
    search.doSearch(query)
      .done(function(data){
        console.log(data);
        var html = '';
        html += html_result_total(start, Math.min(start+data.results.length, start+perpage), data.total);
        $.each(data.results, function (i, result) {
          html += html_result_web(result);
        });
        if (data.results.length == 0) {
          html += 'No results.';
        } else {
          html += window.txstsearch.html_pagination(page, Math.ceil(data.total / perpage));
        }
        $('.search-web').html(html);
        create_event_handlers_web();
      })
      .fail(function(e){
        console.log(e)
      })
  }

  var fill_people_search = function (query, page, perpage) {
    if (!page || page < 1) page = 1;
    $('.search-side-people').hide();
    $('.search-people').html('');
    $('.search-side-results').html('');
    if (isBlank(query)) return;
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
          if (cat == "Senior") return 6;
          if (cat == "Junior") return 7;
          if (cat == "Sophomore") return 8;
          return 10;
        }
        data.results.sort(function (a,b) {
          var cata = sortvalue(a.category);
          var catb = sortvalue(b.category);
          if (cata == catb) return a.lastname.localeCompare(b.lastname);
          return cata - catb;
        });

        var start = (page-1)*perpage;
        var end = Math.min(start+perpage, data.results.length);
        html += html_result_total(start, end, data.count);

        for (var i = start; i < end; i++) {
          html += html_result_people(data.results[i]);
        }
        for (var i = 0; i < 3 && i < data.results.length; i++) {
          htmlshort += html_result_people_short(data.results[i]);
        }
        if (data.results.length == 0) {
          html += 'No people were found that match your search.';
          htmlshort += 'No people match your search.';
        } else {
          html += window.txstsearch.html_pagination(page, Math.ceil(data.count / perpage));
        }
        if (data.count > 3) {
          htmlshort += '<a href="#" class="search-people-more">'+(data.count-3)+' more people match your search</a>';
        }
        $('.search-side-people').css('display', '');
        $('.search-people').html(html);
        $('.search-side-people .search-side-results').html(htmlshort);
        create_event_handlers_people();
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
    if (isBlank(params.q)) {
      search_form_magnify();
      $('.search-form .search').focus();
    } else search_form_reset();
  }

  var update_state = function (params) {
    history.pushState(null, null, createUrlQuery(params));
    load_from_state();
  }

  var update_state_param = function (name, value) {
    var params = getUrlParameters();
    if (params[name] != value) {
      params[name] = value;
      update_state(params);
    }
  }

  var html_result_web = function (result) {
    return '<div class="result">' +
             '<a class="result-title" href="' + result.url +'">' + result.title + '</a>' +
             '<p class="summary">' + result.summary_html + '</p>' +
             '<a class="result-url-display" href="' + result.url + '">' + result.url_display + '</a>' +
           '</div>';
  }

  var html_result_people = function (result) {
    var html = '<div class="person eq-parent">'+
               '<div class="person-name">'+result.firstname+' '+result.lastname+'</div>'+
               '<div class="person-category">'+result.category+'</div>';
    if (!isBlank(result.title))
      html += '<dl><dt class="person-title">Title:</dt><dd class="person-title">'+result.title+'</dd></dl>';
    if (!isBlank(result.department))
      html += '<dl><dt class="person-department">Department:</dt><dd class="person-department">'+result.department+'</dd></dl>';
    if (!isBlank(result.address))
      html += '<dl><dt class="person-address">Address:</dt><dd class="person-address">'+result.address+'</dd></dl>';
    if (!isBlank(result.phone))
      html += '<dl><dt class="person-phone">Phone:</dt><dd class="person-phone">'+result.phone+'</dd></dl>';
    if (result.email != 'unauthenticated')
      html += '<dl><dt class="person-email">Email:</dt><dd class="person-email">'+
              '<a class="person-email" href="mailto:'+result.email+'">'+result.email+'</a></dd></dl>';
    if (!isBlank(result.userid))
      html += '<dl><dt class="person-netid">NetID:</dt><dd class="person-netid">'+result.userid+'</dd></dl>';
    html += '</div>';
    return html;
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

  var html_result_total = function (start, end, total) {
    if (end > 0) {
      if (start+1 == end) {
        return '<div class="search-count">Showing result '+(start+1)+' of '+total+'.</div>';
      } else {
        return '<div class="search-count">Showing results '+(start+1)+'-'+end+' of '+total+'.</div>';
      }
    }
    return '';
  }

  var search_form_reset = function () {
    $('.search-form .magnify').hide();
    $('.search-form .reset').show();
  }

  var search_form_magnify = function () {
    $('.search-form .magnify').show();
    $('.search-form .reset').hide();
  }

  var pagination_click = function(e) {
    var lnk = $(this);
    e.preventDefault();
    var param = $('#search-results').is('.web') ? 'webpage' : 'peoplepage';
    update_state_param(param, lnk.data('page'));
  }

  var create_event_handlers_web = function() {
    $('.search-web .pagination-link').click(pagination_click);
  }
  var create_event_handlers_people = function() {
    $('.search-people .pagination-link').click(pagination_click);
    $('.search-people-more').click(function(e) {
      e.preventDefault();
      change_tab('people');
    });
    window.elementqueries.update();
  }

  load_from_state();
  $(window).on("popstate", load_from_state);

  $('.search-form').submit(function(e){
    e.preventDefault();
    update_state_param('q', $('.search-form .search').val());
  });

  $('.search-form input.search').keyup(function (e) {
    if ($(this).val() != getUrlParameters()['q']) search_form_magnify();
  });

  $('.search-form .magnify').click(function (e) {
    e.preventDefault();
    $('.search-form').submit();
  });
  $('.search-form .reset').click(function (e) {
    e.preventDefault();
    $('.search-form input.search').val('');
    $('.search-form input.search').focus();
    search_form_magnify();
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
