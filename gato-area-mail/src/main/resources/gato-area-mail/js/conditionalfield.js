jQuery(document).ready(function($) {
  $('.formelement.conditional').each(function() {
    var $field = $(this)
    $field.find('.conditional-questions input').each(function() {
      var $input = $(this)
      removeName($input)
    })
    $(this).find('.choice').change(function(e) {
      var $selected = $(e.target)
      var answergroupid = $selected.data('answergroup')
      $('.conditional-answer').removeClass('active')
      $('#' + answergroupid).addClass('active')
      $('#' + answergroupid).find('input').each(function() {
        replaceName($(this))
      })
    })
  })

  function removeName($input) {
    var name = $input.attr('name')
    $input.attr('data-name', name)
    $input.removeAttr('name')
  }

  function replaceName($input) {
    var name = $input.attr('data-name')
    $input.attr('name', name)
  }
})
