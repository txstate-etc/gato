//TODO: Can an effect be added to show that an active filter has focus?

jQuery(document).ready(function($) {
  var searchArea = $('.filterable-search-container');
  var filterToggleButton = $('.btn-toggle-filters');
  var selectedFilters = {};

  var buildActiveFilter = function(name, id) {
    var html = '<li id="active_' + id +'">' +
      '<span class="active-filter">' + name +
        '<button class="remove-filter" aria-label="remove filter -' +  name + '"><i class="fa fa-times" aria-hidden="true"></i></button>' +
      '</span>' +
    '</li>';
    return html;
  }

  var toggleCheckbox = function(cb) {
    var id = cb.attr('id');
    var activeFilters = cb.closest('.select-filters').find('.active-filters');
    if (cb.hasClass('is-checked')) {
      cb.attr('aria-checked', false);
      removeFilter(id);
    }
    else {
      cb.attr('aria-checked', true);
      activeFilters.append(buildActiveFilter(cb.data('name'), id));
      $('#active_' + id).find('button').click(function(e) {
        //get the checkbox with this id
        var checkbox = $('#' + id);
        toggleCheckbox(checkbox);
        updateUrl();
        updateSelectedResults();
      });
    }
    cb.toggleClass('is-checked');
  }

  var updateSelectedResults = function() {
    $('.filtered-results .listitem').each(function(index, item) {
      item = $(item);
      var tags = item.data('tags').split(',');
      var isRelevant = true;
      for (var group in selectedFilters) {
        if (selectedFilters.hasOwnProperty(group)) {
          var selectedTags = selectedFilters[group];
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
    })
  }

  var updateUrl = function() {
    var params = getUrlParameters();
    var selected = [];
    selectedFilters = {};
    $('.filter-container .filter-cbx').each(function(index, value) {
      var checkbox = $(value);
      if (checkbox.hasClass('is-checked')) {
        selected.push(checkbox.attr('id'));
        var groupId = checkbox.closest('.body').attr('id');
        if (!selectedFilters[groupId]) {
          selectedFilters[groupId] = [];
        }
        selectedFilters[groupId].push(checkbox.attr('id'));
      }
    })
    params.filters = selected.join(',');
    history.pushState(null, null, createUrlQuery(params));
  }

  //get filters from url
  var urlParams = getUrlParameters();
  if (urlParams.filters) {
    var filterList = urlParams.filters.split(',');
    for (var i=0; i<filterList.length; i++) {
      var checkbox = $('#' + filterList[i]);
      var groupId = checkbox.closest('.body').attr('id');
      if (!selectedFilters[groupId]) {
        selectedFilters[groupId] = [];
      }
      selectedFilters[groupId].push(filterList[i]);
      toggleCheckbox(checkbox);
    }
    updateSelectedResults();
  }

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

  //filter lists
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


  var removeFilter = function(id) {
    $('#active_' + id).remove();
  }


  $('.filter-cbx').click(function(e) {
    var checkbox = $(this);
    toggleCheckbox(checkbox);
    updateUrl();
    updateSelectedResults();
  })

  $('.filter-cbx').keydown(function(e) {
    if (e.which == 32 || e.which == 13) {
      e.preventDefault();
      toggleCheckbox($(e.target));
      updateUrl();
      updateSelectedResults();
    }
  })
})
