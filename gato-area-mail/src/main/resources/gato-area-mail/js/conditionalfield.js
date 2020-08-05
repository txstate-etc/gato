jQuery(document).ready(function($) {
  $('.formelement.conditional').each(function() {
    var $field = $(this)
    $field.find('.conditional-questions input, .conditional-questions textarea, .conditional-questions select').each(function() {
      var $input = $(this)
      removeName($input)
    })
    $(this).find('.choice').change(function(e) {
      var $selected = $(e.target)
      var answergroupid = $selected.data('answergroup')
      $('.conditional-answer').removeClass('active')
      $('.conditional-answer input, .conditional-answer textarea, .conditional-answer select').each(function() {
        removeName($(this))
      })
      $('#' + answergroupid).addClass('active')
      $('#' + answergroupid).find('input, textarea, select').each(function() {
        replaceName($(this))
      })
    })
    $(this).find('.conditional-select').change(function(e) {
      var answergroupid = ($(this).find(':selected').data('answergroup'))
      $('.conditional-answer').removeClass('active')
      $('.conditional-answer input, .conditional-answer textarea, .conditional-answer select').each(function() {
        removeName($(this))
      })
      if (answergroupid) {
        $('#' + answergroupid).addClass('active')
        $('#' + answergroupid).find('input, textarea, select').each(function() {
          replaceName($(this))
        })
      }
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
