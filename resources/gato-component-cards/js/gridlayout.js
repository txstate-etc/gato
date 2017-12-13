jQuery(function($) {


	var filterable_grid = function(element){
		var filterable_grid = this;
		var gridid = element.id;
		var filters = [];
		var $section = $(element).closest('.section-grid, .section-masonry');

		var init_filters = function(){
			// Get the current selected filter from the hash parameter
			var activetab = getHashParameters()[gridid+"_f"];

			// Loop through the filters at the top and store their details in the filters variable
			$(element).prev('ul.gato-card-filter').find('>li>a').each(function(i,filterlink){
				filters.push({
					linkelement : filterlink,
					name : $(filterlink).text(),
					selected : $(filterlink).text() == activetab ? true : false
				});
				$(filterlink).on('click',handle_filterlink_click);
			});

			// If none of the filters was chosen as selected, mark the first as selected as a default.
			if ( filters.filter(function(f){return f.selected}).length == 0 ) {
				filters[0].selected = true;
			}

		};

		var handle_filterlink_click = function(e){
			e.stopPropagation();
			e.preventDefault();

			$.each(filters,function(i,filter){
				filter.selected = $(e.target).text() == filter.name ? true : false;
			});

			filterable_grid.update();

			return false;
		};

		filterable_grid.update = function(){
			var currentFilter;

			$.each(filters,function(i,filter){
				if ( filter.selected ) {
					$(filter.linkelement).attr('aria-selected',true);
					$(filter.linkelement).addClass('grid-filter-selected');
					currentFilter = filter.name;
				} else {
					$(filter.linkelement).attr('aria-selected',false);
					$(filter.linkelement).removeClass('grid-filter-selected');
				}
			});

			var hashParams = getHashParameters();
			hashParams[gridid+"_f"] = currentFilter;
			setHashParameters(hashParams);

			var changed = false;
			var appeared = [];
			$(element).find('div.gato-card[data-tags]:not([data-tags=""])').each(function(i,card){
				var tags = $(card).data("tags").toLowerCase().split(/ *, */);
				var $card = $(card);
				if ( tags.indexOf(currentFilter.toLowerCase()) != -1 || currentFilter == "All" ) {
					if ($card.hasClass('gato-card-hidden')) {
						appeared.push(card);
						changed = true;
					}
					$card.removeClass('gato-card-hidden');
					$card.attr('aria-hidden',false);
				} else {
					if (!$card.hasClass('gato-card-hidden')) changed = true;
					$card.addClass('gato-card-hidden');
					$card.attr('aria-hidden',true);
				}
			});
			if (changed) {
				// resetting previously invisible cards to 0,0 makes for a better animation when it appears, but we don't
				// actually hide in edit mode so avoid doing the animation
				if ($('body.admin').length == 0) $(appeared).css({'left':0, 'top':0, 'transform': 'none'});


				if ($section.is('.section-masonry')) $section.masonry('layout');
				else {
					$section.find('.gato-card:visible').removeClass('halves-edge thirds-edge fourths-edge').each(function (idx) {
						var card = $(this);
						if (idx % 2 == 1) card.addClass('halves-edge');
						if (idx % 3 == 2) card.addClass('thirds-edge');
						if (idx % 4 == 3) card.addClass('fourths-edge');
					});
					gatogridlayout($section);
				}
				$(window).trigger('resize'); // allow any resize handlers to re-layout the page
			}
		};


		init_filters();
		filterable_grid.update();
		return filterable_grid;
	};











	$('.section-grid, .section-masonry').each(function(i,grid){
		if ( $(grid).prev('ul.gato-card-filter').length ) {
			new filterable_grid(grid);
		}
	});

});
