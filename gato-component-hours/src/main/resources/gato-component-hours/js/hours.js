jQuery(document).ready(function ($) {
  var show_modal = function () {
    $('.hours-modal').show();
    $('body > *').each( function () {
      if (!$(this).is('.hours-modal')) {
        this.modal_disabled = true;
        this.save_aria_disable = $(this).attr('aria-disabled');
        $(this).attr('aria-disabled', 'true');
      }
    });
  };

  var hide_modal = function () {
    $('.hours-modal').hide();
    // undo what we did to aria-disabled on show()
    $('body > *').each( function () {
      if (!$(this).is('.hours-modal')) {
        if (this.modal_disabled) $(this).attr('aria-disabled', this.save_aria_disable);
        this.modal_disabled = false;
      }
    });
  };

  $('.hours-full').click(function(e) {
    if ($('#hours-container').size() == 0) {
      $('body').append('<div class="hours-modal"><div id="hours-container">');
      $('.hours-modal').click(function (e) {
        if (!$(e.target).is('.fc-button, .fc-button *')) hide_modal();
      });
    } else {
      show_modal();
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
