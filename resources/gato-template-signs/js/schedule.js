jQuery.noConflict();
jQuery(document).ready(function($) {

    // page is now ready, initialize the calendar...
		var overlapwarning = '<div class="schedule-trim-alert">CAUTION: Schedule Overlap</div>';
    $('.schedule-calendar').fullCalendar({
        // put your options and callbacks here
        allDaySlot: false,
        defaultView: 'agendaWeek',
        timezone: 'America/Chicago',
        header: {
        	left: 'title',
        	center: 'agendaWeek,month',
        	right: 'today prev,next'
        },
        eventClick: function(calEvent, jsEvent, view) {
        	mgnlOpenDialog(calEvent.id, null, null, "gato:signs/schedule-entry", "website", ".magnolia/dialogs/signs/schedule-entry.html");
        },
        viewRender: function(view,element) {
					var now = moment().utc().hour(12);
					var end = now.clone().add(55,'days');
					if ( end < view.end) {
						$(".fc-next-button").addClass("fc-state-disabled");
					} else {
						$(".fc-next-button").removeClass("fc-state-disabled");
					}
					if ( view.start < now) {
						$(".fc-prev-button").addClass("fc-state-disabled");
					} else {
						$(".fc-prev-button").removeClass("fc-state-disabled");
					}
        },
				eventAfterRender: function (event, element, view) {
					var ele = $(element);
					if (ele.is('.schedule-event-trimstart')) {
						ele.prepend($(overlapwarning));
					} else if (ele.is('.schedule-event-trimend')) {
						ele.append($(overlapwarning));
					}
				},
        events: events
    })
});
mgnl.PageEditor.onReady(function () {
	var $ = jQuery;
  // rename the new schedule rule bar
  $('.mgnlEditorPlaceholder.component .mgnlEditorBarLabel').each(function (i, obj) {
  	var lbl = $(obj);
		var txt = lbl.text();
		txt = txt.replace(/\sComponent$/, '');
		lbl.text(txt);
		
		if (lbl.text() == "New Scheduled Sign") lbl.text("Schedule New Sign Content");
	});
});