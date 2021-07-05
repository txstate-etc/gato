jQuery(document).ready(function($) {

	function menushown(bar) {
		return $(bar).hasClass('ddmenu-visible')
	}

	function ddmenu_hideall() {
		$('div.ddmenu-menubaritem').removeClass('ddmenu-visible')
	}

	function showmenu(bar) {
		if (!menushown(bar)) {
			ddmenu_hideall()
			$(bar).addClass('ddmenu-visible')
		}
	}

	function hidemenu(bar) {
		if (menushown(bar)) {
			$(bar).removeClass('ddmenu-visible');
		}
	}

	function ddmenu_over(bar) {
		if (bar && bar.dd_timer) clearTimeout(bar.dd_timer);
		if (bar && !menushown(bar)) {
			bar.dd_timer = setTimeout(function(){
				showmenu(bar)
			}, 100);
		}
	}

	function ddmenu_out(bar) {
		if (bar && bar.dd_timer) clearTimeout(bar.dd_timer)
		if (bar && menushown(bar)) {
			bar.dd_timer = setTimeout(function() {
				hidemenu(bar)
			}, 250)
		}
	}

	var count = 0
	$('div.ddmenu-menubaritem').each(function() {
		var item = $(this)
		item.attr('id', 'ddmenu-'+count)
		count++

		var menuwrap = item.find('.ddmenu-menu')
		item.on('touchstart', function (e) {
			if (!item.hasClass('ddmenu-visible') && menuwrap.length) {
				showmenu(item)
				e.stopPropagation()
			}
		})

		var menubg = item.closest('.ddmenu-bg')
		if (menubg.length) {
			menubg.on('touchstart', function(e) {
				if (!item.data(nohide)) hidemenu(item);
			});
		}

		if (menuwrap.length) {
			menuwrap.on('touchstart', function(e) {
				item.data('nohide', true)
			})
			menuwrap.on('touchend', function(e) {
				item.data('nohide', false)
			})
		}

		item.on('mouseover', function (e) {
			ddmenu_over(this)
			e.stopPropagation()
		});
		item.on('mouseout', function (e) {
			ddmenu_out(this);
			e.stopPropagation()
		});
	})
	
	// add support for tabbing through links with the keyboard
	$('.ddmenu-menubaritem a').each(function() {
		var item = $(this)
		item.on('focus', function(e) {
			ddmenu_over(this.closest('div.ddmenu-menubaritem'))
			e.stopPropagation()
		})
		item.on('blur', function(e) {
			ddmenu_out(this.closest('div.ddmenu-menubaritem'))
			e.stopPropagation()
		})
	})
});