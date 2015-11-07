// require jQuery and momentjs
(function ($) {

$.fn.protectedpicker = function(opts) {
	var picker = $(this);
	var selectedgroups = [];
	opts.database = [];

	var addgroup = function(groupinfo) {
		removegroup(groupinfo);
		selectedgroups.push(groupinfo);
	};

	var removegroup = function(groupinfo) {
		var ret = [];
		$.each(selectedgroups, function(i, g) {
			if (g.key != groupinfo.key) ret.push(g);
		});
		selectedgroups = ret;
	};

	var drawselectedgroups = function () {
		var content = picker.find('.protected-to-content');
		content.html("");
		picker.find('.protected-from input[type="checkbox"]').prop("checked", false);
		selectedgroups.sort(function (a, b) {
			return (a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
		});
		opts.groupnode.clearProperties();
		$.each(selectedgroups, function(i, g) {
			var div = $("<div class='protected-group'>"+g.name+"</div>");
			var a = $("<a class='protected-remove icon-trash' data-value='"+g.key+"' title='Remove "+g.name+"' aria-label='Remove "+g.name+"' href='#'></a>");
			a.click(function(e) {
				removegroup({
					key: a.attr("data-value"),
					name: a.text()
				});
				drawselectedgroups();
				e.preventDefault();
			});
			div.append(a);
			content.append(div);
			picker.find('.protected-from input[value="'+g.key+'"]').prop("checked", true);
			opts.groupnode.addProperty(g.key);
		});
		opts.input.val(JSON.stringify(opts.groupnode)).change();
	};

	var initializeform = function () {
		// make our database more useful
		var dbhash = {};
		$.each(opts.database, function (i, g) {
			dbhash[g.value] = g.label;
		});

		// add the prefill into selectedgroups
		$.each(opts.groupnode.getPropertyValues(), function (i, key) {
			var cbox = picker.find('.protected-from input[value="'+key+'"]');
			if (cbox.length) {
				selectedgroups.push({key: cbox.val(), name: cbox.next('label').text()});
			} else {
				var name = dbhash[key];
				if (name) selectedgroups.push({key: key, name: name});
			}
		});
		drawselectedgroups();
	}

	if (!opts.database.length) {
		$.ajax("https://secure.its.txstate.edu/iphone/gatogroups.pl?jsonp=protectedpickerrequest", {
			dataType: "jsonp",
			jsonp: false,
			jsonpCallback: "protectedpickerrequest",
			success: function (data, status, xhr) {
				$.each(data, function (i, obj) {
					opts.database.push({label: obj.name, value: obj.code});
				});
				initializeform();
			},
			error: function (xhr, status, error) {
				console.log(error);
			}
		});
	} else {
		initializeform();
	}

	picker.find('.protected-from input[type="checkbox"]').change(function () {
		var ipt = $(this);
		var groupinfo = {
				key: ipt.val(),
				name: ipt.next('label').text()
		};
		if (ipt.is(':checked')) {
			addgroup(groupinfo);
			drawselectedgroups();
		} else {
			removegroup(groupinfo);
			drawselectedgroups();
		}
	});

	picker.find('.protected-autofill input').autocomplete({
		source: function (request, responsefunction) {
			var ret = [];
			var term = request.term.toLowerCase();
			$.each(opts.database, function (i, obj) {
				// every group value begins with "txstate.ldap.gatogroup." so let's not search on that
				var value = obj.value.substring(23);
				if (obj.label.toLowerCase().indexOf(term) > -1 || value.toLowerCase().indexOf(term) > -1) ret.push(obj);
			});
			responsefunction(ret);
		},
		select: function (e, ui) {
			e.preventDefault();
			addgroup({
				key: ui.item.value,
				name: ui.item.label
			});
			drawselectedgroups();
			$(e.target).val('').blur();
		}
	});
};

})(jQuery);

jcrnode.prototype.protectedgroups = function () {
  var page = this;
  var ret = [];
  if (page.nodehash.protectedpagegroups) {
    for (var i = 0; i < page.nodehash.protectedpagegroups.properties.length; i++) {
      var prop = page.nodehash.protectedpagegroups.properties[i];
      ret.push(prop.values[0]);
    }
  }
  return ret;
}

function initprotectedpages(def, path, parentdiv, templateId) {
  var mynode = new jcrnode("website", path);
	mynode.fetchInheritanceList(1).done(function (list) {
    parentdiv = jQuery(parentdiv);
    var hidden = parentdiv.closest('.v-form-field-container').find('input.protectedpagegroups');
    var startval = hidden.val();
    var groupnode = new jcrnode("website", path+'/protectedpagegroups', jQuery.parseJSON(startval));
    var inheritedpage;
    for (var i = 0; i < list.length; i++) {
      var page = list[i];
      var groups = page.protectedgroups();
      if (groups.length > 0 && i > 0) { // inheritedpage should never be == mynode
        inheritedpage = page;
        break;
      }
    }
    var html = '';
    if (inheritedpage) {
      html += '<div class="inheritancemsg">';
      if (mynode.protectedgroups().length == 0)  {
        html += '<p>This page is already protected by being a subpage of '
        +inheritedpage.nodeTitle()+' &lt;'+inheritedpage.path+'&gt;</p>'
        +'<p>If you choose groups here, they will be used instead of the '
        +'inherited protection.</p>';
      } else {
        html += '<p>Currently overriding protection settings from page: '
        +inheritedpage.nodeTitle()+' &lt;'+inheritedpage.path+'&gt;</p>'
        +'<p>If you remove all groups here, this page would inherit '
        +'protection from that page.</p>';
      }
      html += '</div>';
    }
    html += '<div class="protected-picker">'+
            '  <div class="protected-from">'+
            '    <div class="protected-anynetid">'+
            '      <input type="checkbox" id="pp-anynetid" name="ignore" class="" value="txstate.ldap.txstateuser"/>'+
            '      <label for="pp-anynetid">Any NetID</label>'+
            '    </div>'+
            '    <div class="protected-faculty">'+
            '      <input type="checkbox" id="pp-faculty" name="ignore" class="" value="txstate.affiliation.faculty"/>'+
            '      <label for="pp-faculty">Faculty</label>'+
            '    </div>'+
            '    <div class="protected-staff">'+
            '      <input type="checkbox" id="pp-staff" name="ignore" class="" value="txstate.affiliation.staff"/>'+
            '      <label for="pp-staff">Staff</label>'+
            '    </div>'+
            '    <div class="protected-students">'+
            '      <input type="checkbox" id="pp-students" name="ignore" class="" value="txstate.affiliation.student"/>'+
            '      <label for="pp-students">Students</label>'+
            '    </div>'+
            '  </div>'+
            '  <div class="protected-to">'+
            '    <div class="protected-header">'+
            '      Access granted to all of the following:'+
            '    </div>'+
            '    <div class="protected-to-content">'+
            '      <jsp:text/>'+
            '    </div>'+
            '    <div class="protected-autofill">'+
            '      <input type="search" class="v-textfield v-widget v-form-field v-textfield-v-form-field v-has-width" id="pp-autofill" name="pp-autofill" placeholder="Find/Add Group..."/>'+
            '    </div>'+
            '  </div>'+
            '</div>';
    parentdiv.append(html);
    parentdiv.find('.protected-picker').protectedpicker({
      input: hidden,
      groupnode: groupnode
    });
  });
}
