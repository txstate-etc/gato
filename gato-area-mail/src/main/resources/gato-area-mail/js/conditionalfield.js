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

  // **~*~**~*~**~*~**~*~** VERSION 2 **~*~**~*~**~*~**~*~**
  $('.formelement.conditional.two').each(function() {
      var $field = $(this)
      var activeConditions = {}
      var conditionHash = {}
      var conditionQuestionIds = []

      $field.find('.txst-form-selectiongroup.conditional').each(function() {
        var questionid = $(this).attr('id')
        conditionQuestionIds.push(questionid)
        $(this).find('.choicetwo').each(function() {
          var answerid = $(this).data('id')
          conditionHash[answerid] = questionid
        })
      })

      $field.find('.dependent-question').each(function() {
        var $question = $(this)
        $question.find('input, textarea, select').each(function() {
          removeName($(this))
        })
      })

      $field.find('.choicetwo').change(function(e) {
        var $selected = $(e.target)
        var questionId = $selected.closest('.txst-form-selectiongroup.conditional').attr('id')
        var answerId = $selected.data('id')
        updateActiveConditions(questionId, answerId)
        updateForm()
      })

      function updateActiveConditions(questionId, answerId) {
        activeConditions[questionId] = answerId
      }
      function updateForm() {
        $field.find('.dependent-question').each(function() {
          var $question = $(this)
          var dependsOn = {}
          var conditionsMet = true;
          var conditions = $question.data('conditions').split(',')
          for (var condition of conditions) {
            var questionid = conditionHash[condition]
            if (questionid) {
              if (!dependsOn[questionid]) {
                dependsOn[questionid] = []
              }
              dependsOn[questionid].push(condition)
            }
          }
          for (var q in dependsOn) {
            if (dependsOn.hasOwnProperty(q)) {
              //dependsOn[q] contains the answers that reveal this question
              if (!activeConditions[q] || dependsOn[q].indexOf(activeConditions[q]) == -1) {
                conditionsMet = false;
                continue;
              }
            }
          }
          if (conditionsMet) {
            $question.show()
            $question.find('input, textarea, select').each(function() {
              replaceName($(this))
            })
          }
          else {
            $question.hide()
            $question.find('input, textarea, select').each(function() {
              removeName($(this))
            })
          }
        })
      }
  })

})
