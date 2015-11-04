// require jQuery and momentjs
(function ($) {

$.fn.protectedpicker = function(options) {
	var picker = $(this);
	var selectedgroups = [];
	var defaultopts = {
		assetsurl: 'http://www.txstate.edu/magnoliaAssets',
		inputname: 'permissions',
		prefill: [],
		database: []
	};
	var opts = $.extend(defaultopts, options);

	// ensure we have our libraries
	var cssfile = opts.assetsurl+"/txstate/css/protectedpicker.css";
	$('head:not(:has(link[href~="'+cssfile+'"]))').each(function () {
		$('<link rel="stylesheet" href="'+cssfile+'"/>').appendTo('head');
	});
	var jqueryui = opts.assetsurl+"/common/js/jquery-ui/jquery-ui.min.js";
	$('head:not(:has(script[src~="'+jqueryui+'"]))').each(function () {
		var s = $(document.createElement("script"))
			.attr('type', 'text/javascript')
			.attr('src', jqueryui);
		$('head').append(s);
	});
	var jqueryuicss = opts.assetsurl+"/common/js/jquery-ui/jquery-ui.min.css";
	$('head:not(:has(link[href~="'+jqueryuicss+'"]))').each(function () {
		$('<link rel="stylesheet" href="'+jqueryuicss+'"/>').appendTo('head');
	});

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
		$.each(selectedgroups, function(i, g) {
			var div = $("<div class='protected-group'>"+g.name+"</div>");
			var a = $("<a class='protected-remove' data-value='"+g.key+"' title='Remove "+g.name+"' href='#'><img src='"+opts.assetsurl+"/common/images/trash.png' alt='Remove "+g.name+"'/></a>");
			a.click(function(e) {
				removegroup({
					key: a.attr("data-value"),
					name: a.text()
				});
				drawselectedgroups();
				e.preventDefault();
			});
			div.append(a);
			div.append('<input type="hidden" name="'+opts.inputname+'" value="'+g.key+'"/>');
			content.append(div);

			picker.find('.protected-from input[value="'+g.key+'"]').prop("checked", true);
		});
	};

	var initializeform = function () {
		// make our database more useful
		var dbhash = {};
		$.each(opts.database, function (i, g) {
			dbhash[g.value] = g.label;
		});

		// add the prefill into selectedgroups
		$.each(opts.prefill, function (i, key) {
			var cbox = picker.find('.protected-from input[value="'+key+'"]');
			if (cbox.length) {
				selectedgroups.push({key: cbox.val(), name: cbox.next('label').text()});
			} else {
				var name = dbhash[key];
				if (name) selectedgroups.push({key: key, name: name});
			}
		});
		picker.append('<input type="hidden" name="mgnlSaveInfo" value="'+opts.inputname+',String,1,0,0"/>');

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

function initprotectedpages(def, path, parentdiv) {
	console.log(arguments);
	/*
  <c:if test="${not empty inheritedPage and empty valdefault}">
    <div style="background-color: #cccccc">
    <p>This page is already protected by being a subpage of <a target="_blank" href="${gf:filterUrl(inheritedPage['@path'])}">${ gf:title(inheritedPage) }</a>.</p>
    <p>If you choose groups here, they will be used instead of the inherited protection.</p>
    </div>
  </c:if>
  <c:if test="${not empty inheritedPage and not empty valdefault}">
    <div style="background-color: #cccccc">
    <p>Currently overriding protection settings from page: <a target="_blank" href="${gf:filterUrl(inheritedPage['@path'])}">${ gf:title(inheritedPage) }</a>.</p>
    <p>If you remove all groups here, this page would inherit protection from that page.</p>
    </div>
  </c:if>

  <c:if test="${not protectedgroupsonce}">
    <script type="text/javascript" src="${assetsUrl}/txstate/js/protectedpicker.js"><jsp:text/></script>
    <c:set var="protectedgroupsonce" value="${true}" scope="request"/>
  </c:if>

  <div class="protected-picker" id="${dialogObject.name}-protected-picker">
    <div class="protected-from">
      <div class="protected-anynetid">
        <input type="checkbox" id="${dialogObject.name}-anynetid" name="ignore" class="" value="txstate.ldap.txstateuser"/>
        <label for="${dialogObject.name}-anynetid">Any NetID</label>
      </div>
      <div class="protected-faculty">
        <input type="checkbox" id="${dialogObject.name}-faculty" name="ignore" class="" value="txstate.affiliation.faculty"/>
        <label for="${dialogObject.name}-faculty">Faculty</label>
      </div>
      <div class="protected-staff">
        <input type="checkbox" id="${dialogObject.name}-staff" name="ignore" class="" value="txstate.affiliation.staff"/>
        <label for="${dialogObject.name}-staff">Staff</label>
      </div>
      <div class="protected-students">
        <input type="checkbox" id="${dialogObject.name}-students" name="ignore" class="" value="txstate.affiliation.student"/>
        <label for="${dialogObject.name}-students">Students</label>
      </div>
    </div>
    <div class="protected-to">
      <div class="protected-header mgnlDialogDescription">
        Access granted to all of the following:
      </div>
      <div class="protected-to-content">
        <jsp:text/>
      </div>
      <div class="protected-autofill">
        <input type="search" class="mgnlDialogControlEdit" id="${dialogObject.name}-autofill" name="${dialogObject.name}-autofill" placeholder="Find/Add Group..."/>
      </div>
    </div>
  </div>

  <script type="text/javascript">
    jQuery('#${dialogObject.name}-protected-picker').protectedpicker({
      inputname: "${dialogObject.name}",
      assetsurl: "${assetsUrl}",
      prefill: [
        <c:forEach var="group" items="${gf:propertyValues(valdefault)}" varStatus="loopstatus">
          "${group}"${not loopstatus.last ? ',' : ''}
        </c:forEach>
      ]
    });
  </script>
  */
}
