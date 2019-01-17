//TODO: Can an effect be added to show that an active filter has focus?

jQuery(document).ready(function($) {

  //TODO: The mobile-first template goes to mobile layout below 800 px but is that
  //true for all templates?
  var isMobile = function() {
    var isMobile = false;
    if (window.matchMedia) {
      if (window.matchMedia("(max-width: 50em)").matches) {
        isMobile = true;
      }
    }
    else {
      if ($(window).width() < 801) {
        isMobile = true;
      }
    }
    return isMobile;
  }

  var activeFilters = {};

  var buildActiveFilter = function(name, id) {
    var html = '<li id="active_' + id +'">' +
      '<span class="active-filter">' + name +
        '<button class="remove-filter" aria-label="remove filter -' +  name + '"><i class="fa fa-times" aria-hidden="true"></i></button>' +
      '</span>' +
    '</li>';
    return html;
  }

  var updateFilterableSearch = function() {
    var arrFilters = getSelectedFilters();
    $('.filter-count').text("(" + arrFilters.length + ")")
    updateUrlParameters(arrFilters);
    updateActiveFilters(arrFilters);
    updateSelectedResults();
  }

  var toggleCheckbox = function(cb) {
    var id = cb.attr('id');
    var activeFilterArea = cb.closest('.select-filters').find('.active-filters');
    if (cb.hasClass('is-checked')) {
      cb.attr('aria-checked', false);
      $('#active_' + id).remove();
    }
    else {
      cb.attr('aria-checked', true);
      activeFilterArea.append(buildActiveFilter(cb.data('name'), id));
      $('#active_' + id).find('button').click(function(e) {
        //get the checkbox with this id
        var checkbox = $('#' + id);
        toggleCheckbox(checkbox);
        if (!isMobile())
          updateFilterableSearch();
      });
    }
    cb.toggleClass('is-checked');
    cb.parent().toggleClass('selected');
    updateScreenReaderFilterGroupText(cb.closest('.select-filters'));
  }

  var updateUrlParameters = function(filters) {
    var params = getUrlParameters();
    params.filters = filters.join(',');
    history.pushState(null, null, createUrlQuery(params));
  }

  var getSelectedFilters = function() {
    var selected = [];
    $('.filter-container .filter-cbx').each(function(index, value) {
      var checkbox = $(value);
      if (checkbox.hasClass('is-checked')) {
        selected.push(checkbox.attr('id'));
      }
    })
    return selected;
  }

  var updateActiveFilters = function(filterIds) {
    activeFilters = {};
    for (var i=0; i<filterIds.length; i++) {
      var id = filterIds[i];
      var groupId = $('#' + id).data('group');
      if (!activeFilters[groupId]) {
        activeFilters[groupId] = [];
      }
      activeFilters[groupId].push(id);
    }
  }

  var queryPresent = function() {
    var params = getUrlParameters();
    return params.q
  }

  var updateSelectedResults = function() {
    var resultCount = 0;
    $('.filtered-results .listitem').each(function(index, item) {
      item = $(item);
      var tags = item.data('tags').split(',');
      var isRelevant = true;
      if (queryPresent() && !item.data('matches-query')) {
        isRelevant = false;
      }
      if (isRelevant) {
        for (var group in activeFilters) {
          if (activeFilters.hasOwnProperty(group)) {
            var selectedTags = activeFilters[group];
            var hasTag = selectedTags.some(function(v) {
              return tags.indexOf(v) >= 0;
            })
            if (!hasTag) {
              isRelevant = false;
              continue;
            }
          }
        }
      }
      if (!isRelevant) {
        item.closest('li').addClass('listitem-hidden')
        item.closest('li').attr('aria-hidden', true);
      }
      else {
        item.closest('li').removeClass('listitem-hidden')
        item.closest('li').attr('aria-hidden', false);
        resultCount++;
      }
    });

    updateResultsShown();

    //add stripes to results
    updateStripes();
  }

  $('.filter-cbx').click(function(e) {
    var checkbox = $(this);
    toggleCheckbox(checkbox);
    if (!isMobile())
      updateFilterableSearch();
  })

  $('.filter-cbx').keydown(function(e) {
    if (e.which == 32 || e.which == 13) {
      e.preventDefault();
      toggleCheckbox($(e.target));
      if (!isMobile())
        updateFilterableSearch();
    }
  })

  var updateScreenReaderFilterGroupText = function(group) {
    var numSelectedFilters = group.find('.filter-cbx.is-checked').length;
    var text = numSelectedFilters;
    text += (numSelectedFilters == 1) ? " filter selected." : " filters selected.";
    group.find('.header .sr-filters-selected').text(text);
  }

  var updateResultsShown = function() {
    var itemsShown = $('.result:not(".listitem-hidden")');
    var resultCountText = "Showing " + itemsShown.length + (itemsShown.length == 1 ? " Result" : " Results");
    $('#result-count').text(resultCountText);
    if (itemsShown.length == 0) {
      $('#no-results-message').removeClass("message-hidden")
    }
    else {
      $('#no-results-message').addClass("message-hidden")
    }
  }

  var updateStripes = function() {
    $('.result:not(".listitem-hidden")').each(function(i,v) {
      $(v).removeClass('has-background');
      if (i % 2 == 1) {
        $(v).addClass('has-background');
      }
    });
  }

  var searchListItems = function() {
    var query = $('#search-field').val();
    if (isMobile()) {
      query = $('#mobile-search-field').val();
    }
    query = query.toLowerCase();
    var params = getUrlParameters();
    params.q = query;
    history.pushState(null, null, createUrlQuery(params));
    //loop through list items and look for query in items with data-searchable=true and keywords
    $('.filtered-results .listitem').each(function(index, item) {
      var item = $(item);
      item.closest('li').removeClass('listitem-hidden')
      item.closest('li').attr('aria-hidden', false);
      var found = false;
      var searchables = item.find("*[data-searchable='true']");
      $.each(searchables, function(idx, elem) {
        if ($(elem).text().toLowerCase().indexOf(query) > -1) {
          found = true;
          return false;
        }
      })
      if (!found && item.data('keywords').toLowerCase().indexOf(query) > -1) {
        found = true;
      }

      if (found) {
        item.attr("data-matches-query", "true");
      }
      else {
        item.closest('li').addClass('listitem-hidden')
        item.closest('li').attr('aria-hidden', true);
      }
    })
    updateResultsShown();
    updateStripes();
  }

  //on initial page load
  var urlParams = getUrlParameters();
  if (urlParams.q) {
    $('#search-field,#mobile-search-field').val(urlParams.q);
    searchListItems();
  }
  if (urlParams.filters) {
    var filterList = urlParams.filters.split(',');
    updateActiveFilters(filterList);
    filterList.map(function(filterId) {
      var field = $('#' + filterId);
      toggleCheckbox(field);
    })
    $('.filter-count').text("(" + filterList.length + ")")
    updateSelectedResults(filterList);
  }
  else {
    updateResultsShown();
  }

  updateStripes();

  $('.select-filters').each(function() {
    var group = $(this);
    updateScreenReaderFilterGroupText(group);
  })

  var searchArea = $('.filterable-search-container');
  var filterToggleButton = $('.btn-toggle-filters');

  //open and close filter panel
  filterToggleButton.click(function(e) {
    if (searchArea.hasClass('filters-open')) {
      searchArea.removeClass('filters-open');
      filterToggleButton.attr('aria-expanded', false);
      filterToggleButton.focus();
    }
    else {
      searchArea.addClass('filters-open');
      filterToggleButton.attr('aria-expanded', true);
      if (isMobile())
        $('.filter-group-list').find('li').eq(0).find('.header').focus();
      else {
        $('#search-field').focus();
      }
    }
  })

  //open and close filter lists
  var toggleFilterList = function(target) {
    var dropdown = $(target);
    var panel = dropdown.parent().find('.body');
    if (dropdown.parent().hasClass('open')) {
      dropdown.attr('aria-expanded', false);
      panel.velocity("slideUp", {duration: 300});
    }
    else {
      dropdown.attr('aria-expanded', true);
      panel.velocity("slideDown", {duration: 300});
    }
    dropdown.parent().toggleClass('open');
  }

  var clearFilters = function() {
    $('.filter-container .filter-cbx').each(function(index, value) {
      var checkbox = $(value);
      if (checkbox.hasClass('is-checked')) {
        toggleCheckbox(checkbox);
      }
    })
  }

  $('.select-filters .header').click(function(e) {
    toggleFilterList(this);
  })

  $('.select-filters .header').keydown(function(e) {
    if (e.which == 32 || e.which == 13) {
      e.preventDefault();
      toggleFilterList(e.target);
    }
  })

  //Clear all Filters
  $('.btn-clear-filters').click(function(e) {
    clearFilters();
    if (!isMobile())
      updateFilterableSearch();
  })

  $('.btn-close-modal').click(function(e) {
    searchArea.removeClass('filters-open');
    filterToggleButton.attr('aria-expanded', false);
    resetModalFilters();
    filterToggleButton.focus();
  });

  $('.btn-apply-filters').click(function(e) {
    searchArea.removeClass('filters-open');
    filterToggleButton.attr('aria-expanded', false);
    updateFilterableSearch();
    filterToggleButton.focus();
  });

  //TODO: This should happen if they close the modal with ESC or tap outside of it too
  //But it looks like the modal should take up the full screen.
  var resetModalFilters = function() {
    var filterList= [];
    var urlParams = getUrlParameters();
    if (urlParams.filters) {
      filterList = urlParams.filters.split(',');
    }
    $('.filter-container .filter-cbx').each(function(index, value) {
      var checkbox = $(value);
      if (filterList.includes(checkbox.attr('id'))) {
        if (!checkbox.hasClass('is-checked')) {
          toggleCheckbox(checkbox);
        }
      }
      else {
        if (checkbox.hasClass('is-checked')) {
          toggleCheckbox(checkbox);
        }
      }
    });
  }
  //TODO: It should do the search when the user hits enter after typing a search term too.
  $('.btn-search-list-items').click(function(e) {
    clearFilters();
    updateFilterableSearch();
    searchListItems();
  })

})
