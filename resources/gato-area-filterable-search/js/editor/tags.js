function initTagSelector(def, node, el, tmpl) {
  var mynode = new jcrnode("website", node);
  var filtergroupsnode =  (mynode.name == 'listitems' ? mynode.getParent() : mynode.getParent().getParent()).getChild('filtergroups');
  var parentdiv = $(el);
  var hidden = parentdiv.closest('.v-form-field-container').find('input.tags');
  var startval = hidden.val();
  var tagsnode = new jcrnode("website", node+'/tags', jQuery.parseJSON(startval));

  filtergroupsnode.fetch(3).done(function (filtergroups) {
    var groups = filtergroups.getChildren();
    var preselected = tagsnode.getPropertyValues().reduce(function (acc, cur, i) { acc[cur] = true; return acc; }, {});
    var html = '<ul class="filter-groups">';
    var tagsExist = false;
    for (var j=0; j< groups.length; j++) {
      var group = groups[j];
      var groupTitle = group.prophash.category;
      var tags = group.nodehash.filterlist.getChildren();
      html += '<li>';
      html += '<div class="group-title">' + groupTitle + '</div>';
      html += '<ul class="gato-tags">';
      for (var i=0; i<tags.length; i++) {
        tagsExist = true;
        var tag = tags[i];
        var inputId = "filter-" + groupTitle + "-" + tag.prophash.name;
        html += '<li>';
        html += '<input class="cbx-tag" id="' + inputId + '" name="filter-' + groupTitle + '" type="checkbox" value="' + tag.prophash.id +'"' + (preselected[tag.prophash.id] ? 'checked="checked"' : '') + '>';
        html += '<label for=' + inputId + '>' + tag.prophash.name + '</label>';
        html += '</li>';
      }
      html += '</ul>';
      html += '</li>';
    }
    html += '</ul>';
    if (tagsExist) {
      $(el).append(html);
      $(el).find('.gato-tags input').change(function(e) {
        tagsnode.clearProperties();
        $(el).find('.gato-tags input:checked').each(function(index) {
          var tag = $(this);
          tagsnode.setProperty(index, tag.val());
        })
        hidden.val(JSON.stringify(tagsnode)).change();
      })
    }
    else {
      $(el).append("Filters have not been defined for this search template");
    }
  });

}
