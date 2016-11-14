jQuery(document).ready(function($) {
  // config
  var perpage_web = 10;
  var perpage_people = 10;

  var container = $('.search-container');
  var tab_web = $('.search-tab-web');
  var tab_people = $('.search-tab-people');
  var results_web = $('.search-web');
  var results_people = $('.search-people');
  var people_cache = {};

  var change_tab = function (type) {
    var params = getUrlParameters();
    if (params.type != type) {
      params.type = type;
      history.pushState(null, null, createUrlQuery(params));
      scroll_to_top();
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
        var html = '';
        html += html_result_total(data.start-1, data.end, data.total);
        if (data.results.length > 0) html += html_sort_web(sort);
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

  var people_search = function (query) {
    var deferred = $.Deferred();
    if (isBlank(query)) deferred.reject("People search query must not be blank.");

    var cachekey = query;
    if (people_cache[cachekey]) deferred.resolve(people_cache[cachekey]);
    else {
      $.ajax(peoplesearch_jwt_url+'?q='+encodeURIComponent(query)+'&n=500', {xhrFields:{withCredentials:true}})
      .done(function(data) {
        people_cache[cachekey] = data;
        for(var i = 0; i < data.results.length; i++) {
          var r = data.results[i];
          people_cache['userid is '+r.userid] = {
            count: 1,
            lastpage: 1,
            results: [r]
          };
        }
        deferred.resolve(data);
      })
      .fail(function(jqxhr, status, error) {
        deferred.reject(error);
      })
    }

    return deferred.promise();
  }

  var fill_people_search = function (query, page, perpage) {
    if (!page || page < 1) page = 1;
    $('.search-side-people').hide();
    $('.search-people').html('');
    $('.search-side-results').html('');
    if (isBlank(query)) return;
    people_search(query).done(function(data) {
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
      html += '<div class="search-people-advanced"><a href="#">Advanced Search</a></div>';
      html += '<div class="search-people-advanced-info" style="display: none;">'+
      '<div class="advanced-search-intro">People Search allows for very detailed searches. You may combine any of these phrases to create a search string:</div>'+
      '<div class="advanced-search-column"><h4>Fields</h4>lastname<br>firstname<br>email<br>department<br>address<br>phone<br>userid</div>'+
      '<div class="advanced-search-column"><h4>Operators</h4>is<br>contains<br>begins with<br>ends with</div>'+
      '<div class="advanced-search-examples"><h4>Examples</h4>lastname contains taylor<br>'+
      'email contains jb<br>lastname begins with bura<br>department contains athletics</div>'+
      '</div>';
      for (var i = start; i < end; i++) {
        html += html_result_people(data.results[i]);
      }
      for (var i = 0; i < 3 && i < data.results.length; i++) {
        htmlshort += html_result_people_short(data.results[i]);
      }
      if (data.results.length == 0) {
        html += 'No people were found that match your search.';
        htmlshort += 'No people match your search.';
      } else if (data.results.length == 1) {
        if (sortvalue(data.results[0].category) > 3) {
          html += '<div class="search-people-contact">Error in listing?<br>Contact the <a href="http://www.registrar.txstate.edu/our-services/address-change.html">Registrar\'s Office</a>.<br>Students may request a <a href="http://www.registrar.txstate.edu/our-services/privacy-hold.html">Privacy Hold</a>.</div>';
        } else {
          html += '<div class="search-people-contact">Error in listing?<br>Contact <a href="mailto:hr@txstate.edu">hr@txstate.edu</a>.</div>';
        }
      } else {
        html += window.txstsearch.html_pagination(page, Math.ceil(Math.min(data.count, 500) / perpage));
      }
      if (data.count > 0) {
        var pluralpeople = (data.count == 1 ? 'person' : 'people');
        htmlshort += '<div class="search-people-more"><a href="#">'+(data.count)+' '+pluralpeople+' found.</a></div>';
      }
      $('.search-side-people').css('display', '');
      $('.search-people').html(html);
      $('.search-side-people .search-side-results').html(htmlshort);
      create_event_handlers_people();
    })
    .fail(function(error) {
      console.log(error);
    })
  }

  var search = function (params) {
    change_tab(params.type);
    fill_web_search(params.q, params.sort, params.webpage, perpage_web);
    fill_people_search(params.q, params.peoplepage, perpage_people);
  }

  var scroll_to_top = function () {
    $('html, body').scrollTop($('.search-container').offset().top);
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
    var oldparams = getUrlParameters();
    if (oldparams.q != params.q) {
      delete params.webpage;
      delete params.peoplepage;
    }
    history.pushState(null, null, createUrlQuery(params));
    scroll_to_top();
    load_from_state();
  }

  var update_state_param = function (name, value) {
    var params = getUrlParameters();
    if (params[name] != value) {
      params[name] = value;
      update_state(params);
    }
  }

  var update_state_params = function (newparams) {
    var params = getUrlParameters();
    var changed = false;
    for (var key in newparams) {
      if (newparams.hasOwnProperty(key)) {
        if (params[key] != newparams[key]) changed = true;
        params[key] = newparams[key];
      }
    }
    if (changed) update_state(params);
  }

  var html_result_web = function (result) {
    return '<div class="result' + (result.featured ? " featured" : "") + '">' +
             '<a class="result-title" href="' + result.url +'">' + result.title + '</a>' +
             '<p class="summary">' + result.summary_html.replace('<br>', ' ') + '</p>' +
             '<span class="result-url-display" href="' + result.url + '">' + result.url_display + '</span>' +
             (result.featured? "" : '<span class="result-date">'+moment(result.date).format('MM-DD-YYYY')+'</span>') +
           '</div>';
  }

  var html_result_people = function (result) {
    var html = '<div class="person">'+
               '<div class="person-name"><a href="#" data-userid="'+result.userid+'">'+result.firstname+' '+result.lastname+'</a></div>'+
               '<div class="person-category">'+result.category+'</div>';
    if (!isBlank(result.title))
      html += '<dl class="person-title"><dt>Title:</dt><dd>'+result.title+'</dd></dl>';
    if (!isBlank(result.department))
      html += '<dl class="person-department"><dt>Department:</dt><dd><a href="#">'+result.department+'</a></dd></dl>';
    if (!isBlank(result.address))
      html += '<dl class="person-address"><dt>Address:</dt><dd>'+result.address+'</dd></dl>';
    if (!isBlank(result.userid))
      html += '<dl class="person-netid"><dt>NetID:</dt><dd>'+result.userid+'</dd></dl>';
    if (!isBlank(result.phone))
      html += '<dl class="person-phone"><dt>Phone:</dt><dd>'+result.phone+'</dd></dl>';
    if (result.email != 'unauthenticated')
      html += '<dl class="person-email"><dt>Email:</dt><dd>'+
              '<a class="person-email" href="mailto:'+html_encode(result.email)+'">'+html_encode(result.email)+'</a></dd></dl>';
    else
      html += '<dl class="person-email"><dt>Email:</dt><dd>'+
              '<a class="person-email" href="'+peoplesearch_token_url+'">log in to view email</a></dd></dl>';
    html += '</div>';
    return html;
  }

  var html_result_people_short = function (result) {
    var html = '<div class="person">';
    html += '<div class="person-name"><a href="#" data-userid="'+result.userid+'">'+result.firstname+' '+result.lastname+'</a></div>';
    html += '<div class="person-category">'+result.category+'</div>';
    html += '<div class="person-phone">'+result.phone+'</div>';
    if (result.email != 'unauthenticated')
      html += '<a class="person-email" href="mailto:'+html_encode(result.email)+'">'+html_encode(result.email)+'</a>';
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

  var html_sort_web = function (sort) {
    if(!sort) sort = "relevance";
    var html = '<div class="search-sort-options">' +
                 '<a href="#" data-sort="relevance" class="sort-link '+ (sort == "date" ? "" : "active") + '">Sort By Relevance</a>' +
                 ' / ' +
                 '<a href="#" data-sort="date" class="sort-link ' + (sort == "date" ? "active" : "") + '">Sort By Date</a>' +
                 '</div>';
    return html;
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
    $('.sort-link').click(function (e) {
      var lnk = $(this);
      e.preventDefault();
      update_state_param('sort', lnk.data('sort'));
    });
  }
  var create_event_handlers_people = function() {
    $('.search-people .pagination-link').click(pagination_click);
    $('.search-people-more a').click(function(e) {
      e.preventDefault();
      change_tab('people');
    });
    $('#search-results .person-name a').click(function(e) {
      e.preventDefault();
      update_state_params({
        'q': 'userid is '+$(this).data('userid'),
        'type': 'people'
      });
    });
    $('.search-people-advanced a').click(function(e) {
      e.preventDefault();
      $('.search-people-advanced-info').toggle();
    });
    $('#search-results .person-department a').click(function(e) {
      e.preventDefault();
      update_state_params({
        'q': 'department is "'+$(this).text()+'"',
        'type': 'people'
      });
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
