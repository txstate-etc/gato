function initConditionSelector(def, node, el, tmpl) {
  var mynode = new jcrnode("website", node);
  var parent =  mynode.name == 'questions' ? mynode.getParent() : mynode.getParent().getParent();
  var parentdiv = $(el);
  var hidden = parentdiv.closest('.v-form-field-container').find('input.conditions');
  var startval = hidden.val();
  var conditionsnode = new jcrnode("website", node+'/conditions', jQuery.parseJSON(startval));
  var preselected = conditionsnode.getPropertyValues().reduce(function (acc, cur, i) { acc[cur] = true; return acc; }, {});
  
  parent.fetch(3).done(function(parentnode) {
    var question = parentnode.prophash.title;
    var answernode = parentnode.nodehash.answers;
    var answers = answernode.getChildren()
    var html = '<div>'+
                '<div class="gato-question">'+question+'</div>'+
                '<ul class="gato-answers">'
    var answersExist = false;
    for (var j=0; j<answers.length; j++) {
      answersExist = true;
      var answer = answers[j];
      var answerText = answer.prophash.title;
      var answerId = answer.prophash.id;
      var inputId = 'answer-' + j
      html += '<li>'+
                '<input id="'+inputId+'" name="answers" type="checkbox" value="' + answerId +'"'+ (preselected[answerId] ? 'checked="checked"' : '')+' >'+
                '<label for="' + inputId + '">'+answerText+'</label>'+
              '</li>'
    }
    html += '</ul>'
    if (!answersExist) {
      html += '<span>No answers have been added for this question.</span>'
    }
    html += '</div>'
    parentdiv.append(html)
    parentdiv.find('.gato-answers input').change(function(e) {
      conditionsnode.clearProperties();
      parentdiv.find('.gato-answers input:checked').each(function(index) {
        var condition = $(this);
        conditionsnode.setProperty(index, condition.val());
      })
      hidden.val(JSON.stringify(conditionsnode)).change();
    })
  })

}