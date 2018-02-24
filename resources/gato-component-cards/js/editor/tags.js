// require jQuery
window.inittags = function (def, path, parentdiv, templateId) {
  var mynode = new jcrnode("website", path);
  parentdiv = $(parentdiv);
  var hidden = parentdiv.closest('.v-form-field-container').find('input.tags');
  var startval = hidden.val();
  var groupnode = new jcrnode("website", path+'/tags', jQuery.parseJSON(startval));

  mynode.getParent().fetchParent().done(function (section) {
    section.nodehash.filterlist.fetch().done(function (filterlist) {
      var filters = filterlist.getPropertyValues();
      var preselected = groupnode.getPropertyValues().reduce(function (acc, cur, i) { acc[cur] = true; return acc; }, {});
      html = '<div class="gato-tags">';
      for (var i = 0; i < filters.length; i++) {
        html += '<input type="checkbox" id="gatofilters_'+filters[i]+'" name="gatofilters" value="'+filters[i]+'"'+(preselected[filters[i]] ? 'checked="checked"' : '')+'><label for="gatofilters_'+filters[i]+'">'+filters[i]+'</label><br>';
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
  });
}
