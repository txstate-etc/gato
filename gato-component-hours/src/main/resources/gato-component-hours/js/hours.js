jQuery(document).ready(function ($) {
  var modal_shown = false;
  var show_modal = function () {
    modal_shown = true;
    if ($('#hours-container').size() == 0) {
      $('body').append(
        '<div class="hours-modal" role="dialog" aria-modal="true" aria-label="hours of operation" aria-description="modal presentation of hours of operation information">' +
          '<div tabindex="0" class="hours-focusstart sr-only"></div>' +
          '<div id="hours-container">' +
            '<button class="hours-close"><i class="fa fa-close"><span class="sr-only">Close Hours Modal</span></i></button>' +
            '<div class="hours-content"></div>' +
          '</div>' +
          '<div tabindex="0" class="hours-focusend sr-only"></div>' +
        '</div>'
      );
      $('.hours-modal .hours-close').click(function (e) {
        hide_modal();
      });
      var hourscontainer = $('#hours-container');
      hourscontainer.focusout(function (e) {
        var tabbable = hourscontainer.find(':tabbable');
        var first = tabbable.first();
        var last = tabbable.last();
        var targ = $(e.relatedTarget);
        if (modal_shown) {
          if (targ.is('.hours-focusstart')) {
            last.focus();
          } else if (targ.is('.hours-focusend')) {
            first.focus();
          }
        }
      })
      hourscontainer.keydown(function (e) {
        if ((e.key === 'Escape' || e.key ==='Esc') && modal_shown) {
          hide_modal();
          e.preventDefault();
          e.stopPropagation();
        }
      })
      $(window).click(function (e) {
        if ($(e.target).closest('#hours-container').size() === 0) hide_modal();
      })
    } else {
      $('.hours-modal').show();
    }
    return $('#hours-container .hours-content');
  };

  var hide_modal = function () {
    modal_shown = false;
    $('.hours-modal').hide();
  };

  var friendlyTime = function (dt) {
    if (dt.minute() > 0) return dt.format('h:mma');
    return dt.format('ha');
  }

  var isSameTime = function (a, b) {
    return Math.abs(a.diff(b || 2, 'minutes')) < 5;
  }

  var padNumber = function (str, targetLength, padString) {
    targetLength = targetLength || 2
    padString = padString || 0
    str = String(str);
    targetLength = targetLength >> 0; //truncate if number, or convert non-number to 0;
    padString = String(typeof padString !== 'undefined' ? padString : ' ');
    if (str.length >= targetLength) {
      return String(str);
    } else {
      targetLength = targetLength - str.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
      }
      return padString.slice(0, targetLength) + String(str);
    }
  }

  $('.gato-component-hours').each(function () {
    var hours = $(this);
    var linkfull = hours.find('a.full');
    var calendarId = linkfull.data('calendarid');
    var data = gato_hours_data[calendarId];

    if (!data.currently_open)
      hours.find('.fa-clock-o').addClass('closed');

    linkfull.click(function(e) {
      e.stopPropagation();
      e.preventDefault();
      var modalcontainer = show_modal();
      modalcontainer.empty();

      var headercontainer = $('<div class="hours-header-container">');
      var firstgooddata = (data.fullcalendar_data || []).find(function(entry) { return !entry.canceled }) || { title: 'Hours' }
      headercontainer.append('<h2>' + (data.title || firstgooddata.title) + '</h2>');

      var pdflink = $('<button class="hours-pdf"> <i class="fa fa-print" aria-hidden="true"></i> Print</button>');
      pdflink.click(function () { openPrintableView(data) })
      headercontainer.append(pdflink);
      modalcontainer.append(headercontainer);

      var now = moment();
      var chartdata = getChartData(data, now);

      var startedprinting = false;
      var months = Object.keys(chartdata);
      var html = '';
      for (var i = 0; i < months.length; i++) {
        var month = chartdata[months[i]];
        var headerid = 'hours-header-' + months[i];
        var regionid = 'hours-region-' + months[i];
        html += '<h3 class="hours-header'+(i ? '' : ' hours-shown')+'">'+
          '<button id="'+headerid+'" aria-controls="'+regionid+'" aria-expanded="'+(i ? 'false' : 'true')+'">' + month.name +
          '<i class="fa fa-angle-down" aria-hidden="true"></i>'+
        '</button></h3>'+
        '<ul id="'+regionid+'" class="hours-month'+(i ? '' : ' hours-shown')+'" role="region" aria-labelledby="'+headerid+'">';

        for (var j = 1; j < month.days.length; j++) {
          var day = month.days[j];
          var yesterday = j === 1 ? (i === 0 ? undefined : chartdata[months[i-1]].days.slice(-1)[0]) : month.days[j-1]
          var tomorrow = j === month.days.length - 1 ? (i === months.length - 1 ? undefined : chartdata[months[i+1]].days[1]) : month.days[j+1]
          if (day && day.open.length || j >= now.date() || startedprinting) {
            startedprinting = true;
            html += getLine(months[i], month, j, day, yesterday, tomorrow, now);
          }
        }
        html += '</ul>';
      }
      modalcontainer.append(html);
      modalcontainer.find('.hours-header button').first().focus();
      modalcontainer.find('.hours-header button').click(function (e) {
        var header = $(this);
        var list = header.closest('.hours-header').next('.hours-month');
        var expanding = header.attr('aria-expanded') !== 'true'
        modalcontainer.find('.hours-header').removeClass('hours-shown');
        modalcontainer.find('.hours-header button').attr('aria-expanded', false);
        modalcontainer.find('.hours-month').removeClass('hours-shown');
        if (expanding) {
          header.attr('aria-expanded', true);
          list.addClass('hours-shown');
          header.closest('.hours-header').addClass('hours-shown');
        }
      });
    });
  });
  function openPrintableView (data) {
    var printWin = window.open('', 'hoursprintwin', 'width=800,height=1000');
    printWin.document.head.innerHTML = '<title>Printable Hours - ' + data.title + '</title><style>' + getPrintableCss() + '</style>';
    printWin.document.body.innerHTML = getPrintableHTML(data);
    printWin.focus();
    printWin.print();
  }
  function getPrintableCss () {
    return `
    html {
      font-size: 7px;
    }
    body {
      font-size: 1.6rem;
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      border: 0;
      font-size: 1.6rem;
    }
    h1 {
      margin: 0;
      font-size: 3rem;
      padding-bottom: 0.7rem;
      text-align: center;
    }
    @media print {
      .page-container { page-break-after: always; }
    }
    .page-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      align-items: flex-start;
    }
    .hours-container {
      width: 30%;
    }
    .hours-header {
      font-size: 2.2rem;
      padding-bottom: 1rem;
      margin: 0;
    }
    .hours-month {
      padding: 0;
      margin: 0 0 2rem 0;
      transition: height 0.3s;
      overflow: hidden;
    }
    .hours-day {
      display: flex;
      align-items: stretch;
      border-top: 1px solid #d1d1d1;
      border-left: 1px solid #d1d1d1;
      border-right: 1px solid #d1d1d1;
    }
    .hours-day:last-child {
      border-bottom: 1px solid #d1d1d1;
    }
    .hours-day:nth-child(2n) {
      background-color: #f1f1f1;
    }
    .hours-date-container {
      display: block;
      position: relative;
      border-right: 1px solid #d1d1d1;
      background-color: white;
      color: black;
      margin-right: 0.5rem;
      width: 4rem;
      min-height: 4rem;
    }
    .hours-date {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .hours-dow, .hours-number {
      display: block;
      line-height: 1.1;
      text-align: center;
    }
    .hours-number {
      font-size: 2rem;
    }
    .hours-dow {
      font-size: 1.3rem;
    }
    .hours-description {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: 1.4;
      padding: 0 0.8rem;
    }
    .hours-interval {
      display: block;
    }
    `;
  }
  function getPrintableHTML (data) {
    var now = moment();
    var chartdata = getChartData(data, now);

    var startedprinting = false;
    var months = Object.keys(chartdata);
    var firstgooddata = (data.fullcalendar_data || []).find(function(entry) { return !entry.canceled }) || {};
    var title = data.title || firstgooddata.title;

    var html = '';
    if (title) html += '<h1>'+(title)+'</h1>';
    html += '<div class="page-container">';
    for (var i = 0; i < months.length; i++) {
      if (i !== 0 && i % 3 === 0) {
        html += '</div>';
        if (title) html += '<h1>'+(title)+'</h1>';
        html += '<div class="page-container">';
      }
      var month = chartdata[months[i]];
      var headerid = 'hours-header-' + months[i];
      html += '<div class="hours-container"><h2 class="hours-header" id="'+headerid+'">'+month.name+'</h3>' +
      '<ul class="hours-month" role="region" aria-labelledby="'+headerid+'">';

      for (var j = 1; j < month.days.length; j++) {
        var day = month.days[j];
        var yesterday = j === 1 ? (i === 0 ? undefined : chartdata[months[i-1]].days.slice(-1)[0]) : month.days[j-1]
        var tomorrow = j === month.days.length - 1 ? (i === months.length - 1 ? undefined : chartdata[months[i+1]].days[1]) : month.days[j+1]
        if (day && day.open.length || j >= now.date() || startedprinting) {
          startedprinting = true;
          html += getLine(months[i], month, j, day, yesterday, tomorrow, now);
        }
      }
      html += '</ul></div>';
    }
    return html + '</div>';
  }
  function getChartData (data, now) {
    var chartdata = {};
    for (var i = 0; i < data.fullcalendar_data.length; i++) {
      var entry = data.fullcalendar_data[i];
      if (entry.end.isBefore(now)) continue;
      var month = entry.start.format('YYYYMM');
      var day = parseInt(entry.start.format('D'));
      if (!chartdata[month]) chartdata[month] = { name: entry.start.format('MMMM YYYY'), shortname: entry.start.format('MMMM'), days: [] };
      if (!chartdata[month].days[day]) chartdata[month].days[day] = { label: day, open: [] };
      chartdata[month].days[day].open.push({ canceled: entry.canceled, start: entry.start, end: entry.end });
    }
    return chartdata;
  }
  function getLine (monthKey, month, j, day, yesterday, tomorrow, now) {
    var dow = moment(monthKey+padNumber(j)+'120000', 'YYYYMMDDHHmmss');
    var line = '<li class="hours-day">'+
      '<span class="hours-date-container">'+
        '<span class="hours-date">'+
          '<span class="hours-number">'+
            '<span>' + j + '</span><span class="sr-only"> '+month.shortname+'</span>'+
          '</span>'+
          '<span class="hours-dow">'+
            '<span aria-hidden="true">'+dow.format('ddd')+'</span>'+
            '<span class="sr-only">'+dow.format('dddd')+'</span>'+
          '</span>'+
        '</span>'+
      '</span>'+
      '<span class="hours-description">';
    line += getDescription(day, yesterday, tomorrow, now)
    line += '</span></li>';
    return line;
  }
  function getDescription (day, yesterday, tomorrow, now) {
    var line = '<span class="hours-interval">'
    if (day) {
      for (var k = 0; k < day.open.length; k++) {
        var open = day.open[k].start
        var close = day.open[k].end
        var lastclose = (((yesterday || {}).open || []).slice(-1)[0] || {}).end
        var nextopen = (((tomorrow || {}).open || [])[0] || {}).start
        if (day.open[k].canceled)
          line += 'Closed';
        else if (lastclose && nextopen && (isSameTime(open, lastclose) || open.isBefore(lastclose)) && (isSameTime(close, nextopen) || close.isAfter(nextopen)))
          line += 'Open all day';
        else if (lastclose && isSameTime(open, lastclose) || open.isBefore(now))
          line += 'Closes at ' + friendlyTime(close);
        else if (nextopen && isSameTime(close, nextopen))
          line += 'Opens at ' + friendlyTime(open);
        else
          line += 'Open from ' + friendlyTime(open) + ' to ' + friendlyTime(close);
      }
    }
    else {
      line += 'Closed';
    }
    return line + '</span>';
  }
});
