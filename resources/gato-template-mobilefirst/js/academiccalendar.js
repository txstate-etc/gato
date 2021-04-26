jQuery(document).ready(function($) {

  $('#btn-toggle-more-filters').on('click', function() {
    var moreFilters = $('.filters .more')
    if (moreFilters.hasClass('expanded')) {
      moreFilters.removeClass('expanded')
      $(this).find('span').text('Show more filters')
      $(this).attr('aria-expanded', false)
    } else {
      moreFilters.addClass('expanded')
      $(this).find('span').text('Hide more filters')
      $(this).attr('aria-expanded', true)
    }
  })

  $('.ac-dropdown .toggle-dropdown').on('click', function() {
    var field = $(this).closest('.ac-dropdown')
    var menu = $(this).closest('.ac-dropdown').find('.menu')
    if (field.hasClass('expanded')) {
      field.removeClass('expanded')
    } else {
      var height = field.outerHeight()
      menu.css('top', height)
      field.addClass('expanded')
    }
  })

})