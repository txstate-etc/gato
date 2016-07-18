jQuery(document).ready(function ($) {
  $('.hours-full').click(function(e) {
    if ($('#hours-container').size() == 0) {
      $('body').append('<div class="hours-modal"><div id="hours-container">');
      $('.hours-modal').click(function (e) {
        if (!$(e.target).is('.fc-button, .fc-button *'))
          $('.hours-modal').hide();
      });
    } else {
      $('.hours-modal').show();
    }
    var lnk = $(this);
    $('#hours-container').fullCalendar({
      events: gato_hours_data[lnk.data('calendarid')]['fullcalendar_data'],
      defaultView: 'agendaDay',
      height: $('#hours-container').height(),
      scrollTime: '07:00'
    });
    e.preventDefault();
  });
});
