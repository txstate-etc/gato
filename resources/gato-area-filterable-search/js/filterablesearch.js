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

  var updateSelectedResults = function() {
    var resultCount = 0;
    $('.filtered-results .listitem').each(function(index, item) {
      item = $(item);
      var tags = item.data('tags').split(',');
      var isRelevant = true;
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
    var resultCountText = "Showing " + resultCount + (resultCount == 1 ? " Result" : " Results");
    $('#result-count').text(resultCountText);
    //add stripes to results
    $('.result:not(".listitem-hidden")').each(function(i,v) {
      $(v).removeClass('has-background');
      if (i % 2 == 1) {
        $(v).addClass('has-background');
      }
    });
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

  //on initial page load
  var urlParams = getUrlParameters();
  if (urlParams.filters) {
    var filterList = urlParams.filters.split(',');
    updateActiveFilters(filterList);
    filterList.map(function(filterId) {
      var field = $('#' + filterId);
      toggleCheckbox(field);
    })
    updateSelectedResults(filterList);
  }
  else {
    var listItemCount = $('li.result').length;
    var resultCountText = "Showing " + listItemCount + (listItemCount == 1 ? " Result" : " Results");
    $('#result-count').text(resultCountText);
  }

  if ($('.filterable-search').data('enabled-alphabet-filters')) {
    var enabledLetters = $('.filterable-search').data('enabled-alphabet-filters');
    for (var i=0; i < enabledLetters.length; i++) {
      $('#filter-' + enabledLetters.charAt(i)).prop("disabled", false);
    }
  }

  $('li.result').each(function(i,v) {
    if (i % 2 == 1) {
      $(v).addClass('has-background');
    }
  });

  $('.select-filters').each(function() {
    var group = $(this);
    updateScreenReaderFilterGroupText(group);
  })



  var searchArea = $('.filterable-search-container');
  var filterToggleButton = $('.btn-toggle-filters');

  //open and close filter panel
  filterToggleButton.click(function(e) {
    if (isMobile()) {
      mobileFilterModal.show();
    }
    else {
      if (searchArea.hasClass('filters-open')) {
        searchArea.removeClass('filters-open');
        filterToggleButton.attr('aria-expanded', false);
      }
      else {
        searchArea.addClass('filters-open');
        filterToggleButton.attr('aria-expanded', true);
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

  //Clear all Filters
  $('.btn-clear-filters').click(function(e) {
    $('.filter-container .filter-cbx').each(function(index, value) {
      var checkbox = $(value);
      if (checkbox.hasClass('is-checked')) {
        toggleCheckbox(checkbox);
      }
    })
    if (!isMobile())
      updateFilterableSearch();
  })

  $('.btn-close-modal').click(function(e) {
    mobileFilterModal.hide();
    resetModalFilters();
  });

  $('.btn-apply-filters').click(function(e) {
    updateFilterableSearch();
    mobileFilterModal.hide();
  });

  //TODO: This should happen if they close the modal with ESC or tap outside of it too
  //But it looks like the modal should take up the full screen.
  var resetModalFilters = function() {
    var urlParams = getUrlParameters();
    if (urlParams.filters) {
      var filterList = urlParams.filters.split(',');
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
  }
})
