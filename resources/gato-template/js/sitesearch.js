jQuery(document).ready(function($) {

    //this makes the top results drop down stay the same size
    //as the input field
    jQuery.ui.autocomplete.prototype._resizeMenu = function () {
      var ul = this.menu.element;
      ul.outerWidth(this.element.outerWidth());
    }

    //top 3 search results shown after user types 3 characters
    //in search box
    $('#search-text').autocomplete({
        minLength: 3,
        open: function( event, ui ) {
            var dialogZIndex = $('.ui-dialog').css('z-index');
            $('.ui-autocomplete').css('z-index', dialogZIndex + 1);

        },
        source: function(request, response){
            var options = {num: 3};
            if($('#this-site').prop('checked')){
                options.sitesearch = $('#sitesearch').val();
            }
            var search = new Search(options);
            search.doSearch(request.term)
            .then(function(results){
                var data = results.results.map(function(obj){
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
      return $( '<li class="suggestion">' )
        .append( '<div class="suggestion-title">' +
                    '<a href="#">' + item.title + '</a>' +
                 '</div>')
        .append('<div class="display-link">' +
                    '<a href="#">' + item.url_display + '</a>' +
                '</div>')
        .appendTo( ul );
    };

    //Calls the google search appliance with the appropriate parameters and display
    //results on the current page.  The search results are inserted after the original
    //page content and the original page content is hidden.
    function siteSearch(site, query, startPage, sortType){
        var sort = (sortType == "date") ? "date:D:S:d1" : "relevance";
        var start = (startPage <= 1) ? 0 : (10 * (startPage -1));
        var search = new Search({site: site, start: start, num: 10, sort: sort});
        search.doSearch(query)
        .then(function(results){
            var page = window.txstsearch.buildSearchResultsPage(site, query, results.results, results.total, startPage, sortType);
            $('#search-results').remove();
            $('.page_content').after(page);
            $('.page_content').hide();
            $('.search-again .searchbar-form .icon.magnify').hide();
            create_event_handlers();
        })
        .fail(function(){
            console.log("error")
        })
    }

    var load_from_state = function(){
        var params = getUrlParameters();
        //if the search parameters are not there, don't do anything.  There was no search.
        if(!isSiteSearchPage(params)) return;
        siteSearch((params.sitesearch || "txstate.edu"), (params.query || ""), params.page || 1, params.sort || "relevance");
        handleBreadCrumbs();
    }

    var update_state = function(params){
        var newQS = createUrlQuery(params);
        history.pushState(null, null, window.location.pathname + createUrlQuery(params) + window.location.hash);
        load_from_state();
    }

    //TODO: copied from globalsearch so maybe that should be available everywhere too?
    var update_state_params = function(name, value){
        var params = getUrlParameters();
        if (params[name] != value) {
          params[name] = value;
          update_state(params);
        }
    }

    //site search needs to updated more than one parameter at a time
    //but we don't want to update the history after every new parameter
    var update_multiple_state_params = function(newParams){
        var params = getUrlParameters();
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
            var url = "/search?q=" + query;
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
        contents.get(contents.size() -1).remove();  //remove last text element
        contents.get(searchbreadcrumbs.size() -1).remove();
        var url = window.location.href;
        if(url.indexOf("sitesearch") != -1){
            var params = getUrlParameters();
            delete params.sitesearch;
            delete params.query;
            delete params.page;
            delete params.sort;
            url = window.location.pathname;
            if(!$.isEmptyObject(params)){
                url += createUrlQuery(params);
            }
            url += window.location.hash;
        }
        searchbreadcrumbs.append('<a href="' + url + '">' + $('#maincontent').text() + '</a>');
        searchbreadcrumbs.append('<span class="separator"><i class="fa fa-angle-right"></i></span>');
        searchbreadcrumbs.append(document.createTextNode(' Search Results'));
        breadcrumbs.after(searchbreadcrumbs);
        searchbreadcrumbs.show();
        breadcrumbs.hide();
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

    //This handles the case where the user navigates to/from the search results page using the
    //back and forward buttons in the browser
    $(window).on("popstate", function() {
        var params = getUrlParameters();
        if(isSiteSearchPage(params)){
            load_from_state();
        }
        else if ($('#search-results.global').length == 0) {
            //The user went to the original page
            $('#search-results').remove();
            $('.page_content').show();
            $('.breadcrumbs').show();
            $('.searchbreadcrumbs').remove();
        }
    });

    window.txstsearch = function () {
        var ts = window.txstsearch;

        ts.html_pagination = function (page, lastpage) {
          var html = '<div class="visuallyhidden">Pagination</div>';
            html += '<ul role="navigation" class="pagination">';
            html += '<li><a href="#" class="pagination-link" aria-label="Previous Page" data-page="'+Math.max(page-1, 1)+'" aria-disabled="'+(page == 1 ? 'true' : 'false')+'">Prev</a></li>';
            for (var i = Math.max(page-3, 1); i <= Math.min(page+3, lastpage); i++) {
              html += '<li><a href="#" class="pagination-link" aria-selected="'+(i==page)+'" aria-label="Page '+i+'" data-page="'+i+'">'+i+'</a></li>';
            }
            html += '<li><a href="#" class="pagination-link" aria-label="Next Page" data-page="'+Math.min(page+1, lastpage)+'" aria-disabled="'+(page == lastpage ? 'true' : 'false')+'">Next</a></li>';
            html += '</ul>';
            return html;
        };

        //build the html that will replace the page content
        ts.buildSearchResultsPage = function (site, query, results, total, page, sort){
            var firstResult = (page - 1) * 10 + 1;
            var lastResult = (page * 10 > total) ? total : page * 10;
            var range = firstResult + " - " + lastResult;
            var sorting = '<div class="sort-results layout-column onethird">' +
                                '<a href="#" data-sort="relevance" class="sort-link '+ (sort == "relevance" ? "active" : "") + '">Sort By Relevance</a>' +
                                ' / ' +
                                '<a href="#" data-sort="date" class="sort-link ' + (sort == "date" ? "active" : "") + '">Sort By Date</a>' +
                            '</div>';

            var globalSearchUrl = "/search?q=" + query;

            var html =  '<div id="search-results">' +
                            '<div class="layout-column twothirds">' +
                                '<h1 class="search-results-title" id="maincontent">Search</h1>' +
                            '</div>' +
                            (results.length > 0 ? sorting : "") +
                            '<div class="layout-column twothirds">' +
                                '<div id="search-info" data-site="' + site + '" data-query="' + query + '" data-sort="' + sort + '"></div>' +
                                '<div class="search-again">' +
                                    '<form class="searchbar-form">' +
                                        '<label class="hidden" for="s">Search Terms</label>' +
                                        '<input id="s" type="text" class="search" name="q" value="'+ query +'"></input><button class="icon magnify"><i class="fa fa-search" aria-label="Start Search"></i></button>' +
                                        '<button class="icon reset"><i class="fa fa-times" aria-label="Reset Search"></i></button>' +
                                    '</form>' +
                                '</div>' +
                                (results.length > 0 ? '<div class="results-count">Results ' + range + ' of about ' + total + ' for ' + query + '.</div>' : "") +
                                window.txstsearch.formatResults(results) +
                                (results.length > 0 ? window.txstsearch.html_pagination(page, Math.ceil(total/10)) : "" ) +
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
                    html += '<div class="result">' +
                                '<a class="result-title" href="' + results[i].url +'">' + results[i].title + '</a>' +
                                '<p class="summary">' + results[i].summary_html + '</p>' +
                                '<a class="result-url-display" href="' + results[i].url + '">' + results[i].url_display + '</a>' +
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
