var selectedLi;
var editor;
var lastItemId = 0;
var emptyNodeTitle = "--No Text Entered--";
var answerInput;
var questionInput;
var titleInput;

function onLoad() {
  $$('#faq_tree li').each(function(item) {
    if (!item.hasClassName("faq_tree_faq_node") && !item.hasClassName("faq_tree_group_node")) return;

    Position.includeScrollOffsets = true;
    attachEventHandlers(item);
    var idNum = item.id.substr(4, item.id.length - 4);  
    if (parseInt(idNum) > lastItemId) lastItemId = parseInt(idNum);

    var nodeTitle = item.down('dl').down('dt').innerHTML;
    item.down('dl').down('dt').innerHTML = getDisplayTitle(nodeTitle);

    if (item.hasClassName('selected_node')) {
      selectedLi = item;
    }
  });

  answerInput = $$('.faqAnswer')[0];
  questionInput = $$('.faqQuestion')[0];
  titleInput = $$('.faqTitle')[0];
  
  questionInput.observe('change', updateData);
  titleInput.observe('change', updateData);
  
  //$('mgnlSaveButton').writeAttribute('onclick', 'onSave(); ' + 
  //                                   $('mgnlSaveButton').readAttribute('onclick'));

  waitForCKEditor();
}

function waitForCKEditor() {
  if (typeof(CKEDITOR) != 'undefined') {
    CKEDITOR.on('instanceReady', function(e) {
      e.editor.on('selectionChanged', updateData)
      editor = e.editor;
      updateDisplay();
    });
  } else {
    setTimeout(waitForCKEditor, 100);
  }
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

  //Convert the faq tree to a json that will be sent to the server.
  json_data = {children: []};
  $('faq_tree').childElements().each(function(item) { processLi(item, json_data); });
  $('json_data').value = JSON.stringify(json_data);
}

function processLi(li, json_data) {
  var node_object = {id: li.id};

  if (li == selectedLi) {
    node_object.selected = true;
  }

  if (li.hasClassName('faq_tree_group_node')) {
    node_object.nodetype = 'group';
    node_object.title = li.down('[title="group"]').innerHTML;
    node_object.children = [];
    node_object.isOpen = li.hasClassName('faq_tree_open');
    
    if (li.down('ul')) {
      li.down('ul').childElements().each(function(item) { processLi(item, node_object); });
    }
  }
  else {
    node_object.nodetype = 'faq';
    node_object.question = li.down('[title="question"]').innerHTML;
    node_object.answer = $('answer-' + li.id).value;
  }
  
  json_data.children.push(node_object);
}

function attachEventHandlers(nodeLi) {
  nodeLi.down('dt').observe('click', onSelectItem);
  nodeLi.down('.delete_node_action').observe('click', onDelete); 
  nodeLi.down('.add_group_action').observe('click', onAddGroup);
  nodeLi.down('.add_faq_action').observe('click', onAddFaq);

  Droppables.add('drop-' + nodeLi.id, {
    accept: ['faq_tree_group_node','faq_tree_faq_node'],
    onDrop: function(dragged, dropped, event) { dropped.up('li').insert({before: dragged}); setSelectedLi(dragged); dragged.addClassName('just_dropped') },
    hoverclass: 'node_drop_div_hover'
  });
  
  var group_drop_options = {
    accept: ['faq_tree_group_node', 'faq_tree_faq_node'],
    onDrop: function(dragged, dropped, event) {
              var li = dropped.up('li');
              if (!li.down('ul')) {
                li.insert(new Element('ul'));
              }
              li.down('ul').insert(dragged);
              li.removeClassName('faq_tree_closed');
              li.addClassName('faq_tree_open');
              setSelectedLi(dragged);
              dragged.addClassName('just_dropped');
            },
    hoverclass: 'node_drop_hover'
  }
      
  if (nodeLi.hasClassName('faq_tree_group_node')) {
    nodeLi.down('.expander').observe('click', onExpandCollapse);
    Droppables.add('dl-' + nodeLi.id, group_drop_options); 
  }
  
  new Draggable(nodeLi.id, {
    revert: function(element) { 
              element.setStyle({position: 'relative', width: '', height: '', top: ''}); 
            }, 
    constraint: 'vertical',
    onStart: function(draggable, event) {
               if (nodeLi.hasClassName('faq_tree_group_node')) {
                 Droppables.remove('dl-' + nodeLi.id);
               }
        
               answerInput.up('.v-form-field-section').hide();
             },
    onEnd: function(draggable, event) {
             if (nodeLi.hasClassName('faq_tree_group_node')) {
               Droppables.add('dl-' + nodeLi.id, group_drop_options);
             }
          }
  });
}

function onExpandCollapse(event) {
  var parentLi = event.element().up('li');
  
  if (parentLi.hasClassName('faq_tree_open')) {
    parentLi.removeClassName('faq_tree_open');
    parentLi.addClassName('faq_tree_closed');
  }
  else if (parentLi.hasClassName('faq_tree_closed')) {
    parentLi.removeClassName('faq_tree_closed');
    parentLi.addClassName('faq_tree_open');
  }     
}

