var jcrutil = {};
jcrutil.contextpath = window.location.pathname.substring(0, window.location.pathname.indexOf("/.magnolia"));
jcrutil.restfulbase = jcrutil.contextpath+"/.rest/";
jcrutil.resourcepath = jcrutil.contextpath+"/.resources/";
jcrutil.nodebase = jcrutil.restfulbase+"nodes/v1/";
jcrutil.getnode = function (workspace, path, depth) {
  return jQuery.ajax(jcrutil.nodebase+workspace+path+"?depth="+depth);
};

function jcrnode(workspace, path, data) {
  var node = this;
  node.workspace = workspace;
  node.path = path;
  node.load(data);
}

jcrnode.prototype.fetch = function (depth) {
  var node = this;
  if (typeof(depth) == 'undefined') depth = 1;
  var promise = jQuery.Deferred();
  if (node.fetched) {
    setTimeout(function() { promise.resolve(node); }, 0);
  } else {
    jcrutil.getnode(node.workspace, node.path, depth).done(function (data, textStatus, jqxhr) {
      node.load(data);
      promise.resolve(node);
    });
  }
  return promise;
}

jcrnode.prototype.load = function (data) {
  var node = this;
  if (typeof(data) != "undefined" && !jQuery.isEmptyObject(data)) {
    jQuery.extend(true, node, data);
    node.cleanup();
  }
  node.fetched = typeof(node.properties) != "undefined";
  node.childrenfetched = typeof(node.nodes) != "undefined";
}

jcrnode.prototype.cleanup = function() {
  var node = this;
  // create a 'prophash' for easier access
  node.prophash = {};
  for (var i = 0; i < node.properties.length; i++) {
    var prop = node.properties[i];
    var vals = prop.values;
    if (!prop.multiple) vals = vals[0];
    node.prophash[prop.name] = vals;
  }
  // create a 'nodehash' for easier access
  // also convert node data to jcrnode objects
  node.nodehash = {};
  for (var i = 0; node.nodes && i < node.nodes.length; i++) {
    var data = node.nodes[i];
    node.nodes[i] = new jcrnode(node.workspace, data.path, data);
    node.nodehash[data.name] = node.nodes[i];
  }
}

jcrnode.prototype.hasParent = function () {
  var node = this;
  return node.path.split('/').length > 2;
}

jcrnode.prototype.getParent = function () {
  var node = this;
  var path = node.path.split('/');
  path.pop();
  var parentpath = path.join('/');
  if (!parentpath) return undefined;
  return new jcrnode(node.workspace, parentpath);
}

jcrnode.prototype.getChild = function(name) {
  var node = this;
  return new jcrnode(node.workspace, node.path+'/'+name);
}

jcrnode.prototype.fetchParent = function (depth = 1) {
  var node = this;
  return node.getParent().fetch(depth);
}

// this is only safe if you KNOW you have pre-fetched to the correct depth
// otherwise it can return [] when it just needs to fetch first
// if you are unsure whether they need fetching, use jcrnode.fetchChildren()
jcrnode.prototype.getChildren = function () {
  var node = this;
  return node.nodes || [];
}

jcrnode.prototype.fetchChildren = function () {
  var node = this;
  var promise = jQuery.Deferred();
  if (node.childrenfetched) {
    setTimeout(function() { promise.resolve(node.getFetchedChildren()); }, 0);
  } else {
    node.fetch().done(function() { promise.resolve(node.getFetchedChildren()); });
  }
  return promise;
}

jcrnode.prototype.getPage = function () {

}

jcrnode.prototype.getAncestorsBottomUp = function () {
  var node = this;
	var ancestors = [];
	var ancestor = node;
	while (ancestor.hasParent()) {
	  ancestor = ancestor.getParent();
	  ancestors.push(ancestor);
	}
	return ancestors;
}

// Inheritance List is node + ancestors in bottom-up order, so you can just
// loop until you find a value and then break
// will always return jcrnode objects when appropriate, but they
// will be unfetched
jcrnode.prototype.getInheritanceList = function () {
  var node = this;
	return [node].concat(node.getAncestorsBottomUp());
}

// Inheritance List is node + ancestors in bottom-up order, so you can just
// loop until you find a value and then break
// return ancestors after they have all been fetched to the specified depth
jcrnode.prototype.fetchInheritanceList = function (depth) {
  var node = this;
  var inheritancelist = node.getInheritanceList();
  var promise = jQuery.Deferred();
  jQuery.when.apply(jQuery, inheritancelist.map(function (n) { return n.fetch(depth); })).done(function () {
    promise.resolve(inheritancelist);
  });
  return promise;
}

jcrnode.prototype.nodeTitle = function () {
  var node = this;
  if (node.prophash.title) return node.prophash.title;
  var words = node.name.split(/\W+/);
  for (var i = 0; i < words.length; i++) words[i] = words[i].charAt(0).toUpperCase()+words[i].slice(1);
  return words.join(" ");
}

jcrnode.prototype.getPropertyValues = function () {
  var node = this;
  var ret = [];
  for (var i = 0; node.properties && i < node.properties.length; i++) {
    ret.push(node.properties[i].values[0]);
  }
  return ret;
}

jcrnode.prototype.clearProperties = function () {
  var node = this;
  node.properties = [];
  node.prophash = {};
}

jcrnode.prototype.clearNodes = function () {
  var node = this;
  node.nodes = [];
  node.nodehash = {};
}

jcrnode.prototype.setProperty = function(key, vals, type) {
  var node = this;
  if (!type) type = 'String';
  var multiple = false;
  var ensurearrayvals = vals;
  if (typeof(ensurearrayvals) != 'ARRAY') ensurearrayvals = [vals];
  else multiple = true;
  if (typeof(node.prophash[key]) != 'undefined') {
    for (var i = 0; i < node.properties.length; i++) {
      var prop = node.properties[i];
      if (prop.name == key) {
        prop.type = type;
        prop.values = ensurearrayvals;
        prop.multiple = multiple;
      }
    }
  } else {
    node.properties.push({
      name: key,
      type: type,
      values: ensurearrayvals,
      multiple: multiple
    });
  }
  node.prophash[key] = vals;
}

jcrnode.prototype.addProperty = function(vals, type) {
  var node = this;
  var key = 0;
  while (typeof(node.prophash[key]) != 'undefined') key++;
  return node.setProperty(key, vals, type);
}

jcrnode.prototype.addNode = function(name, template = 'mgnl:area') {
  var node = this;
  if (!name) {
    name = 0;
    while (typeof(node.nodehash[name]) != 'undefined') name++;
  }
  var newnode = new jcrnode();
  newnode.workspace = node.workspace;
  newnode.name = name;
  newnode.path = node.path+'/'+name;
  newnode.type = template;
  node.nodes.push(newnode);
  node.nodehash[name] = newnode;
  return newnode;
}

jcrnode.prototype.addChild = function(child) {
  var node = this;
  child.workspace = node.workspace;
  child.path = node.path+'/'+child.name;
  node.nodes.push(child);
  node.nodehash[name] = child;
  return child;
}

jcrnode.prototype.json = function() {
  var node = this;
  return JSON.stringify(node, function (key, val) {
    if (key == 'prophash' || key == 'nodehash' || key == 'fetched' || key == 'childrenfetched') return undefined;
    return val;
  });
}
