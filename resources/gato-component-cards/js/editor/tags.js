// require jQuery
window.inittags = function (def, path, parentdiv, templateId) {
  var mynode = new jcrnode("website", path);
  // 'path' is different depending on whether it's a new card, in that case 'path'
  // points at the area node since the component node doesn't exist yet
  var filterlistnode = (mynode.name == 'cards' ? mynode.getParent() : mynode.getParent().getParent()).getChild('filterlist');
  parentdiv = $(parentdiv);
  var hidden = parentdiv.closest('.v-form-field-container').find('input.tags');
  var startval = hidden.val();
  var groupnode = new jcrnode("website", path+'/tags', jQuery.parseJSON(startval));

  filterlistnode.fetch().done(function (filterlist) {
    var filters = filterlist.getChildren();
    var preselected = groupnode.getPropertyValues().reduce(function (acc, cur, i) { acc[cur] = true; return acc; }, {});
    html = '<div class="gato-tags">';
    for (var i = 0; i < filters.length; i++) {
      html += '<input type="checkbox" id="gatofilters_'+filters[i].name+'" name="gatofilters" value="'+filters[i].prophash.id+'"'+(preselected[filters[i].prophash.id] ? 'checked="checked"' : '')+'><label for="gatofilters_'+filters[i].name+'">'+filters[i].prophash.name+'</label><br>';
    }
    html += '</div>';
    parentdiv.append(html);
    parentdiv.find('.gato-tags input').change(function (e) {
      groupnode.clearProperties();
      parentdiv.find('.gato-tags input:checked').each(function (idx) {
        var $ipt = $(this);
        groupnode.setProperty(idx, $ipt.val());
      });
      hidden.val(JSON.stringify(groupnode)).change();
    });
  });
}
