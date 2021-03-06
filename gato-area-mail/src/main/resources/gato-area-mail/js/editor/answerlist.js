// require jQuery
(function () {

  var answerhtml = function(name, id, value, helptext) {
    if (!id) id = Math.random().toString(16).substring(2);
    var escapedValue = value ? value.replace(/"/g, '&quot;') : ''
    var escapedHelpText = helptext ? helptext.replace(/"/g, '&quot;') : ''
    var html = '<div class="gato-answer">'+
                '<div>'+
                  '<div>'+
                    '<label class="gato-answer-label" for="'+name+'_answertext">Answer</label>' +
                    '<input class="answertext" type="text" name="'+name+'_answertext" id="'+name+'_answertext" value="'+ escapedValue +'">'+
                  '</div>'+
                  '<div>'+
                    '<label class="gato-helptext-label" for="'+name+'_helptext">Help Text</label>' +
                    '<input class="helptext" type="text" name="'+name+'_helptext" id="'+name+'_helptext" value="'+ escapedHelpText +'">'+
                  '</div>'+
                  '<input type="hidden" class="answerid" name="'+name+'_answerid" value="'+id+'">'+
                '</div>'+
                '<div>'+
                  '<div tabindex="0" role="button" class="v-button v-widget inline v-button-inline"><span class="v-button-wrap"><span class="v-button-caption"><span class="icon-arrow2_n"></span></span></span></div>'+
                  '<div tabindex="0" role="button" class="v-button v-widget inline v-button-inline"><span class="v-button-wrap"><span class="v-button-caption"><span class="icon-arrow2_s"></span></span></span></div>'+
                  '<div tabindex="0" role="button" class="v-button v-widget inline v-button-inline"><span class="v-button-wrap"><span class="v-button-caption"><span class="icon-trash"></span></span></span></div>'+
                '</div>'+
              '</div>'
    return html
  }

  window.initanswerlist = function(def, path, parentdiv, templateId) {
    parentdiv = $(parentdiv);
    var hidden = parentdiv.closest('.v-form-field-container').find('input.answers');
    var startval = hidden.val();
    var answersnode = new jcrnode("website", path+'/answers', jQuery.parseJSON(startval));

    html =  '<br/><div class="gato-answerlist">';
    $.each(answersnode.getChildren(), function (idx, node) {
      html += answerhtml(node.name, node.prophash.id, node.prophash.title, node.prophash.helptext);
    });
    if (!answersnode.getChildren().length) {
      html += answerhtml(0);
    }
    html += '</div>'
    html += '<button id="answeradd">Add Answer</button>';

    var inputchanged = function () {
      var nh = answersnode.getChildren().reduce(function (acc, curr) { acc[curr.prophash.id] = curr; return acc; }, {});
      answersnode.clearNodes();
      answersnode.clearProperties();
      parentdiv.find('.gato-answer').each(function (idx) {
        var $answer = $(this);
        var $answertextinput = $answer.find('input.answertext[type="text"]');
        var $answeridinput = $answer.find('input[type="hidden"]');
        var $answerhelpinput = $answer.find('input.helptext[type="text"]')
        if ($answertextinput.val().length) {
          var n = nh[$answeridinput.val()];
          if (typeof(n) == 'undefined') {
            n = answersnode.addNode(idx, 'mgnl:contentNode');
          }
          else {
            n.name = idx;
            answersnode.addChild(n);
          }
          n.setProperty('id', $answeridinput.val());
          n.setProperty('title', $answertextinput.val());
          if ($answerhelpinput.val().length) {
            n.setProperty('helptext', $answerhelpinput.val());
          }
          else {
            n.setProperty('helptext', '')
          }
        }
      })
      hidden.val(answersnode.json()).change();
    }

    var movedown = function ($answer) {
      var $next = $answer.next('.gato-answer');
      if ($next.length) $answer.insertAfter($next);
      inputchanged();
    }

    var moveup = function ($answer) {
      var $next = $answer.prev('.gato-answer');
      if ($next.length) $answer.insertBefore($next);
      inputchanged();
    }

    var deleteanswer = function ($answer) {
      $answer.remove();
      inputchanged();
    }

    var addhandlers = function ($answer) {
      $answer.find('input[type="text"]').on('change keyup', inputchanged);
      $answer.find('.icon-arrow2_s').click(function () {
        movedown($(this).closest('.gato-answer'));
      });
      $answer.find('.icon-arrow2_n').click(function () {
        moveup($(this).closest('.gato-answer'));
      });
      $answer.find('.icon-trash').click(function () {
        deleteanswer($(this).closest('.gato-answer'));
      });
    }

    parentdiv.append(html)
    addhandlers($('.gato-answerlist'));
    parentdiv.find('#answeradd').click(function() {
      $answer = $(answerhtml(answersnode.getChildren().length));
      $answer.appendTo(parentdiv.find('.gato-answerlist'));
      addhandlers($answer);
      $answer.find('input[type="text"].answertext').focus();
    })
  }
})();