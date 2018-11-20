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

  var toggleCheckbox = function(cb) {
    var $cb = $(cb);
    if ($cb.hasClass('is-checked')) {
      $cb.attr('aria-checked', false);
    }
    else {
      $cb.attr('aria-checked', true);
    }
    $cb.toggleClass('is-checked');
  }

  $('.filter-cbx').click(function(e) {
    toggleCheckbox(this);
  })

  $('.filter-cbx').keydown(function(e) {
    if (e.which == 32 || e.which == 13) {
      e.preventDefault();
      toggleCheckbox(e.target)
    }
  })
})
