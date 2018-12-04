//TODO: Can an effect be added to show that an active filter has focus?

jQuery(document).ready(function($) {

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
        updateFilterableSearch();
      });
    }
    cb.toggleClass('is-checked');
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
    //see if an alphabet filter is selected
    if ($('.radio-letter.letter-selected').length > 0) {
      selected.push($('.radio-letter.letter-selected').attr('id'));
    }
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
      }
    });
  }

  $('.filter-cbx').click(function(e) {
    var checkbox = $(this);
    toggleCheckbox(checkbox);
    updateFilterableSearch();
  })

  $('.filter-cbx').keydown(function(e) {
    if (e.which == 32 || e.which == 13) {
      e.preventDefault();
      toggleCheckbox($(e.target));
      updateFilterableSearch();
    }
  })

  var buildActiveLetter = function(letter) {
    return '<div class="current-active-letter" id="active-letter-' + letter + '">' +
        '<span class="active-filter">' + letter +
          '<button class="remove-filter" aria-label="remove filter letter -' +  letter + '"><i class="fa fa-times" aria-hidden="true"></i></button>' +
        '</span>' +
      '</div>';
  }

  var toggleLetterFilter = function(radio) {
    var letter = radio.val();
    if (radio.is('.letter-selected')) {
      radio.prop("checked", false);
      radio.removeClass("letter-selected");
      $('#active-letter-' + letter).remove();
    }
    else {
      $('.radio-letter.letter-selected').removeClass('letter-selected');
      $('.current-active-letter').remove();
      radio.addClass('letter-selected');

      $('.active-letters').append(buildActiveLetter(letter))
      $('#active-letter-' + letter).find('button').click(function(e) {
        var rdo = $('#filter-' + letter);
        toggleLetterFilter(rdo);
        updateFilterableSearch();
      })
    }
  }

  $('.radio-letter').click(function(e) {
    var radio = $(this);
    toggleLetterFilter(radio);
    updateFilterableSearch();
  });

  //on initial page load
  var urlParams = getUrlParameters();
  if (urlParams.filters) {
    var filterList = urlParams.filters.split(',');
    updateActiveFilters(filterList);
    filterList.map(function(filterId) {
      var field = $('#' + filterId);
      if (field.is('.radio-letter'))
        toggleLetterFilter(field);
      else
        toggleCheckbox(field);
    })
    updateSelectedResults(filterList);
  }



  var searchArea = $('.filterable-search-container');
  var filterToggleButton = $('.btn-toggle-filters');

  //open and close filter panel
  filterToggleButton.click(function(e) {
    if (searchArea.hasClass('filters-open')) {
      searchArea.removeClass('filters-open');
      filterToggleButton.attr('aria-expanded', false);
    }
    else {
      searchArea.addClass('filters-open');
      filterToggleButton.attr('aria-expanded', true);
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
    if ($('.radio-letter.letter-selected').length > 0) {
      toggleLetterFilter($('.radio-letter.letter-selected'));
    }

    updateFilterableSearch();
  })
})
