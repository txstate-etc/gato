// require jQuery
(function () {

var filterhtml = function (name, id, value) {
  if (!id) id = Math.random().toString(16);
  return '<div class="gato-filter">'+
    '<input type="text" name="'+name+'_filtername" id="'+name+'_filtername" value="'+value+'">'+
    '<input type="hidden" name="'+name+'_filterid" value="'+id+'">'+
    '</div>';
}

window.initfilterlist = function (def, path, parentdiv, templateId) {
  var mynode = new jcrnode("website", path);
  parentdiv = $(parentdiv);
  var hidden = parentdiv.closest('.v-form-field-container').find('input.tags');
  var startval = hidden.val();
  var groupnode = new jcrnode("website", path+'/filterlist', jQuery.parseJSON(startval));

  html = '<div class="gato-filterlist">';
  $.each(groupnode.nodes, function (idx, node) {
    html += filterhtml(node.name, node.prophash.id, node.prophash.name);
  });
  html += '<button id="filteradd">Add Filter</button>';
  html += '</div>';

  parentdiv.append(html);
  parentdiv.find('.gato-filterlist input[type="text"]').change(function (e) {
    var nodehash = groupnode.nodes.reduce(function (acc, curr) { acc[curr.prophash.id] = curr; }, {});
    groupnode.clearNodes();
    parentdiv.find('.gato-filter').each(function (idx) {
      var $filter = $(this);
      var $nameinput = $filter.find('input[type="text"]');
      var $idinput = $filter.find('input[type="hidden"]');
      var n = nodehash[$idinput.val()];
      if (typeof(n) == 'undefined') {
        n = groupnode.addNode(idx, 'mgnl:contentnode');
      } else {
        groupnode.addChild(n);
      }
      n.setProperty('id', $idinput.val());
      n.setProperty('name', $nameinput.val());
    });
    hidden.val(JSON.stringify(groupnode)).change();
  });
}

})();
