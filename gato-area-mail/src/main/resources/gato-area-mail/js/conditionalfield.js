jQuery(document).ready(function($) {
  $('.formelement.conditional').each(function() {
    var $field = $(this)
    var activeConditions = []

    function removeName($input) {
      var name = $input.attr('name')
      $input.attr('data-name', name)
      $input.removeAttr('name')
    }
  
    function replaceName($input) {
      var name = $input.attr('data-name')
      $input.attr('name', name)
    }

    $field.find('.dependent-question').each(function() {
      var $question = $(this)
      $question.find('input, textarea, select').each(function() {
        removeName($(this))
      })
    })

    $field.find('.choice').change(function(e) {
      updateActiveConditions()
      updateForm()
    })

    $field.find('.conditional-select').change(function(e) {
      updateActiveConditions()
      updateForm()
    })

    function updateActiveConditions() {
      var selected = $field.find('.choice:checked')
      activeConditions = []
      selected.each(function() {
        activeConditions.push($(this).data('id'))
      })
    }

    function updateForm() {
      $field.find('.dependent-question').each(function() {
        var $question = $(this)
        var conditions = $question.data('conditions').split(',')
        var conditionsMet = false;
        //one of the conditions needs to be in activeConditions
        for (var condition of conditions) {
          if (activeConditions.indexOf(condition) > -1) {
            conditionsMet = true;
            continue;
          }
        }
        if (conditionsMet) {
          $question.addClass('active')
          $question.find('input, textarea, select').each(function() {
            replaceName($(this))
          })
        }
        else {
          $question.removeClass('active')
          $question.find('input, textarea, select').each(function() {
            removeName($(this))
          })
        }
      })
    }
  })
})
