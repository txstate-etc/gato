
var faqNode;
var faqHidden;

var FaqTree = (function() {
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

    questionInput.observe('change', updateData);
    titleInput.observe('change', updateData);
  }

  function onFaqCkEditorReady(editorId) {
    for (var name in CKEDITOR.instances) {
      if (CKEDITOR.instances[name].id == editorId) {
        editor = CKEDITOR.instances[name];
        break;
      }
    }

    // Make sure faq data is saved when user clicks save button
    jQuery('.commit').focus(onSave);
    
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
    $('faq_tree').childElements().each(function(item) { processLi(item, faqNode); });
    faqHidden.val(JSON.stringify(faqNode)).change();
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

    if (li.hasClassName('faq_tree_group_node')) {
      node_object.properties.push(createProperty('nodetype', 'group', 'String'));
      node_object.properties.push(createProperty('title', li.down('[title="group"]').innerHTML, 'String'));
      //node_object.children = [];
      node_object.properties.push(createProperty('isOpen', li.hasClassName('faq_tree_open'), 'Boolean'));
      
      if (li.down('ul')) {
        li.down('ul').childElements().each(function(item) { processLi(item, node_object); });
      }
    }
    else {
      node_object.properties.push(createProperty('nodetype', 'faq', 'String'));
      node_object.properties.push(createProperty('question', li.down('[title="question"]').innerHTML, 'String'));
      node_object.properties.push(createProperty('answer', $('answer-' + li.id).value, 'String'));
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
    return '<li class="faq_tree_faq_node selected_node" id="' + li_id + '">' +
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

  function buildFaqTree(rootNode, el) {
    var isNew = !rootNode.nodes || rootNode.nodes.length == 0;

    var faqTree = jQuery('<ul id="faq_tree"></ul>');
    if (isNew) {
      var html = newFaqHtml('node0');
      faqTree.append(html);
    } else {
      rootNode.nodes.forEach(function(node) {
        faqTree.append(buildTreeHtml(node));
      });
    }

    jQuery(el).closest('fieldset').append()
    jQuery(el).append(faqTree);
    var titleHtml = '<div class="v-form-field-section">' +
                      '<div class="v-form-field-label" title="Title">Title</div>' +
                      '<div class="v-form-field-container"><input type="text" class="faqText" id="faqTitle"/></div>' +
                    '</div>';

    var questionHtml = '<div class="v-form-field-section">' +
                         '<div class="v-form-field-label" title="Question">Question</div>' +
                         '<div class="v-form-field-container"><input type="text" class="faqText" id="faqQuestion"/></div>' +
                       '</div>';

    jQuery(el).closest('.v-form-field-section').after(titleHtml).after(questionHtml);
    
    questionInput = jQuery('#faqQuestion')[0];
    titleInput = jQuery('#faqTitle')[0];
  }

  function buildTreeHtml(node) {
    node.cleanup();
    var nodeEl;
    if (node.prophash['nodetype'] == 'group') {
      nodeEl = buildGroupHtml(node);
    } else {
      nodeEl = buildItemHtml(node);
    }

    if (node.nodes) {
      var ul = jQuery('<ul></ul>');
      node.nodes.forEach(function(n) {
        ul.append(buildTreeHtml(n));
      })
      nodeEl.append(ul);
    }
    return nodeEl;
  }

  function buildGroupHtml(groupNode) {
    var id = groupNode.name;
    var title = groupNode.prophash['title'];
    var isOpen = groupNode.prophash['isOpen'];
    var expandClass = isOpen ? 'faq_tree_open' : 'faq_tree_closed';

    if (groupNode.prophash['selected']) {
      expandClass += ' selected_node';
    }

    var html = '<li class="faq_tree_group_node ' + expandClass + '" id="' + id + '">' +
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
    return jQuery(html);
  }

  function buildItemHtml(itemNode, parentEl) {
    var id = itemNode.name;
    var question = itemNode.prophash["question"];
    var answer = itemNode.prophash["answer"];

    var nodeClass = '';
    if (itemNode.prophash['selected']) {
      nodeClass = ' selected_node';
    }

    var answerInput = jQuery('<input type="hidden" id="answer-' + id + '" />');
    answerInput.val(answer); 

    var html = '<li class="faq_tree_faq_node' + nodeClass + '" id="' + id + '">' +
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
    html = jQuery(html);
    html.find('span[title="answer"]').append(answerInput);
    return html;
  }

  return {
    onLoad: onLoad,
    onFaqCkEditorReady: onFaqCkEditorReady,
    updateData: updateData,
    updateDisplay: updateDisplay,
    buildFaqTree: buildFaqTree
  }

})();

function initFaqHierarchy(def, node, el) {
  path = node;
  faqHidden = jQuery(el).closest('.v-form-field-container').find('input.faqTree');
  faqNode = new jcrnode("website", node + '/faqTree', JSON.parse(faqHidden.val()));
  FaqTree.buildFaqTree(faqNode, el);

  // Save faq data when keyboard shortcut for save happens (Enter is pressed or <access key>+s is pressed)
  // See https://documentation.magnolia-cms.com/display/DOCS/Keyboard+shortcuts
  jQuery(el).closest('.v-panel-content').keydown(function(e) {
    if (e.keyCode == 13 || (e.keyCode == 83 && (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey))) {
      FaqTree.onSave();
    }
  });
  FaqTree.onLoad();
}
