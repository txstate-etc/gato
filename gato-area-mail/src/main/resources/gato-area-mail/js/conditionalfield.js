jQuery(document).ready(function($) {
  $('.formelement.conditional').each(function() {
    var $field = $(this)
    $(this).find('.choice').change(function(e) {
      var $selected = $(e.target)
      var answergroupid = $selected.data('answergroup')
      $('.conditional-answer').removeClass('active')
      $('#' + answergroupid).addClass('active')
    })
  })
})
