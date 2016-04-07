document.observe('dom:loaded', function () {
	$$('.search-box-tabs li a').each( function (lnk) {
		lnk.observe('click', function (e) {
			$$('.search-box-tabs > li').each( function (li) {
				li.removeClassName('selected');
			});
			$$('.search-box-content > div').each( function (cont) {
				cont.removeClassName('selected');
			});
			$(lnk.hash.replace(/^#/, '')).addClassName('selected');
			lnk.up('li').addClassName('selected');
			e.stop();
		});
	});
	
	$$('.gato-slideshow .pages').each(function (p) {
		var c = p.up().down('.slidecontent');
		var cw = c.getWidth();
		var w = p.getWidth();
		p.setStyle({left: ((cw-w)/2)+'px'});
	});
});

function limittoFullText(myForm) {
  if (myForm.fulltext_checkbox.checked) myForm.clv0.value = "Y";
  else myForm.clv0.value = "N";
}

function limittoScholarly(myForm) {
  if(myForm.scholarly_checkbox.checked) myForm.clv1.value = "Y";
  else myForm.clv1.value = "N";
}

function ebscoPreProcess(myForm) {
  myForm.bquery.value = myForm.search_prefix.value + myForm.uquery.value;
}

function limittoArticles(myForm) {
  myForm.bquery.value += ' AND ( PT Article OR PT Journal Article OR ZT Magazines OR PT Serial OR PT Trade OR PT Periodical OR ZT Periodical OR PT News OR ZT News OR PT Newspaper OR PT Academic Journal OR PT Journal OR ZT Academic Journal OR PT Conference Materials OR RV Y)';
}

function processReserve(myForm) {
  // send to the appropriate URL based on electronic or print reserve
  if (myForm.reservetype[1].checked) myForm.action = 'https://ereserve.library.txstate.edu/eres/courseindex.aspx?page=search&auto=true';
  else myForm.action = 'http://catalog.library.txstate.edu/search/a?a';
  
  // keep the Course/Instructor selections in sync - we use different parameters for
  // electronic and print
  if (myForm.searchtype.value == 'r') myForm.key.value = 'abbreviation&number';
  else myForm.key.value = 'lastname';
  // same deal with the search argument
  myForm.search.value = myForm.searcharg.value;
}
