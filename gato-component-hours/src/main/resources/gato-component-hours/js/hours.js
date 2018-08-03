jQuery(document).ready(function ($) {

  var show_modal = function () {
    if ($('#hours-container').size() == 0) {
      $('body').append('<div class="hours-modal"><div id="hours-container">');
      $('.hours-modal').click(function (e) {
        if (!$(e.target).is('.fc-button, .fc-button *'))
          hide_modal();
      });
    } else {
      $('.hours-modal').show();
    }
    $('body > *').each( function () {
      if (!$(this).is('.hours-modal')) {
        this.modal_disabled = true;
        this.save_aria_disable = $(this).attr('aria-disabled');
        $(this).attr('aria-disabled', 'true');
      }
    });
    return $('#hours-container');
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

  $('.gato-component-hours').each(function () {
    var hours = $(this);
    var linkfull = hours.find('a.full');
    var calendarId = linkfull.data('calendarid');
    var data = gato_hours_data[calendarId];

    if (!data.currently_open)
      hours.find('.fa-clock-o').addClass('closed');

    linkfull.click(function(e) {
      var modalcontainer = show_modal();
      var dview = 'month';
      var rviews = 'month,basicWeek,basicDay';

      if($( window ).width() < 769) {
        dview = 'basicDay';
        rviews = 'basicDay';
      }
      modalcontainer.fullCalendar({
        events: data['fullcalendar_data'],
        defaultView: dview,
        height: modalcontainer.height(),
        displayEventEnd: true,
        header: {
          left: 'prev,next today',
          center: 'title',
          right: rviews
        },
        eventAfterAllRender: function(){
          $(".canceled .fc-content").html('Closed');
          if (linkfull.attr('href').length) {
            var otherlink = $('<a href=""><button id="all_hours" type="button" class=" fc-button fc-state-default fc-corner-left fc-corner-right mybutton "> Other Hours</button></a>');
            otherlink.attr('href', linkfull.attr('href'));
            $('.fc-today-button').after(otherlink);
          }
          if (data.pdf_link.length) {
            var pdflink = $(' <a href=""><button  type="button" class=" fc-button fc-state-default fc-corner-left fc-corner-right mybutton "> <i class="fa fa-file-pdf-o" aria-hidden="true"></i> PDF </button></a>');
            pdflink.attr('href', data.pdf_link);
            $('.fc-today-button').after(pdflink);
          }
        }
      });
      e.preventDefault();
    });
  });
});
