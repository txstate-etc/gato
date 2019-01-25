jQuery(document).ready(function($) {

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
                      var result = {title: obj.title, url_display: obj.url_display, url: obj.url};
                      return result;
                  });
                  response(data);
              });
          },
          select: function(event, ui){
              event.preventDefault();
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
        return $( '<li class="suggestion">' )
          .append($result)
          .appendTo( ul );
      };
  }

    //Calls the google search appliance with the appropriate parameters and display
    //results on the current page.  The search results are inserted after the original
    //page content and the original page content is hidden.
    function siteSearch(sitesearch, query, startPage, sortType, client, site){
        var start = (startPage <= 1) ? 0 : (10 * (startPage -1));
        var search = new Search({sitesearch: sitesearch, start: start, num: 10, sort: sortType, client: client, site: site});
        search.doSearch(query)
        .then(function(results){
            var page = window.txstsearch.buildSearchResultsPage(sitesearch, query, results, startPage, sortType);
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

    var load_from_state = function(){
        var params = getHashParameters();
        //if the search parameters are not there, don't do anything.  There was no search.
        if(!isSiteSearchPage(params)) return;
        siteSearch((params.sitesearch || "txstate.edu"), (params.query || ""), params.page || 1, params.sort || "relevance", params.client || "txstate", params.site || "txstate_no_users");
        handleBreadCrumbs();
    }

    var update_state = function(params){
        history.pushState(null, null, createHashQuery(params));
        load_from_state();
    }

    //TODO: copied from globalsearch so maybe that should be available everywhere too?
    var update_state_params = function(name, value){
        var params = getHashParameters();
        if (params[name] != value) {
          params[name] = value;
          update_state(params);
        }
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

    //event handlers

    var isSiteSearchPage = function(params){
        return params['sitesearch'];
    }

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



    //handles submit from search modal
    $('.searchbar-form').submit(function(e){
        e.preventDefault();
        //close the search modal
        $('#search-modal-content').dialog('close');
        //redirect to global search if the user is on the homepage or selected that
        //they want to search all of Texas State instead of doing a site search
        if($('#sitesearch').length == 0 || $('#txst-all').prop('checked')){
            var query = $('#search-text').val();
            var url = search_global_url+"#q=" + query;
            window.location = url;
        }
        else{
            //search this site
            var query = $('#search-text').val();
            var site = $('#sitesearch').val();

            var params = {
                sitesearch: site,
                query: query,
                page: 1,
                sort: "relevance"
            };
            if(!isBlank($('#site').val())) params.site = $('#site').val();
            if(!isBlank($('#client').val())) params.client = $('#client').val();
            update_multiple_state_params(params);
        }
    });

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

    load_from_state();

    $('.btn-close-search-dialog').click(function(e) {
      e.preventDefault();
      $('#search-modal-content').dialog('close');
      $('.search-link.search-button').focus();
    })

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
            window.dispatchEvent(new Event('resize')); // allow any resize handlers to re-layout the page
        }
    });

    window.txstsearch = function () {
        var ts = window.txstsearch;

        ts.html_pagination = function (page, lastpage) {
          if (lastpage == 1) return '';
          var html = '<div class="visuallyhidden">Pagination</div>';
            html += '<ul role="navigation" class="pagination">';
            html += '<li><a href="#" class="pagination-link previous' + (page > 1 ? " enabled" : "") + '" aria-label="Previous Page" data-page="'+Math.max(page-1, 1)+'" aria-disabled="'+(page == 1 ? 'true' : 'false')+'">< Previous</a></li>';
            //first page
            html += '<li><a href="#" class="pagination-link" aria-selected="' + (page == 1) + '" aria-label="Page 1" data-page="1">1</a></li>';
            //first ellipsis, if needed
            if(lastpage > 4 && page > 3){
                html += '<li><span class="nonlink">...</span></li>';
            }
            if(lastpage > 2){
                if(lastpage == 3){
                    html += '<li><a href="#" class="pagination-link" aria-selected="'+(page == 2)+'" aria-label="Page 2" data-page="2">2</a></li>';
                }
                else{
                    for (var i = Math.min(Math.max(page - 1, 2), lastpage-2); i <= Math.max(Math.min(page + 1, lastpage - 1),3); i++) {
                      html += '<li><a href="#" class="pagination-link" aria-selected="'+(i==page)+'" aria-label="Page '+i+'" data-page="'+i+'">'+i+'</a></li>';
                    }
                }
            }
            //second ellipsis, if needed
            if(lastpage > 4 && page < (lastpage - 2)){
                html += '<li><span class="nonlink">...</span></li>';
            }
            //last page
            html += '<li><a href="#" class="pagination-link" aria-selected="' + (page == lastpage) + '" aria-label="Page ' + lastpage + '" data-page="' + lastpage + '">' + lastpage + '</li>';
            html += '<li><a href="#" class="pagination-link next' + (page < lastpage ? " enabled" : "") + '" aria-label="Next Page" data-page="'+Math.min(page+1, lastpage)+'" aria-disabled="'+(page == lastpage ? 'true' : 'false')+'">Next ></a></li>';
            html += '</ul>';
            return html;
        };

        //build the html that will replace the page content
        ts.buildSearchResultsPage = function (site, query, results, page, sort){
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
                                    window.txstsearch.buildButton(globalSearchUrl) +
                                '</div>' +
                                (searchResults.length > 0 ? '<div class="results-count">Results ' + range + ' of about ' + total + ' for ' + query + '.</div>' : "") +
                                (searchResults.length > 0 ? sorting : "") +
                                window.txstsearch.formatResults(searchResults) +
                                (searchResults.length > 0 ? window.txstsearch.html_pagination(page, Math.ceil(total/10)) : "" ) +
                            '</div><div class="layout-column onethird">' +
                                '<div class="global-search">' +
                                    '<div class="all-results-help-text">Didn\'t find what you were looking for?</div>' +
                                    window.txstsearch.buildButton(globalSearchUrl) +
                                '</div>' +
                            '</div>' +
                        '</div>';
            return html;
        }

        //build the results section, either a list of results or a message indicating
        //that no results were found
        ts.formatResults = function (results){
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
        ts.buildButton = function(url){
            var html='<div class="button-wrapper all-results-button">' +
                        '<a class="button three-d color6 medium" href="'+ url +'">' +
                            '<span>Search All Texas State</span>' +
                        '</a>' +
                     '</div>';
            return html;
        }
    };
    txstsearch();
});
