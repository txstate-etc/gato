jQuery(document).ready(function($) {

  var searchmodal = {
    isOpen: false,

    openSearch: function() {
      this.isOpen = true;
      $('.search-modal').velocity("fadeIn", {duration: 300});
      $('#search-modal-content').velocity("slideDown", { 
        delay: 10, 
        duration: 300,
        complete: function() {
          $('#search-text').focus();
        }});
    },

    closeSearch: function() {
      $('#search-modal-content').velocity("slideUp", {duration: 300});
      $('.search-modal').velocity("fadeOut", { delay: 10, duration: 300});
      this.isOpen = false;
      $('.search-link.search-button').focus();
    }
  }

  $('.search-link.search-button').on('click', function(e){
    e.preventDefault();
    searchmodal.openSearch();
  });

  //close if the user clicks on the overlay
  $('.search-modal').on('click', function (e) {
    if ($(e.target).closest('#search-modal-content').length == 0) searchmodal.closeSearch();
  });
  
  //close with escape key
  $(window).on('keydown', function(e) {
    if (searchmodal.isOpen && e.keyCode == 27) {
      searchmodal.closeSearch();
    }
  });

  $('.btn-close-search-dialog').click(function(e) {
    e.preventDefault();
    searchmodal.closeSearch();
  })

  //trap focus in the dialog
  $('#search-modal-content').focusout(function (e) {
    var tabbable = $('#search-modal-content').find(':tabbable');
    var first = tabbable.first();
    var last = tabbable.last(); 
    var targ = $(e.relatedTarget);
    if (targ.is('.search-focusstart')) {
      last.focus();
    }
    else if (targ.is('.search-focusend')) {
      first.focus();
    }
  })

  //this makes the top results drop down stay the same size
  //as the input field
  jQuery.ui.autocomplete.prototype._resizeMenu = function () {
    var ul = this.menu.element;
    ul.outerWidth(this.element.outerWidth());
  }

  //top 3 search results shown after user types 3 characters
  //in search box
  if ($('#search-text').length) {
    $('#search-text').autocomplete({
      delay: 300,
      minLength: 3,
      classes: {
        "ui-autocomplete":"gato-site-search"
      },
      open: function( event, ui ) {
        var dialogZIndex = $('.ui-dialog').css('z-index');
        $('.ui-autocomplete').css('z-index', dialogZIndex + 1);
      },
      source: function(request, response){
        var options = {num: 3};
        if($('#this-site').prop('checked')){
          options.sitesearch = $('#sitesearch').val();
          if(!isBlank($('#site').val())) options.site = $('#site').val();
          if(!isBlank($('#client').val())) options.client = $('#client').val();
        }
        var search = new Search(options);
        search.featured(request.term)
        .then(function(results){
          var data = results.slice(0,3).map(function(obj, index){
            var result = {title: obj.title, url_display: obj.url_display, url: obj.url, value: obj.title};
            return result;
          });
          response(data);
        });
      },
      select: function(event, ui){
        event.preventDefault();
        if (event.keyCode && event.keyCode == 9) 
          $('.searchbar-content button.icon').focus()
        else
          window.location = ui.item.url;
      }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
      var $result = $('<div>')
      .append( '<div class="suggestion-title">' +
                '<a href="#">' + item.title + '</a>' +
               '</div>')
      .append('<div class="display-link">' +
                '<a href="#">' + item.url_display + '</a>' +
              '</div>');
      return $( '<li class="suggestion" aria-label="' + item.title + '">' )
      .append($result)
      .appendTo( ul );
    };
  }

  //handles submit from search modal
  $('.searchbar-form').submit(function(e){
    e.preventDefault();
    //close the search modal
    searchmodal.closeSearch();

    //redirect to global search if the user is on the homepage or selected that
    //they want to search all of Texas State instead of doing a site search
    if ($('#sitesearch').length == 0 || $('#txst-all').prop('checked')) {
      var query = $('#search-text').val();
      var url = search_global_url+"#q=" + query;
      window.location = url;
    }
    else {
      //search this site
      var query = $('#search-text').val();
      var site = $('#sitesearch').val();
      var params = {
        sitesearch: site,
        query: query,
        page: 1,
        sort: "relevance"
      };
      if (!isBlank($('#site').val())) params.site = $('#site').val();
      if (!isBlank($('#client').val())) params.client = $('#client').val();
      update_multiple_state_params(params);
    }
  });

  var isSiteSearchPage = function(params){
    return params['sitesearch'];
  }

  //Modifies the breadcrumbs to account for the search results page.  If the original page
  //is called "Best Page Ever," then "Best Page Ever" becomes a link to itself in the breadcrumbs
  // and > Search Results is added to the end of the breadcrumbs.
  function handleBreadCrumbs(){
    if($('.searchbreadcrumbs')) $('.searchbreadcrumbs').remove();
    var breadcrumbs = $('#panel .breadcrumbs');
    var searchbreadcrumbs = breadcrumbs.clone().addClass('searchbreadcrumbs');
    var contents = searchbreadcrumbs.contents();
    if(contents.length > 0) {
      contents.eq(contents.length -1).remove();  //remove last text element
      contents.eq(searchbreadcrumbs.length -1).remove();
      var url = window.location.href;
      if(url.indexOf("sitesearch") != -1){
        var params = getHashParameters();
        delete params.sitesearch;
        delete params.query;
        delete params.page;
        delete params.sort;
        url = window.location.pathname;
        if(!$.isEmptyObject(params)){
            url += createHashQuery(params);
        }
      }
      searchbreadcrumbs.append('<a href="' + url + '"> ' + $('#maincontent').text() + ' </a>');
      searchbreadcrumbs.append('<span class="separator"><i class="fa fa-angle-right"></i></span>');
      searchbreadcrumbs.append(document.createTextNode(' Search Results'));
      breadcrumbs.after(searchbreadcrumbs);
      searchbreadcrumbs.show();
      breadcrumbs.hide();
    }
  }

  var create_event_handlers = function() {
    //handle clicks on pagination and sorting links and search again clicks
    $('.pagination-link').click(pagination_click);
    $('.sort-link').click(sorting_click);
    $('.search-again .reset').click(search_again_reset);
    $('.search-again .searchbar-form .icon.magnify').click(search_again);
    $('.search-again .searchbar-form .search').keyup(search_again_change);
  }

  //site search needs to updated more than one parameter at a time
  //but we don't want to update the history after every new parameter
  var update_multiple_state_params = function(newParams){
    var params = getHashParameters();
    for (var key in newParams) {
      if (newParams.hasOwnProperty(key)) {
        if (params[key] != newParams[key]) {
          params[key] = newParams[key];
        }
      }
    }
    update_state(params);
  }

  var update_state = function(params){
    history.pushState(null, null, createHashQuery(params));
    load_from_state();
  }

  var update_state_params = function(name, value){
      var params = getHashParameters();
      if (params[name] != value) {
        params[name] = value;
        update_state(params);
      }
  }

  var load_from_state = function(){
    var params = getHashParameters();
    //if the search parameters are not there, don't do anything.  There was no search.
    if(!isSiteSearchPage(params)) return;
      siteSearch((params.sitesearch || "txstate.edu"), (params.query || ""), params.page || 1, params.sort || "relevance", params.client || "txstate", params.site || "txstate_no_users");
    handleBreadCrumbs();
    $('.banner-image').hide();
    $('.organization-info').addClass('search-results-no-image')
  }

  var siteSearch = function(sitesearch, query, startPage, sortType, client, site) {
    var start = (startPage <= 1) ? 0 : (10 * (startPage -1));
    var search = new window.Search({sitesearch: sitesearch, start: start, num: 10, sort: sortType, client: client, site: site});
    search.doSearch(query)
    .then(function(results){
      var page = buildSearchResultsPage(sitesearch, query, results, startPage, sortType);
      $('#search-results').remove();
      $('.contentcolumn').after(page);
      $('.contentcolumn, .sidebar-container, .gato-herobanner, .gato-heroslider').hide();
      $('.search-again .searchbar-form .icon.magnify').hide();
      $(window).trigger('resize'); // allow any resize handlers to re-layout the page
      create_event_handlers();
    })
    .fail(function(){
      console.log("error")
    })
  }

  load_from_state();

  var pagination_click = function(e) {
    var lnk = $(this);
    e.preventDefault();
    update_state_params("page", lnk.data('page'))
  }

  var sorting_click = function(e) {
    var lnk = $(this);
    e.preventDefault();
    var sort = lnk.data('sort');
    update_multiple_state_params({page: 1, sort: sort});
  }

  var search_again_reset = function(e) {
    e.preventDefault();
    $('.search-again .search').val("");
    $('.search-again .search').focus();
    $('.search-again .icon.reset').hide();
    $('.search-again .searchbar-form .icon.magnify').show();
  }

  var search_again = function(e){
    e.preventDefault();
    var query = $('.search-again .searchbar-form .search').first().val();
    update_multiple_state_params({page: 1, sort: "relevance", query: query});
  }

  var search_again_change = function(e){
    var target = $(e.target);
    if(target.val() != $('#search-info').data('query')){
      $('.search-again .searchbar-form .icon.reset').hide();
      $('.search-again .searchbar-form .icon.magnify').show();
    }
  }

  //This handles the case where the user navigates to/from the search results page using the
  //back and forward buttons in the browser
  $(window).on("popstate", function() {
      var params = getHashParameters();
      if(isSiteSearchPage(params)){
          load_from_state();
      }
      else if ($('#search-results.global').length == 0) {
          //The user went to the original page
          $('#search-results').remove();
          $('.contentcolumn, .sidebar-container, .gato-herobanner, .gato-heroslider').show();
          $('.breadcrumbs').show();
          $('.searchbreadcrumbs').remove();
          $('.banner-image').show();
          $('.organization-info').removeClass('search-results-no-image')
          window.dispatchEvent(new Event('resize')); // allow any resize handlers to re-layout the page
      }
  });

  //build the html that will replace the page content
  var buildSearchResultsPage = function (site, query, results, page, sort) {
    var total = results.total;
    var range = results.start + " - " + results.end;
    var sorting = '<div class="sort-results">' +
                    '<a href="#" data-sort="relevance" class="sort-link '+ (sort == "relevance" ? "active" : "") + '">Sort By Relevance</a>' +
                    ' / ' +
                    '<a href="#" data-sort="date" class="sort-link ' + (sort == "date" ? "active" : "") + '">Sort By Date</a>' +
                  '</div>';

    var globalSearchUrl = search_global_url+"#q=" + query;

    var searchResults = results.results;

    var html =  '<div id="search-results">' +
                  '<div class="layout-column twothirds search-title">' +
                    '<h1 class="search-results-title" id="maincontent">Search</h1>' +
                  '</div>' +
                  '<div class="gato-search-title-separator">' +
                    '<div class="intro-title-border"></div>' +
                  '</div>' +
                  '<div class="layout-column twothirds">' +
                    '<div id="search-info" data-site="' + site + '" data-query="' + query + '" data-sort="' + sort + '"></div>' +
                      '<div class="search-again">' +
                        '<form class="searchbar-form">' +
                          '<label class="hidden" for="s">Search Terms</label>' +
                          '<input id="s" type="text" class="search" name="q" value="'+ query +'"></input><button class="icon magnify"><i class="fa fa-search" aria-label="Start Search"></i><span class="visuallyhidden">Start Search</span></button>' +
                          '<button class="icon reset"><i class="fa fa-times" aria-label="Reset Search"></i><span class="visuallyhidden">Reset Search</span></button>' +
                        '</form>' +
                      '</div>' +
                      '<div class="global-search global-search-mobile">' +
                        '<div class="all-results-help-text">Didn\'t find what you were looking for?</div>' +
                          buildButton(globalSearchUrl) +
                      '</div>' +
                      (searchResults.length > 0 ? '<div class="results-count">Results ' + range + ' of about ' + total + ' for ' + query + '.</div>' : "") +
                      (searchResults.length > 0 ? sorting : "") +
                      formatResults(searchResults) +
                      (searchResults.length > 0  && total > 10 ? window.txstsearch.html_pagination(page, Math.ceil(total/10)) : "" ) +
                    '</div><div class="layout-column onethird">' +
                      '<div class="global-search">' +
                          '<div class="all-results-help-text">Didn\'t find what you were looking for?</div>' +
                          buildButton(globalSearchUrl) +
                      '</div>' +
                    '</div>' +
                  '</div>';
    return html;
  }

  //build the results section, either a list of results or a message indicating
  //that no results were found
  var formatResults = function (results){
    var html;
    if(results.length == 0){
      html = '<div class="no-results">No Results Found</div>';
    }
    else{
      html = '<div class="results-list">';
      for(var i=0; i<results.length; i++){
        html += '<div class="result' + (results[i].featured ? " featured" : "" )+'">' +
                  '<a class="result-title" href="' + results[i].url +'">' + results[i].title + '</a>' +
                  '<p class="summary">' + results[i].summary_html + '</p>' +
                  '<span class="result-url-display" href="' + results[i].url + '">' + results[i].url_display + '</span>' +
                  (results[i].featured ? "" : '<span class="result-date">'+moment(results[i].date).format('MM-DD-YYYY')+'</span>') +
                '</div>';
      }
      html += '</div>';
    }
    return html;
  }

  //build "Search All Texas State" button
  var buildButton = function(url){
    var html= '<div class="button-wrapper all-results-button">' +
                '<a class="button three-d color6 medium" href="'+ url +'">' +
                  '<span>Search All Texas State</span>' +
                '</a>' +
             '</div>';
    return html;
  }
});