function newFaqHtml(li_id) {
  return '<li class="faq_tree_faq_node" id="' + li_id + '">' +
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
  return '<li class="faq_tree_group_node faq_tree_closed" id="' + li_id + '">' +
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
  var element = event.element().up('li');
  var ul;

  if (element.hasClassName('faq_tree_faq_node')) {
    ul = element.up('ul');
  }
  else {
    if (!element.down('ul')) {
      element.insert(new Element('ul'));
    }
    ul = element.down('ul');
  
    element.removeClassName('faq_tree_closed');
    element.addClassName('faq_tree_open');
  }

  ul.insert(newFaqHtml(newId));
  
  attachEventHandlers(ul.down('[id="' + newId + '"]'));  
  setSelectedLi($(newId));
}

function onAddGroup(event) {
  var newId = "node" + (++lastItemId).toString();
  var element = event.element().up('li');
  var ul;
  
  if (element.hasClassName('faq_tree_faq_node')) {
    ul = element.up('ul');
  }
  else {
    if (!element.down('ul')) {
      elemenet.insert(new Element('ul'));
    }
    ul = element.down('ul');

    element.removeClassName('faq_tree_closed');
    element.addClassName('faq_tree_open');
  }
  
  ul.insert(newGroupHtml(newId));
  
  attachEventHandlers(ul.down('[id="' + newId + '"]'));
  setSelectedLi($(newId));
}

function onDelete(event) {
  var parentUl = event.element().up('ul');
  var li = event.element().up('li');

  //Check if the node to be deleted is the last one.
  if (parentUl.id == 'faq_tree' && parentUl.childElements().length == 1) {
    alert("Can't delete the only remaining node.");
    return;
  }

  setSelectedLi(li);

  if (confirm("Are you sure you want to delete this node?")) {  
    if (selectedLi == li) {
      if (li.next('li')) {
        setSelectedLi(li.next('li'));
      }
      else if (li.previous('li')) {
        setSelectedLi(li.previous('li'));
      }
      else {
        setSelectedLi(parentUl.up('li'));
      }
    }
    li.remove();
  }
}

function setSelectedLi(li) {
  //Firefox fires the onClick event after an item is dropped, so return right away if the item was just dropped.
  if (li.hasClassName('just_dropped'))
    return;

  updateData();

  if (/webkit/i.test(navigator.userAgent)) {
    document.activeElement.blur();
  }

  if (selectedLi) {
    selectedLi.removeClassName('selected_node');
    selectedLi.removeClassName('just_dropped');
  }

  selectedLi = li;
  selectedLi.addClassName('selected_node');
  updateDisplay(); 
}

function onSelectItem(event) {
  setSelectedLi(event.element().up('li'));
}

function updateData() {
  if (!selectedLi) return;
  
  var nodeTitle = "";
  
  if (selectedLi.hasClassName('faq_tree_group_node')) {
    nodeTitle = titleInput.value;
    selectedLi.down('[title="group"]').innerHTML = "";
    selectedLi.down('[title="group"]').appendChild(document.createTextNode(nodeTitle));
  }
  else if (selectedLi.hasClassName('faq_tree_faq_node')) {
    nodeTitle = questionInput.value;
    selectedLi.down('[title="question"]').innerHTML = "";
    selectedLi.down('[title="question"]').appendChild(document.createTextNode(nodeTitle));
    
    $('answer-' + selectedLi.id).value = editor.getData();
  }
 
  selectedLi.down('dt').innerHTML = "";
  selectedLi.down('dt').appendChild(document.createTextNode(getDisplayTitle(nodeTitle)));
}

function updateDisplay() {
  if (!selectedLi) return;
  
  if (selectedLi.hasClassName('faq_tree_group_node')) {
    showGroupNodeData();
  }
  else if (selectedLi.hasClassName('faq_tree_faq_node')) {
    showFaqNodeData();
  }
}

function showFaqNodeData() {
  questionInput.up('.v-form-field-section').show();
  answerInput.up('.v-form-field-section').show();
  titleInput.up('.v-form-field-section').hide();
  
  var questionTitle = selectedLi.down('[title="question"]');
  questionInput.value = questionTitle.childNodes[0] ? questionTitle.childNodes[0].nodeValue : "";
  answerInput.value = $('answer-' + selectedLi.id).value;
  editor.setData($('answer-' + selectedLi.id).value);
  
  questionInput.focus();
}

function showGroupNodeData() {
  titleInput.up('.v-form-field-section').show();
  questionInput.up('.v-form-field-section').hide();
  answerInput.up('.v-form-field-section').hide();
  
  var groupTitle = selectedLi.down('[title="group"]');
  titleInput.value = groupTitle.childNodes[0] ? groupTitle.childNodes[0].nodeValue : "";
  titleInput.focus();
}

function initFaqHierarchy(def, node, el) {
  $(el).up('.v-form-field-section').hide();
  onLoad();
}
