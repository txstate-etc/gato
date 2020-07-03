jQuery(document).ready(function($) {
  $('.mobilefirst-pattern.announcementbanner .color-overlay').each(function() {
    var bg = $(this).css('background-color')
    var opacity = $(this).attr('data-opacity')
    if (bg.indexOf('a') == -1) {
      var newbg = bg.replace('rgb', 'rgba').replace(')', ',   ' + (parseInt(opacity)/100) + ')')
      $(this).css('background-color', newbg)
    }
  })
})
