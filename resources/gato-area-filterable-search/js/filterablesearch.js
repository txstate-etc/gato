//TODO: Can an effect be added to show that an active filter has focus?

//TODO: Selecting/Deselecting filters should update the querystring

jQuery(document).ready(function($) {
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

  var buildActiveFilter = function(name, id) {
    var html = '<li id="active_' + id +'">' +
      '<span class="active-filter">' + name +
        '<button class="remove-filter" aria-label="remove filter -' +  name + '"><i class="fa fa-times" aria-hidden="true"></i></button>' +
      '</span>' +
    '</li>';
    return html;
  }

  var removeFilter = function(id) {
    $('#active_' + id).remove();
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
      });
    }
    cb.toggleClass('is-checked');
  }

  $('.filter-cbx').click(function(e) {
    var checkbox = $(this);
    toggleCheckbox(checkbox);
  })

  $('.filter-cbx').keydown(function(e) {
    if (e.which == 32 || e.which == 13) {
      e.preventDefault();
      toggleCheckbox($(e.target))
    }
  })
})
