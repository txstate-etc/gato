jQuery(document).ready(function($) {

  var activeFilters = {};

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

  var searchArea = $('.filterable-search-container');
  var filterToggleButton = $('.btn-toggle-filters');
  var mobileUrlParams = {};

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
      if (isMobile()) {
        $('.filter-group-list').find('li').eq(0).find('.header').focus();
        //save current url parameters
        mobileUrlParams = getUrlParameters();
      }
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

  $('.select-filters .header').click(function(e) {
    toggleFilterList(this);
  })

  $('.select-filters .header').keydown(function(e) {
    if (e.which == 32 || e.which == 13) {
      e.preventDefault();
      toggleFilterList(e.target);
    }
  })

  var clearFilters = function() {
    $('.filter-container .filter-cbx').each(function(index, value) {
      var checkbox = $(value);
      if (checkbox.hasClass('is-checked')) {
        toggleCheckbox(checkbox);
      }
    })
    if (isMobile()) {
      $('.btn-apply-filters').text('Apply Reset');
      if ($('.apply-filters').css('display') == "none")
        $('.apply-filters').velocity("slideDown", {duration: 300});
    }
    updateSearchResults();
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

  var updateUrlParameters = function(filters, query) {
    var params = getUrlParameters();
    params.filters = filters.join(',');
    if (query.length > 0) {
      params.q = query
    }
    history.pushState(null, null, createUrlQuery(params));
  }

  var updateScreenReaderFilterGroupText = function(group) {
    var numSelectedFilters = group.find('.filter-cbx.is-checked').length;
    var text = numSelectedFilters;
    text += (numSelectedFilters == 1) ? " filter selected." : " filters selected.";
    group.find('.header .sr-filters-selected').text(text);
  }

  var itemContainsQuery = function(item, query) {
    var found = false;
    var searchables = item.find("*[data-searchable='true']");
    $.each(searchables, function(idx, elem) {
      if ($(elem).text().toLowerCase().indexOf(query) > -1) {
          found = true;
          return false;
        }
    });
    if (!found && item.data('keywords').toLowerCase().indexOf(query) > -1) {
      found = true;
    }
    return found;
  }

  var itemMatchesFilters = function(item) {
    var isRelevant = true;
    var tags = item.data('tags').split(',');
    for (var group in activeFilters) {
      if (activeFilters.hasOwnProperty(group)) {
        var selectedTags = activeFilters[group];
        var hasTag = selectedTags.some(function(v) {
          return tags.indexOf(v) >= 0;
        });
        if (!hasTag) {
          isRelevant = false;
          continue;
        }
      }
    }
    return isRelevant;
  }

  var updateResultsShown = function() {
    var totalItems = $('.filtered-results .listitem').length;
    var itemsHidden = $('.result.listitem-hidden').length;
    var resultCountText = "";
    if (itemsHidden == 0) {
      resultCountText = totalItems + (totalItems == 1 ? " Result" : " Results");
    }
    else {
      var itemsShown = totalItems - itemsHidden;
      resultCountText = itemsShown + (itemsShown == 1 ? " result" : " results of " + totalItems);
    }
    $('#result-count').text("Showing " + resultCountText);
    $('#mobile-result-count').text(resultCountText);
    if (itemsHidden == totalItems) {
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

  var updateSearchResults = function() {
    var query = $('#search-field').val();
    if (isMobile()) {
      query = $('#mobile-search-field').val();
    }
    query = query.toLowerCase();
    var arrFilters = getSelectedFilters();
    $('.filter-count').text("(" + arrFilters.length + ")")
    updateUrlParameters(arrFilters, query);
    updateActiveFilters(arrFilters);

    $('.filtered-results .listitem').each(function(index, item) {
      item = $(item);
      var isRelevant = true;
      if (query.length > 0) {
        isRelevant = itemContainsQuery(item, query);
        if (isRelevant) {
          isRelevant = itemMatchesFilters(item);
        }
      }
      else {
        isRelevant = itemMatchesFilters(item);
      }

      if (!isRelevant) {
        item.closest('li').addClass('listitem-hidden')
        item.closest('li').attr('aria-hidden', true);
      }
      else {
        item.closest('li').removeClass('listitem-hidden')
        item.closest('li').attr('aria-hidden', false);
      }
    });

    updateResultsShown();
    updateStripes();
    updateAlphaHeaders();
  }

  var buildActiveFilter = function(name, id) {
    var html = '<li id="active_' + id +'">' +
      '<span class="active-filter">' + name +
        '<button class="remove-filter" aria-label="remove filter ' +  name + '"><i class="fa fa-times" aria-hidden="true"></i></button>' +
      '</span>' +
    '</li>';
    return html;
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
        var checkbox = $('#' + id);
        toggleCheckbox(checkbox);
        if (isMobile()) {
          if ($('.apply-filters').css('display') == "none")
            $('.apply-filters').velocity("slideDown", {duration: 300});
        }
        updateSearchResults();
      });
    }
    cb.toggleClass('is-checked');
    cb.parent().toggleClass('selected');
    updateScreenReaderFilterGroupText(cb.closest('.select-filters'));
  }

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

  var updateAlphaHeaders = function() {
    if ($('.filtered-results').data('headers')) {
      if ( $('.result.listitem-hidden').length > 0) {
        $('.alpha-header').hide();
      }
      else {
        $('.alpha-header').show();
      }
    }
  }

  $('.filter-cbx').click(function(e) {
    var checkbox = $(this);
    toggleCheckbox(checkbox);
    updateSearchResults()
    if (isMobile()) {
      $('.btn-apply-filters').text('Apply Filters');
      if ($('.apply-filters').css('display') == "none")
        $('.apply-filters').velocity("slideDown", {duration: 300});
    }
  })

  $('.filter-label').click(function(e) {
    var checkbox = $(this).parent().find('.filter-cbx');
    toggleCheckbox(checkbox);
    if (!isMobile())
      updateSearchResults();
  })

  $('.filter-cbx').keydown(function(e) {
    if (e.which == 32 || e.which == 13) {
      e.preventDefault();
      toggleCheckbox($(e.target));
      if (!isMobile())
        updateSearchResults();
    }
  })

  $('.btn-search-list-items').click(function(e) {
    updateSearchResults();
  })

  $('#search-field, #mobile-search-field').keyup(function(e) {
    if (e.keyCode == 13) {
      updateSearchResults();
    }
    else {
      if ($(this).val().length > 0) {
        $('.btn-clear-search-field').show();
      }
      else {
        $('.btn-clear-search-field').hide();
        var params = getUrlParameters();
        params.q="";
        history.pushState(null, null, createUrlQuery(params));
        updateSearchResults();
      }
    }
  })

  //Clear all Filters
  $('.btn-clear-filters').click(function(e) {
    clearFilters();
  })

  $('.btn-close-modal').click(function(e) {
    searchArea.removeClass('filters-open');
    $('.apply-filters').css("display", "none");
    filterToggleButton.attr('aria-expanded', false);
    //reset url parameters to what they were when the filter panel was opened
    history.pushState(null, null, createUrlQuery(mobileUrlParams));
    mobileUrlParams = {};
    resetModalFilters();
    updateSearchResults();
    filterToggleButton.focus();
  });

  $('.btn-apply-filters').click(function(e) {
    searchArea.removeClass('filters-open');
    $('.apply-filters').css("display", "none");
    filterToggleButton.attr('aria-expanded', false);
    filterToggleButton.focus();
  });

  $('.btn-clear-search-field').click(function(e) {
    $('#search-field, #mobile-search-field').val("");
    $('.btn-clear-search-field').hide();
    updateSearchResults();
    var params = getUrlParameters();
    params.q="";
    history.pushState(null, null, createUrlQuery(params));
    $(this).prev('input').focus();
  })

  //on initial page load
  var urlParams = getUrlParameters();
  if (!(urlParams.q && urlParams.q.length > 0) && !urlParams.filters) {
    updateResultsShown();
    if ($('.filtered-results').data('headers')) {
      var firstItem = $('.filtered-results .listitem').first();
      var firstItemText = firstItem.find("*[data-alpha='true']").text().trim();
      var currentLetter = firstItemText.charAt().toUpperCase();
      firstItem.parent().before('<div class="alpha-header" aria-hidden="true">'+ currentLetter +'</div>');
      $('.filtered-results .listitem').each(function(index, item) {
        var text = $(item).find("*[data-alpha='true']").text().trim().toUpperCase();
        var firstLetter = text.charAt();
        if (firstLetter != currentLetter) {
          currentLetter = firstLetter;
          $(item).parent().before('<div class="alpha-header" aria-hidden="true">'+ currentLetter +'</div>')
        }
      });
    }
    updateStripes();
  }
  else {
    var query = urlParams.q || "";
    $('#search-field,#mobile-search-field').val(query);
    if (query.length > 0) {
      $('.btn-clear-search-field').show();
    }
    if (urlParams.filters) {
      var filterList = urlParams.filters.split(',');
      updateActiveFilters(filterList);
      filterList.map(function(filterId) {
        var field = $('#' + filterId);
        toggleCheckbox(field);
        $('.filter-count').text("(" + filterList.length + ")")
      })
    }
    updateSearchResults();
  }
  $('.select-filters').each(function() {
    var group = $(this);
    updateScreenReaderFilterGroupText(group);
  })

});
