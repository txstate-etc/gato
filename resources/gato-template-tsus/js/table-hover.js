document.observe('dom:loaded', function() {
	$$('.txst-contentarea table.data td').each(function(itm) {
		var c = $(document.createElement('div'));
		c.innerHTML = itm.innerHTML;
		itm.innerHTML = '';
		itm.appendChild(c);
			
		c.observe('mouseover', function(e) {
			this.addClassName('table-hover');
		});
		c.observe('mouseout', function(e) {
			this.removeClassName('table-hover');
		});
	});
});