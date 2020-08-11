// require jQuery
(function () {

  var questionhtml = function (name, id, value, answernode) {
    if (!id) id = Math.random().toString(16).substring(2);

    var html = '<div class="gato-question">'+
            '<input type="text" name="'+name+'_questiontext" id="'+name+'_questiontext" value="'+(value||'')+'">'+
            '<input type="hidden" class="questionid" name="'+name+'_questionid" value="'+id+'">'+
            '<button class="answeradd">Add Answer</button>'+
            '<div tabindex="0" role="button" class="v-button v-widget inline v-button-inline"><span class="v-button-wrap"><span class="v-button-caption"><span class="icon-arrow2_n question"></span></span></span></div>'+
            '<div tabindex="0" role="button" class="v-button v-widget inline v-button-inline"><span class="v-button-wrap"><span class="v-button-caption"><span class="icon-arrow2_s question"></span></span></span></div>'+
            '<div tabindex="0" role="button" class="v-button v-widget inline v-button-inline"><span class="v-button-wrap"><span class="v-button-caption"><span class="icon-trash question"></span></span></span></div>'+
            '<div class="gato-answerlist">'
           if (answernode) {
              $.each(answernode.getChildren(), function(idx, node) {
                html += answerhtml(name,node.name, node.prophash.id, node.prophash.title)
              })
            }
            html += '</div>'+
           '</div>'
    return html;
  }

  var answerhtml = function (questionid, name, id, value) {
    if (!id) id = Math.random().toString(16).substring(2);
    var fieldname = 'q' + questionid + '_' + name + '_answertext'
    return '<div class="gato-answer">'+
              '<input type="text" name="'+fieldname+'" id="'+fieldname +'" value="'+(value||'')+'">'+
              '<input type="hidden" name="'+name+'_answerid" value="'+id+'">'+
              '<div tabindex="0" role="button" class="v-button v-widget inline v-button-inline"><span class="v-button-wrap"><span class="v-button-caption"><span class="icon-arrow2_n answer"></span></span></span></div>'+
              '<div tabindex="0" role="button" class="v-button v-widget inline v-button-inline"><span class="v-button-wrap"><span class="v-button-caption"><span class="icon-arrow2_s answer"></span></span></span></div>'+
              '<div tabindex="0" role="button" class="v-button v-widget inline v-button-inline"><span class="v-button-wrap"><span class="v-button-caption"><span class="icon-trash answer"></span></span></span></div>'+
           '</div>'
  }

  window.initquestionlist = function (def, path, parentdiv, templateId) {
    var mynode = new jcrnode("website", path);
    parentdiv = $(parentdiv);
    var hidden = parentdiv.closest('.v-form-field-container').find('input.questionlist');
    var startval = hidden.val();
    var groupnode = new jcrnode("website", path+'/questionlist', jQuery.parseJSON(startval));

    html =  '<div class="gato-questionlist">';
    $.each(groupnode.getChildren(), function (idx, node) {
      var answersnode = node.nodehash.answerlist
      html += questionhtml(node.name, node.prophash.id, node.prophash.title, answersnode);
    });
    if (!groupnode.getChildren().length) {
      html += questionhtml(0);
    }
    html += '</div>'
    html += '<button id="questionadd">Add Question</button>';

    var inputchanged = function () {
      var nh = groupnode.getChildren().reduce(function (acc, curr) { acc[curr.prophash.id] = curr; return acc; }, {});
      groupnode.clearNodes();
      groupnode.clearProperties();
      parentdiv.find('.gato-question').each(function (idx) {
        var $question = $(this);
        var $questiontextinput = $question.find('input[type="text"]');
        var $questionidinput = $question.find('input[type="hidden"]');
        if ($questiontextinput.val().length) {
          var n = nh[$questionidinput.val()];
          if (typeof(n) == 'undefined') {
            n = groupnode.addNode(idx, 'mgnl:contentNode');
            n.clearNodes()
            n.addNode("answerlist", "mgnl:contentNode")
          }
          else {
            n.name = idx;
            groupnode.addChild(n);
          }
          n.setProperty('id', $questionidinput.val());
          n.setProperty('title', $questiontextinput.val());

          var answersnode = n.nodehash.answerlist
          var anh = answersnode.getChildren().reduce(function(acc, curr) { acc[curr.prophash.id] = curr; return acc; }, {});
          answersnode.clearNodes()
          answersnode.clearProperties()
          $question.find('.gato-answer').each(function (aidx) {
            var $answer = $(this)
            var $answertextinput = $answer.find('input[type="text"]');
            var $answeridinput = $answer.find('input[type="hidden"]');
            if ($answertextinput.val().length) {
              var an = anh[$answeridinput.val()]
              if (typeof(an) == 'undefined') {
                an = answersnode.addNode(aidx, 'mgnl:contentNode')
              }
              else {
                an.name = aidx
                answersnode.addChild(an)
              }
              an.setProperty('id',$answeridinput.val())
              an.setProperty('title', $answertextinput.val())
            }
          })
        }
      })

      hidden.val(groupnode.json()).change();
    }

    var movequestiondown = function ($question) {
      var $next = $question.next('.gato-question');
      if ($next.length) $question.insertAfter($next);
      inputchanged();
    }

    var movequestionup = function ($question) {
      var $next = $question.prev('.gato-question');
      if ($next.length) $question.insertBefore($next);
      inputchanged();
    }

    var deletequestion = function ($question) {
      $question.remove();
      inputchanged();
    }

    var addanswer = function ($question) {
      var questionid = $question.find('.questionid').val()
      var questionnode
      $.each(groupnode.getChildren(), function (idx, node) {
        if (node.prophash.id == questionid) {
          questionnode = node
          return false;
        }
      })
      if (questionnode) {
        $answer = $(answerhtml(questionnode.getChildren().length));
        $answer.appendTo($question.find('.gato-answerlist'))
        addAnswerHandlers($answer)
        $answer.find('input[type="text"]').focus();
      }
    }

    var moveanswerdown = function($answer) {
      var $next = $answer.next('.gato-answer');
      if ($next.length) $answer.insertAfter($next);
      inputchanged();
    }

    var moveanswerup = function ($answer) {
      var $next = $answer.prev('.gato-answer');
      if ($next.length) $answer.insertBefore($next);
      inputchanged();
    }

    var deleteanswer = function ($answer) {
      $answer.remove()
      inputchanged()
    }

    var addhandlers = function ($question) {
      $question.find('input[type="text"]').on('change keyup', inputchanged);
      $question.find('.icon-arrow2_s.question').click(function () {
        movequestiondown($(this).closest('.gato-question'));
      });
      $question.find('.icon-arrow2_n.question').click(function () {
        movequestionup($(this).closest('.gato-question'));
      });
      $question.find('.icon-trash.question').click(function () {
        deletequestion($(this).closest('.gato-question'));
      });
      $question.find('.answeradd').click(function () {
        addanswer($(this).closest('.gato-question'));
      })
    }

    var addAnswerHandlers = function ($answer) {
      $answer.find('input[type="text"]').on('change keyup', inputchanged);
      $answer.find('.icon-arrow2_s.answer').click(function () {
        moveanswerdown($(this).closest('.gato-answer'))
      })
      $answer.find('.icon-arrow2_n.answer').click(function () {
        moveanswerup($(this).closest('.gato-answer'))
      })
      $answer.find('.icon-trash.answer').click(function () {
        deleteanswer($(this).closest('.gato-answer'));
      });
    }

    parentdiv.append(html);
    addhandlers($('.gato-questionlist'));
    parentdiv.find('.gato-answer').each(function(){
      addAnswerHandlers($(this))
    })
    parentdiv.find('#questionadd').click(function() {
      $question = $(questionhtml(groupnode.getChildren().length));
      $question.appendTo(parentdiv.find('.gato-questionlist'));
      addhandlers($question);
      $question.find('input[type="text"]').focus();
    });
    inputchanged();
  }
})();
