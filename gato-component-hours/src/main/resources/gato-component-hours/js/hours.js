jQuery(document).ready(function ($) {
	$('.hours-full').click(function(e) {
	  if ($('#hours-container').size() == 0) {
	    $('body').append('<div class="hours-modal"><div id="hours-container">');
	    $('.hours-modal').click(function () {
        $('.hours-modal').hide();
	    });
	  } else {
	    $('.hours-modal').show();
	  }
	  var lnk = $(this);
	  $('#hours-container').fullCalendar({
	    events: lnk.data('hours'),
	    defaultView: 'agendaDay',
	    height: $('#hours-container').height(),
	    scrollTime: '07:00'
	  });
		e.preventDefault();
	});
});
