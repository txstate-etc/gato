function initConditionSelector(def, node, el, tmpl) {
  var mynode = new jcrnode("website", node);
  var parent =  mynode.name == 'questions' ? mynode.getParent() : mynode.getParent().getParent();
  var questionlistnode = parent.getChild('questionlist')
  var parentdiv = $(el);
  var hidden = parentdiv.closest('.v-form-field-container').find('input.conditions');
  var startval = hidden.val();
  var conditionsnode = new jcrnode("website", node+'/conditions', jQuery.parseJSON(startval));

  questionlistnode.fetch(3).done(function(questionlist) {
    var questions = questionlist.getChildren()
    var preselected = conditionsnode.getPropertyValues().reduce(function (acc, cur, i) { acc[cur] = true; return acc; }, {});
    var html = '<ul class="condition-questions">'
    var questionsExist = false
    for (var j=0; j< questions.length; j++) {
      questionsExist = true
      var question = questions[j];
      var questionText = question.prophash.title
      var questionId = question.prophash.id
      var answernode = question.nodehash.answerlist
      html +='<li class="question-li">' + '<span class="question-text">'+questionText+'</span>'
      if (answernode) {
        var answers = answernode.getChildren()
        html+= '<ul class="gato-conditions">'
        var answersExist = false
        for(var k=0; k<answers.length; k++) {
          answersExist = true
          var answer = answers[k]
          var inputId = "answer-" + questionId + "-" + answer.prophash.title;
          html+= '<li>'+
                  '<input id="'+inputId+'" name="answer-' + questionId + '" type="checkbox" value="' + answer.prophash.id +'"'+ (preselected[answer.prophash.id] ? 'checked="checked"' : '') + '>'+
                  '<label for=' + inputId + '>' + answer.prophash.title + '</label>'+
                  '</li>'
        }
        html+= '</ul>'
        if (!answersExist) {
          html += '<span>Error message about this question not having answers</span>'
        }
      }
      html +='</li>'
    }
    html+= '</ul>'
    if (!questionsExist) {
      html+='<span>Error message about the lack of "filtering" questions</span>'
    }
    $(el).append(html);
    $(el).find('.condition-questions input').change(function(e) {
      conditionsnode.clearProperties();
      $(el).find('.gato-conditions input:checked').each(function(index) {
        var condition = $(this);
        conditionsnode.setProperty(index, condition.val());
      })
      hidden.val(JSON.stringify(conditionsnode)).change();
    })
  }).fail(function(err) {
    console.log(err)
  })
}
