// require jQuery
(function () {

  var answerhtml = function(name, id, value) {
    if (!id) id = Math.random().toString(16).substring(2);
    var html = '<div class="gato-answer">'+
                 '<input type="text" name="'+name+'_answertext" id="'+name+'_answertext" value="'+(value||'')+'">'+
                 '<input type="hidden" class="answerid" name="'+name+'_answerid" value="'+id+'">'+
                 '<div tabindex="0" role="button" class="v-button v-widget inline v-button-inline"><span class="v-button-wrap"><span class="v-button-caption"><span class="icon-arrow2_n"></span></span></span></div>'+
                 '<div tabindex="0" role="button" class="v-button v-widget inline v-button-inline"><span class="v-button-wrap"><span class="v-button-caption"><span class="icon-arrow2_s"></span></span></span></div>'+
                 '<div tabindex="0" role="button" class="v-button v-widget inline v-button-inline"><span class="v-button-wrap"><span class="v-button-caption"><span class="icon-trash"></span></span></span></div>'+
                '</div>'
    return html
  }

  window.initanswerlist = function(def, path, parentdiv, templateId) {
    parentdiv = $(parentdiv);
    var hidden = parentdiv.closest('.v-form-field-container').find('input.answers');
    var startval = hidden.val();
    var answersnode = new jcrnode("website", path+'/answers', jQuery.parseJSON(startval));

    html =  '<div class="gato-answerlist">';
    $.each(answersnode.getChildren(), function (idx, node) {
      html += answerhtml(node.name, node.prophash.id, node.prophash.title);
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
        var $answertextinput = $answer.find('input[type="text"]');
        var $answeridinput = $answer.find('input[type="hidden"]');
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
      $answer.find('input[type="text"]').focus();
    })
  }
})();