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
      for (var tag of tags) {
        html += '<li>';
        html += tag.prophash.name;
        html += '</li>';
      }
      html += '</ul>';
      html += '</li>';
    }
    html += '</ul>';
    $(el).append(html);
  });

}
