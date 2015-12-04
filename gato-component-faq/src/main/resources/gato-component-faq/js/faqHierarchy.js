var faqNode;
var $faqHidden;

var FaqTree = (function() {
  var selectedLi;
  var $selectedLi;
  var editor;
  var lastItemId = 0;
  var emptyNodeTitle = "--No Text Entered--";
  var answerInput;
  var $questionInput;
  var $titleInput;

  function onLoad() {
    $('#faq_tree li').each(function() {
      var $item = $(this);
      if (!$item.hasClass("faq_tree_faq_node") && !$item.hasClass("faq_tree_group_node")) return;

      attachEventHandlers($item[0]);
      var idNum = $item[0].id.substr(4, $item[0].id.length - 4);  
      if (parseInt(idNum) > lastItemId) lastItemId = parseInt(idNum);

      var nodeTitle = $item.find('dl dt')[0].innerHTML;
      $item.find('dl dt')[0].innerHTML = getDisplayTitle(nodeTitle);

      if ($item.hasClass('selected_node')) {
        selectedLi = $item[0];
        $selectedLi = $(selectedLi);
      }
    });

    $questionInput.change(updateData);
    $titleInput.change(updateData);
  }

  function onFaqCkEditorReady(editorId) {
    for (var name in CKEDITOR.instances) {
      if (CKEDITOR.instances[name].id == editorId) {
        editor = CKEDITOR.instances[name];
        break;
      }
    }

    // Make sure faq data is saved when user clicks save button
    $('.commit').focus(onSave);
    
    answerInput = editor.element.$;
    editor.once("dataReady", updateDisplay);
  }

  function getDisplayTitle(title) {
    if (!title) {
        return emptyNodeTitle;
    }
    if (title.length > 44) {
      return title.substr(0, 41) + '...';
    }
    return title;
  }

  function onSave() {
    updateData();
    faqNode.nodes = [];

    //Convert the faq tree to a json that will be sent to the server.
    $('#faq_tree').children().each(function() { processLi(this, faqNode); });
    $faqHidden.val(JSON.stringify(faqNode)).change();
  }

  function processLi(li, json_data) {
    var node_object = {
      name: li.id,
      type: 'mgnl:area',
      path: json_data.path + '/' + li.id,
      nodes: [],
      properties: []
    };

    if (li == selectedLi) {
      node_object.properties.push(createProperty("selected", true, "Boolean"));
    }

    var $li = $(li);
    var $dl = $('#dl-' + li.id);
    if ($li.hasClass('faq_tree_group_node')) {
      node_object.properties.push(createProperty('nodetype', 'group', 'String'));
      node_object.properties.push(createProperty('title', $dl.find('[title="group"]')[0].innerHTML, 'String'));
      node_object.properties.push(createProperty('isOpen', $li.hasClass('faq_tree_open'), 'Boolean'));
      
      if ($li.children('ul').length) {
        $li.children('ul').children().each(function() { processLi(this, node_object); });
      }
    }
    else {
      node_object.properties.push(createProperty('nodetype', 'faq', 'String'));
      node_object.properties.push(createProperty('question', $dl.find('[title="question"]')[0].innerHTML, 'String'));
      node_object.properties.push(createProperty('answer', $('#answer-' + li.id).val(), 'String'));
    }
    
    json_data.nodes.push(node_object);
  }

  function createProperty(key, val, type) {
    return {
      name: key,
      type: type,
      multiple: false,
      values: [val]
    }
  }

  function attachEventHandlers(nodeLi) {
    var $nodeLi = $(nodeLi);
    var $dl = $('#dl-' + nodeLi.id);
    $dl.find('dt').click(onSelectItem);
    $dl.find('.delete_node_action').click(onDelete); 
    $dl.find('.add_group_action').click(onAddGroup);
    $dl.find('.add_faq_action').click(onAddFaq);

    var $drop = $('#drop-' + nodeLi.id);
    $drop.droppable({
      accept: '.faq_tree_node',
      drop: function(event, ui) {
        $drop.closest('li').before(ui.draggable);
        ui.draggable.css('top', '0');
        setSelectedLi(ui.draggable[0]);
        ui.draggable.addClass('just_dropped');
      },
      hoverClass: 'node_drop_div_hover'
    });
        
    if ($nodeLi.hasClass('faq_tree_group_node')) {
      $dl.find('.expander').click(onExpandCollapse);
      $dl.droppable({
        accept: '.faq_tree_node',
        drop: function(event, ui) {
          var $li = $dl.closest('li');
          if (!$li.children('ul').length) {
            $li.append('<ul></ul>');
          }
          $li.children('ul').append(ui.draggable);
          $li.removeClass('faq_tree_closed');
          $li.addClass('faq_tree_open');
          ui.draggable.css('top', '0');
          setSelectedLi(ui.draggable[0]);
          ui.draggable.addClass('just_dropped');
        },
        hoverClass: 'node_drop_hover'
      });
    }

    $nodeLi.draggable({
      axis: "y",
      revert: "invalid",
      start: function(event, ui) {
        if ($nodeLi.hasClass('faq_tree_group_node')) {
          $dl.droppable("disable");
        }
        $nodeLi.removeClass('just_dropped');
        $(answerInput).closest('.v-form-field-section').hide();
      },
      stop: function(event, ui) {
        if ($nodeLi.hasClass('faq_tree_group_node')) {
          $dl.droppable("enable");
        }
      }
    });
  }

  function onExpandCollapse(event) {
    var $parentLi = $(this).closest('li');
    
    if ($parentLi.hasClass('faq_tree_open')) {
      $parentLi.removeClass('faq_tree_open');
      $parentLi.addClass('faq_tree_closed');
    }
    else if ($parentLi.hasClass('faq_tree_closed')) {
      $parentLi.removeClass('faq_tree_closed');
      $parentLi.addClass('faq_tree_open');
    }     
  }

  function newFaqHtml(li_id) {
    return '<li class="faq_tree_faq_node faq_tree_node selected_node" id="' + li_id + '">' +
             '<div class="node_drop_div" id="drop-' + li_id + '"></div>' +
             '<dl id="dl-' + li_id + '">' +
               '<span class="expander"></span>' +
               '<span class="node_icon"></span>' +
               '<dt>' + emptyNodeTitle + '</dt>' +
               '<dd class="node_data">' +
                 '<span title="question"></span>' +
                 '<span title="answer"><input type="hidden" id="answer-' + li_id + '" value="" /></span>' +
               '</dd>' +
               '<dd class="node_actions">' +
                 '<span class="delete_node_action" title="Delete"></span>' +
                 '<span class="add_group_action" title="Add Group"></span>' +
                 '<span class="add_faq_action" title="Add Faq"></span>' +
               '</dd>' +
             '</dl>' +
           '</li>';
  }

  function newGroupHtml(li_id) {
    return '<li class="faq_tree_group_node faq_tree_closed faq_tree_node" id="' + li_id + '">' +
             '<div class="node_drop_div" id="drop-' + li_id + '"></div>' +
             '<dl id="dl-' + li_id + '">' +
               '<span class="expander"></span>' +
               '<span class="node_icon"></span>' +
               '<dt>' + emptyNodeTitle + '</dt>' +
               '<dd class="node_data">' +
                 '<span title="group"></span>' +
               '</dd>' +
               '<dd class="node_actions">' +
                 '<span class="delete_node_action" title="Delete"></span>' +
                 '<span class="add_group_action" title="Add Group"></span>' +
                 '<span class="add_faq_action" title="Add Faq"></span>' +
               '</dd>' +
             '</dl>' +
           '</li>';
  }

  function onAddFaq(event) {    
    var newId = "node" + (++lastItemId).toString();
    var $element = $(this).closest('li');
    var $ul;

    if ($element.hasClass('faq_tree_faq_node')) {
      $ul = $element.closest('ul');
    }
    else {
      if (!$element.children('ul').length) {
        $element.append('<ul></ul>');
      }
      $ul = $element.children('ul');
    
      $element.removeClass('faq_tree_closed');
      $element.addClass('faq_tree_open');
    }

    $ul.append(newFaqHtml(newId));
    
    var $newLi = $('#' + newId);
    attachEventHandlers($newLi[0]);  
    setSelectedLi($newLi[0]);
  }

  function onAddGroup(event) {
    var newId = "node" + (++lastItemId).toString();
    var $element = $(this).closest('li');
    var $ul;
    
    if ($element.hasClass('faq_tree_faq_node')) {
      $ul = $element.closest('ul');
    }
    else {
      if (!$element.children('ul').length) {
        $element.append('<ul></ul>');
      }
      $ul = $element.children('ul');

      $element.removeClass('faq_tree_closed');
      $element.addClass('faq_tree_open');
    }
    
    $ul.append(newGroupHtml(newId));
    
    var $newLi = $('#' + newId);
    attachEventHandlers($newLi[0]);
    setSelectedLi($newLi[0]);
  }

  function onDelete(event) {
    var $parentUl = $(this).closest('ul');
    var $li = $(this).closest('li');

    //Check if the node to be deleted is the last one.
    if ($parentUl[0].id == 'faq_tree' && $parentUl.children().length == 1) {
      alert("Can't delete the only remaining node.");
      return;
    }

    if (confirm("Are you sure you want to delete this node?")) {  
      if (selectedLi == $li[0]) {
        if ($li.next('li').length) {
          setSelectedLi($li.next('li')[0]);
        }
        else if ($li.prev('li').length) {
          setSelectedLi($li.prev('li')[0]);
        }
        else {
          setSelectedLi($parentUl.closest('li')[0]);
        }
      }
      $li.remove();
    }
  }

  function setSelectedLi(li) {
    //Firefox fires the onClick event after an item is dropped, so return right away if the item was just dropped.
    if ($(li).hasClass('just_dropped'))
      return;

    updateData();

    if (/webkit/i.test(navigator.userAgent)) {
      document.activeElement.blur();
    }

    if (selectedLi) {
      $selectedLi.removeClass('selected_node');
      $selectedLi.removeClass('just_dropped');
    }

    selectedLi = li;
    $selectedLi = $(selectedLi);
    $selectedLi.addClass('selected_node');
    updateDisplay(); 
  }

  function onSelectItem(event) {
    setSelectedLi($(this).closest('li')[0]);
  }

  function updateData() {
    if (!selectedLi) return;
    
    var nodeTitle = "";
    
    if ($selectedLi.hasClass('faq_tree_group_node')) {
      nodeTitle = $titleInput.val();
      $selectedLi.find('[title="group"]')[0].innerHTML = "";
      $selectedLi.find('[title="group"]')[0].appendChild(document.createTextNode(nodeTitle));
    }
    else if ($selectedLi.hasClass('faq_tree_faq_node')) {
      nodeTitle = $questionInput.val();
      $selectedLi.find('[title="question"]')[0].innerHTML = "";
      $selectedLi.find('[title="question"]')[0].appendChild(document.createTextNode(nodeTitle));
      
      $('#answer-' + selectedLi.id).val(editor.getData());
    }
   
    $selectedLi.find('dt')[0].innerHTML = "";
    $selectedLi.find('dt')[0].appendChild(document.createTextNode(getDisplayTitle(nodeTitle)));
  }

  function updateDisplay() {
    if (!selectedLi) return;
    
    if ($selectedLi.hasClass('faq_tree_group_node')) {
      showGroupNodeData();
    }
    else if ($selectedLi.hasClass('faq_tree_faq_node')) {
      showFaqNodeData();
    }
  }

  function showFaqNodeData() {
    $questionInput.closest('.v-form-field-section').show();
    $(answerInput).closest('.v-form-field-section').show();
    $titleInput.closest('.v-form-field-section').hide();
    
    var questionTitle = $selectedLi.find('[title="question"]')[0];
    $questionInput.val(questionTitle.childNodes[0] ? questionTitle.childNodes[0].nodeValue : "");
    answerInput.value = $('#answer-' + selectedLi.id).val();
    editor.setData($('#answer-' + selectedLi.id).val());
    
    $questionInput.focus();
  }

  function showGroupNodeData() {
    $titleInput.closest('.v-form-field-section').show();
    $questionInput.closest('.v-form-field-section').hide();
    $(answerInput).closest('.v-form-field-section').hide();
    
    var groupTitle = $selectedLi.find('[title="group"]')[0];
    $titleInput.val(groupTitle.childNodes[0] ? groupTitle.childNodes[0].nodeValue : "");
    $titleInput.focus();
  }

  function buildFaqTree(rootNode, el) {
    var isNew = !rootNode.nodes || rootNode.nodes.length == 0;

    var $faqTree = $('<ul id="faq_tree"></ul>');
    if (isNew) {
      var html = newFaqHtml('node0');
      $faqTree.append(html);
    } else {
      rootNode.nodes.forEach(function(node) {
        $faqTree.append(buildTreeHtml(node));
      });
    }

    $(el).closest('fieldset').append()
    $(el).append($faqTree);
    var titleHtml = '<div class="v-form-field-section">' +
                      '<div class="v-form-field-label" title="Title">Title</div>' +
                      '<div class="v-form-field-container"><input type="text" class="faqText" id="faqTitle"/></div>' +
                    '</div>';

    var questionHtml = '<div class="v-form-field-section">' +
                         '<div class="v-form-field-label" title="Question">Question</div>' +
                         '<div class="v-form-field-container"><input type="text" class="faqText" id="faqQuestion"/></div>' +
                       '</div>';

    $(el).closest('.v-form-field-section').after(titleHtml).after(questionHtml);
    
    $questionInput = $('#faqQuestion');
    $titleInput = $('#faqTitle');
  }

  function buildTreeHtml(node) {
    node.cleanup();
    var $nodeEl;
    if (node.prophash['nodetype'] == 'group') {
      $nodeEl = buildGroupHtml(node);
    } else {
      $nodeEl = buildItemHtml(node);
    }

    if (node.nodes) {
      var $ul = $('<ul></ul>');
      node.nodes.forEach(function(n) {
        $ul.append(buildTreeHtml(n));
      })
      $nodeEl.append($ul);
    }
    return $nodeEl;
  }

  function buildGroupHtml(groupNode) {
    var id = groupNode.name;
    var title = groupNode.prophash['title'];
    var isOpen = groupNode.prophash['isOpen'] == 'true';
    var expandClass = isOpen ? 'faq_tree_open' : 'faq_tree_closed';

    if (groupNode.prophash['selected']) {
      expandClass += ' selected_node';
    }

    var html = '<li class="faq_tree_group_node faq_tree_node ' + expandClass + '" id="' + id + '">' +
               '<div class="node_drop_div" id="drop-' + id + '">&#160;</div>' +
               '<dl id="dl-' + id + '">' +
               '<span class="expander">&#160;</span>' +
               '<span class="node_icon">&#160;</span>' +
               '<dt>' + title + '</dt>' +
               '<dd class="node_data">' +
               '<span title="group">' + title + '</span>' +
               '</dd>' +
               '<dd class="node_actions">' +
               '<span class="delete_node_action" title="Delete">&#160;</span>' +
               '<span class="add_group_action" title="Add Group">&#160;</span>' +
               '<span class="add_faq_action" title="Add Faq">&#160;</span>' +
               '</dd>' +
               '</dl>';
    return $(html);
  }

  function buildItemHtml(itemNode, parentEl) {
    var id = itemNode.name;
    var question = itemNode.prophash["question"];
    var answer = itemNode.prophash["answer"];

    var nodeClass = '';
    if (itemNode.prophash['selected']) {
      nodeClass = ' selected_node';
    }

    var $answerInput = $('<input type="hidden" id="answer-' + id + '" />');
    $answerInput.val(answer); 

    var html = '<li class="faq_tree_faq_node faq_tree_node' + nodeClass + '" id="' + id + '">' +
               '<div class="node_drop_div" id="drop-' + id + '">&#160;</div>' +
               '<dl id="dl-' + id + '">' +
               '<span class="expander">&#160;</span>' +
               '<span class="node_icon">&#160;</span>' +
               '<dt>' + question + '</dt>' +
               '<dd class="node_data">' +
               '<span title="question">' + question + '</span>' +
               '<span title="answer"></span>' +
               '</dd>' +
               '<dd class="node_actions">' +
               '<span class="delete_node_action" title="Delete">&#160;</span>' +
               '<span class="add_group_action" title="Add Group">&#160;</span>' +
               '<span class="add_faq_action" title="Add Faq">&#160;</span>' +
               '</dd>' +
               '</dl>' +
               '</li>';
    $html = $(html);
    $html.find('span[title="answer"]').append($answerInput);
    return $html;
  }

  return {
    onLoad: onLoad,
    onFaqCkEditorReady: onFaqCkEditorReady,
    onSave: onSave,
    updateData: updateData,
    updateDisplay: updateDisplay,
    buildFaqTree: buildFaqTree
  }

})();

function initFaqHierarchy(def, node, el) {
  path = node;
  $faqHidden = $(el).closest('.v-form-field-container').find('input.faqTree');
  faqNode = new jcrnode("website", node + '/faqTree', JSON.parse($faqHidden.val()));
  FaqTree.buildFaqTree(faqNode, el);

  // Save faq data when keyboard shortcut for save happens (Enter is pressed or <access key>+s is pressed)
  // See https://documentation.magnolia-cms.com/display/DOCS/Keyboard+shortcuts
  $(el).closest('.v-panel-content').keydown(function(e) {
    if (e.keyCode == 13 || (e.keyCode == 83 && (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey))) {
      FaqTree.onSave();
    }
  });
  FaqTree.onLoad();
}
