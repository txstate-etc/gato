function initTagSelector(def, node, el, tmpl) {
  var mynode = new jcrnode("website", node);
  var filtergroupsnode =  (mynode.name == 'listitems' ? mynode.getParent() : mynode.getParent().getParent()).getChild('filtergroups');
  console.log(filtergroupsnode)
  filtergroupsnode.fetch(3).done(function (filtergroups) {
    var groups = filtergroups.getChildren();
    var html = '<ul class="filter-groups">';
    for (var group of groups) {
      var groupTitle = group.prophash.title;
      var tags = group.nodehash.filterlist.getChildren();
      html += '<li>';
      html += '<div class="group-title">' + groupTitle + '</div>';
      html += '<ul>';
      for (var i=0; i<tags.length; i++) {
        var tag = tags[i];
        var inputId = "filter-" + groupTitle + "-" + tag.prophash.name;
        html += '<li>';
        html += '<input id="' + inputId + '" name="filter-' + groupTitle + '" type="checkbox" value="' + tag.prophash.id +'">';
        html += '<label for=' + inputId + '>' + tag.prophash.name + '</label>';
        html += '</li>';
      }
      html += '</ul>';
      html += '</li>';
    }
    html += '</ul>';
    $(el).append(html);
  });

}
