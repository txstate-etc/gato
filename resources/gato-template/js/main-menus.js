function ddmenu_hideall() {
	if (typeof ddmenu_hideall.dd_divs == 'undefined') {
		ddmenu_hideall.dd_divs = new Array();
		$$('div.ddmenu-menubaritem').each( function(item) {
			ddmenu_hideall.dd_divs.push(item);
		});
	}
	var mydivs = ddmenu_hideall.dd_divs;
	var len = mydivs.length;
	for (i = 0; i < len; i++) {
		hidemenu(mydivs[i]);
	}
}

function showmenu(bar) {
	if (!bar.dd_shown) {
		ddmenu_hideall();
		bar.addClassName('ddmenu-visible');
		bar.dd_shown = true;
	}
}

function hidemenu(bar) {
	if (bar.dd_shown) {
		bar.removeClassName('ddmenu-visible');
		bar.dd_shown = false;
	}
}

function ddmenu_over(bar) {
	if (bar && bar.dd_timer) clearTimeout(bar.dd_timer);
	if (bar && !bar.dd_shown) bar.dd_timer = setTimeout("showmenu($('"+bar.id+"'))", 100);
}

function ddmenu_out(bar) {
	if (bar && bar.dd_timer) clearTimeout(bar.dd_timer);
	if (bar && bar.dd_shown) bar.dd_timer = setTimeout("hidemenu($('"+bar.id+"'))", 250);
}

Event.observe(document, 'dom:loaded', function (event) {
	var count = 0;
	$$('div.ddmenu-menubaritem').each( function (item) {
		item.id = 'ddmenu-'+count;
		count++;

		var menuwrap = item.down('.ddmenu-menu');
		item.observe('touchstart', function (event) {
			if (!item.dd_shown && menuwrap) {
				showmenu(item);
				event.stop();
			}
		});
		var menubg = item.up(1);
		if (menubg) {
			menubg.observe('touchstart', function(event) {
				if (!item.nohide) hidemenu(item);
			});
		}
		if (menuwrap) {
			menuwrap.observe('touchstart', function(event) {
				item.nohide = true;
			});
			menuwrap.observe('touchend', function(event) {
				item.nohide = false;
			});
		}
		item.observe('mouseover', function (event) {
			ddmenu_over(this);
			event.stop();
		});
		item.observe('mouseout', function (event) {
			ddmenu_out(this);
			event.stop();
		});
	});
	// add support for tabbing through links with the keyboard
	$$('.ddmenu-menubaritem a').each(function(item) {
		item.observe('focus', function (event) {
			ddmenu_over(this.up('div.ddmenu-menubaritem'));
			event.stop();
		});
		item.observe('blur', function (event) {
			ddmenu_out(this.up('div.ddmenu-menubaritem'));
			event.stop();
		});
	});
});

Event.observe(window, 'load', function (event) {
	$$('div.ddmenu-menubaritem').each( function (item) {
		if (item.down('img')) item.down('img').setStyle({width: item.down('img').getWidth()+'px'});
	});
});
