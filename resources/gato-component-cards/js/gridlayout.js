jQuery(function() {
	var $ = jQuery;




	var filterable_grid = function(element){
		var gridid = element.id;

		var activetab = getHashParameters()[gridid+"_f"];
		var filters = [];

		$(element).find('ul.grid-filter>li>a').each(function(i,filtertab){
			filters.push({
				linkelement : filtertab,
				name : $(filtertab).text(),
				selected : $(filtertab).text() == activetab ? true : false
			});
		});

		if ( filters.filter(function(f){return f.selected}).length == 0 ) {
			filters[0].selected = true;
		}

		console.log(filters);


		return this;
	};











	$('.grid-container').each(function(i,grid){
		if ( $(grid).find('ul.grid-filter').length ) {
			new filterable_grid(grid);
		}
	});

});
