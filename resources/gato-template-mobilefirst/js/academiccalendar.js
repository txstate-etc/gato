jQuery(document).ready(function($) {

  //make hash: semester -> part of term -> {min date, max date, categories}
  var dropdownData = {}
  $('.event-table .event-data').each(function() {
    var event = $(this)
    var semester = event.data('semester')
    if (!dropdownData[semester]) {
      dropdownData[semester] = {}
    }
    var partsofterm = event.data('partsofterm').split(',')
    var startDate = moment(event.data('startdate'))
    var endDate = moment(event.data('enddate'))
    for (var p of partsofterm) {
      if (!dropdownData[semester][p]) {
        dropdownData[semester][p] = {categories: [], mindate: "", maxdate: ""}
      }
      var categories = event.data('categories').split(',')
      for (var c of categories) {
        if (c.length && dropdownData[semester][p].categories.indexOf(c) == -1) {
          dropdownData[semester][p].categories.push(c)
        }
      }
      if (dropdownData[semester][p].mindate.length == 0 || startDate.isBefore(moment(dropdownData[semester][p].mindate))) {
        dropdownData[semester][p].mindate = event.data('startdate')
      }
      if (dropdownData[semester][p].maxdate.length == 0 || endDate.isAfter(moment(dropdownData[semester][p].maxdate))) {
        dropdownData[semester][p].maxdate = event.data('enddate')
      }
    }
  })

  var manageEventOptions = {
    "Add to my Calendar": "atmc",
    "My Events": "myevents",
    "Email Reminder": "remindemail",
    "Email me Event Updates": "notify",
    "Email to Friends": "forward",
    "all": "all"
  }
  
  var filterState = {
    audience: [],
    semester: '',
    partofterm: '',
    startDate: '',
    endDate: '',
    category: []
  }

  $('#select-audience').acdropdown({
    multiple: true,
    onChange: function(items) {
      handleChangeAudience(items)
    }
  })

  $('#select-semester').acdropdown({
    onChange: function(item) {
      handleChangeSemester(item)
    }
  })
  
  $('#select-partofterm').acdropdown({
    onChange: function(item) {
      handleChangePartOfTerm(item)
    },
    selected: 'Full Term'
  })
  $('#select-category').acdropdown( {
    multiple: true,
    onChange: function(items) {
      handleChangeCategory(items)
    }
  })

  $('#select-download-print').acdropdown( {
    showSelected: false,
    onChange: function(item) {
      if (item == 'Printable Version') {
        openPrintView()
      }
    }
  })

  $('#select-manage-events').acdropdown( {
    showSelected: false,
    onChange: function(item) {
      manageEvent(item)
    }
  })

  $('#select-manage-events').on('click', function() {
    if ($(this).hasClass('expanded')) {
      $(this).velocity({'paddingRight': '4rem'}, {duration: 200})
    } else {
      $(this).velocity({'paddingRight': 0}, {duration: 200})
    }
  })

  var isMobile = function() {
    var isMobile = false;
    if (window.matchMedia) {
      if (window.matchMedia("(max-width: 50em)").matches) {
        isMobile = true;
      }
    }
    else {
      if ($(window).width() < 801) {
        isMobile = true;
      }
    }
    return isMobile;
  }

  var updateDropdowns = function() {
    console.log('updating for ' + filterState.partofterm + ' in ' + filterState.semester)
    var relevantPartsOfTerm = Object.keys(dropdownData[filterState.semester])
    $('#select-semester').data('acdropdown').updateSelectedItem(filterState.semester)
    $('#pot-menu').empty();
    for (var p of relevantPartsOfTerm) {
      $('#select-partofterm').data('acdropdown').addMenuItem(p)
    }
    var relevantCategories = dropdownData[filterState.semester][filterState.partofterm].categories
    $('#category-menu').empty()
    for (var c of relevantCategories) {
      $('#select-category').data('acdropdown').addMenuItem(c)
    }

    var minDate = moment(dropdownData[filterState.semester][filterState.partofterm].mindate).format('YYYY-MM-DD')
    var maxDate = moment(dropdownData[filterState.semester][filterState.partofterm].maxdate).format('YYYY-MM-DD')
    $('#ac-startdate').attr('min', minDate).attr('max', maxDate).val('')
    $('#ac-enddate').attr('min', minDate).attr('max', maxDate).val('')
  }

  var updateResults = function() {
    console.log(filterState)
    var rows = $('.event-table tbody tr')
    rows.removeClass('row-hidden').attr('aria-hidden', false)
    var showEmptyMessage = true
    for (var row of rows) {
      var showEvent = true
      // check if row matches filters. hide it if it doesn't
      var eventData = $(row).find('.event-data')
      var categories = eventData.data('categories').split(',')
      if (eventData.data('semester').indexOf(filterState.semester) < 0) {
        showEvent = false
      } else if (eventData.data('partsofterm').indexOf(filterState.partofterm) < 0) {
        showEvent = false
      }

      // event should be shown if it starts or ends in the selected range
      if (showEvent) {
        var eventStart = moment(eventData.data('startdate'))
        var eventEnd = moment(eventData.data('enddate'))
        if (filterState.startDate && filterState.endDate) {
          // if the event ends before the selected range
          if (eventEnd.isBefore(moment(filterState.startDate))) {
            showEvent = false
          }
          // if the event ends after the selected range
          if (eventStart.isAfter(moment(filterState.endDate).endOf('day'), 'day')) {
            showEvent = false
          }
        } else if (filterState.startDate && !filterState.endDate) {
          // don't show events that end before the selected start date
          if (eventEnd.isBefore(moment(filterState.startDate))) {
            showEvent = false
          }
        } else if (filterState.endDate && !filterState.startDate) {
          // don't show events that start after the selected end date
          if (eventStart.isAfter(moment(filterState.endDate).endOf('day'), 'day')) {
            showEvent = false
          }
        }
      }

      if (showEvent && filterState.category.length > 0) {
        var eventHasCategory = filterState.category.some(function(cat) {
          return eventData.data('categories').indexOf(cat) >= 0
        })
        if (!eventHasCategory) showEvent = false
      }

      // if (showEvent && filterState.audience.length > 0) {
      //   var eventHasAudience = filterState.audience.some(function(audience) {
      //     return eventData.data('audience').indexOf(audience) >= 0
      //   })
      //   if (!eventHasAudience) showEvent = false
      // }

      if (!showEvent) {
        hideRow(row)
      } else {
        showEmptyMessage = false
      }
    }
    
    if (showEmptyMessage) {
      $('.event-table').addClass('empty')
      $('.empty-message').show()
    } else {
      $('.event-table').removeClass('empty')
      $('.empty-message').hide()
    }
  }

  var updateStripes = function() {
    $('.event-table tbody tr:not(".row-hidden")').each(function(i,v) {
      $(v).removeClass('has-background');
      if (i % 2 == 1) {
        $(v).addClass('has-background');
      }
    });
  }

  var hideRow = function(row) {
    $(row).addClass('row-hidden').attr('aria-hidden', true)
  }

  var handleChangeSemester = function(selected) {
    if (selected != 'Cancel') {
      filterState.semester = selected
      $('#select-partofterm').data('acdropdown').updateSelectedItem('Full Term')
      handleChangePartOfTerm('Full Term')
    } else {
      $('#select-semester').data('acdropdown').updateSelectedItem(filterState.semester)
    }
  }

  var handleChangePartOfTerm = function(selected) {
    filterState.partofterm = selected
    filterState.categories = []
    filterState.startDate = ''
    filterState.endDate = ''
    updateDropdowns()
    updateResults()
    updateStripes()
  }

  $('#ac-startdate').on('change', function() {
    filterState.startDate = $(this).val()
    updateResults()
    updateStripes()
  })

  $('#ac-enddate').on('change', function() {
    filterState.endDate = $(this).val()
    updateResults()
    updateStripes()
  })

  var handleChangeCategory = function (selected) {
    filterState.category = selected.split(',')
    updateResults()
    updateStripes()
  }

  var handleChangeAudience = function (selected) {
    filterState.audience = selected.split(',')
  }
  

  var openMobileFilters = function() {
    var modal = $('#mobile-calendar-modal')
    $('#mobile-category').empty()
    for (var cat of dropdownData[filterState.semester][filterState.partofterm].categories) {
      var checked = false
      if (filterState.category.indexOf(cat) > -1) {
        checked = true
      }
      $('#mobile-category').append('<li><div class="mobile-filter-cbx '+ (checked ? 'is-checked' : '') + '" role="checkbox" tabindex="0" aria-checked="' + checked + '">'+ cat +'</div></li>')
    }
    addMobileFilterEvents()
    $('#panel').attr('aria-hidden', true)
    $('#btn-more-filters-mobile').attr('aria-expanded', true)
    modal.css('top', $('.academic-calendar-container').offset().top + 'px')
    modal.addClass('shown')
    modal.find('.invisible-focus').focus();
  }

  var closeMobileFilters = function() {
    removeMobileFilterEvents()
    $('#panel').attr('aria-hidden', false)
    $('#mobile-calendar-modal').removeClass('shown')
    $('#btn-more-filters-mobile').attr('aria-expanded', false)
    $('#btn-more-filters-mobile').focus()
  }

  var handleMobileFilterSelection = function(checkbox) {
    if (checkbox.hasClass('is-checked')) {
      checkbox.removeClass('is-checked')
      checkbox.attr('aria-checked', false)
    } else {
      checkbox.addClass('is-checked')
      checkbox.attr('aria-checked', true)
    }
  }

  var addMobileFilterEvents = function() {
    $('.mobile-filter-cbx').on('click', function() {
      handleMobileFilterSelection($(this))
    })

    $('.mobile-filter-cbx').on('keydown', function(e) {
      if (e.keyCode === KeyCodes.ENTER || e.keyCode === KeyCodes.SPACE || e.keyCode === KeyCodes.RETURN) {
        e.preventDefault()
        handleMobileFilterSelection($(this))
      }
    })
  }

  var removeMobileFilterEvents = function () {
    $('.mobile-filter-cbx').off('click, keydown')
  }

  var toggleCheckbox = function(cb) {
    if (cb.hasClass('is-checked')) {
      cb.removeClass('is-checked')
    } else {
      cb.addClass('is-checked')
    }
    if ($('.event-cbx.is-checked').length > 0) {
      if (isMobile()) {
        if ($('#mobile-manage-events').css('display') == "none")
          $('#mobile-manage-events').velocity('slideDown', { duration: 200 })
      } else {
        $('#select-manage-events').css('display', 'block')
        $('#manage-help').css('display', 'block')
      }
    } else {
      if (isMobile()) {
        $('#mobile-manage-events').velocity('slideUp', { duration: 200 })
      } else {
        $('#select-manage-events').css('display', 'none')
        $('#manage-help').css('display', 'none')
      }
    }
  }

  var manageEvent = function(action) {
    if ($('#calendarActionUrl').length > 0) {
      var url = $('#calendarActionUrl').data('url') + '/'
      var trumbaAction = manageEventOptions[action]
      if (!trumbaAction) trumbaAction = "myevents"
      if (trumbaAction === "myevents") {
        url = url.replace('actions', 'myevents')
      } else {
        url += trumbaAction + '/'
        var selectedEvents = []
        $('.event-cbx.is-checked').each(function() {
          selectedEvents.push($(this).data('value'))
        })
        url += selectedEvents.join(',')
      }
      $('#manage-events-menu').removeClass('expanded')
      $('#btn-manage-events').attr('aria-expanded', false)
      window.open(url, 'manage', "width=750,height=800")
    } 
  }


  var subscribe = function() {
    // filter order is Audience, Applicable Term, Part of Term, Filter Category
    if ($('#calendarSubscribeUrl').length > 0) {
      var url = $('#calendarSubscribeUrl').data('url') + 'subscribe?'
      var queryString = 'filter1=_'
      if (filterState.audience.length > 0) {
        for (var audience of filterState.audience) {
          queryString += audience + '_'
        }
      }
      queryString += '&filter2=_'
      if (filterState.semester) {
        queryString += filterState.semester + '_'
      }
      queryString += '&filter3=_'
      if (filterState.partofterm) {
        queryString += filterState.partofterm + '_'
      }
      queryString += '&filter4=_'
      if (filterState.category.length > 0) {
        for (var cat of filterState.category) {
          queryString += cat + '_'
        }
      }
      queryString += '&filterfield1=Audience&filterfield2=Applicable Term&filterfield3=Part of Term&filterfield4=Filter Category'
      url += encodeURIComponent(queryString)
      window.open(url, 'subscribe', "width=750,height=800")
    }
  }

  var openPrintView = function() {
    var printWin = window.open('', 'Academic Calendar')
    var head = '<title>Academic Calendar</title>' + 
               '<style>' +
                  'h1 { text-align: center }' +
                  'table { margin: 0 auto; border: 1px solid #E2E2E3; width: 75%; border-collapse: collapse; border-spacing: 0; font-family: Helvetica, sans-serif; font-size: 14px; margin-bottom: 50px }' +
                  'table tr th {  background-color: #e8e3db; border: 0; padding: 20px 0 }' +
                  'tbody tr:nth-child(even) td { background-color: #F9FAFB }' +
                  'td { border: 1px solid #e2e2e3 } ' +
                  '.date-head, .date-col, .event-head, .event-col { padding: 10px 30px; text-align: left }' +
                  '.date-col div, .event-col div { display: flex; flex-direction: column }' +
                  '.date-col div span { margin-bottom: 3px }' +
                  '.date-col div .eventyear { color: rgba(124,124,124,0.8) }' +
                  '.event-col .event-title { margin-bottom: 7px }' +
                  '.event-col .event-description { color: #727272; font-size: 12px }' +
               '</style>'
    var body = '<h1>Academic Calendar</h1>'
    body += '<table>' +
              '<thead>' +
                '<tr>' +
                  '<th class="date-head">Date</th>' +
                  '<th class="event-head">Event</th>' +
                '<tr>' +
              '</thead>' +
              '<tbody>'
    var visibleRows = $('.event-table tbody tr:not(".row-hidden")')
    for (var r of visibleRows) {
      var dateCol = $(r).find('.date')
      var eventDetails = $(r).find('.event-details')
      body += '<tr>' +
                '<td class="date-col"><div>' + dateCol.html() + '</div></td>' +
                '<td class="event-col"><div>' + eventDetails.html() + '</div></td>' +
              '</tr>'
    }
    body += '</tbody></table>'
    printWin.document.head.innerHTML = head
    printWin.document.body.innerHTML = body
  }

  var semesters = Object.keys(dropdownData)
  // TODO: How am I supposed to sort these?
  for (var s of semesters) {
    $('#select-semester').data('acdropdown').addMenuItem(s)
  }

  updateStripes()
  
  $('#btn-toggle-more-filters').on('click', function() {
    var moreFilterRow = $('.filter-row.bottom')
    var moreFilters = $('.filter-row.bottom .filter-group')
    if (moreFilterRow.hasClass('expanded')) {
      moreFilterRow.removeClass('expanded')
      $(this).find('span').text('More filters')
      $(this).attr('aria-expanded', false)
    } else {
      moreFilterRow.addClass('expanded')
      $(this).find('span').text('Fewer filters')
      $(this).attr('aria-expanded', true)
    }
  })

  $('.event-cbx').on('click', function(e) {
    var cb = $(this)
    toggleCheckbox(cb)
  })

  $('.event-cbx').on('keydown', function(e) {
    if (e.keyCode === KeyCodes.ENTER || e.keyCode === KeyCodes.SPACE || e.keyCode === KeyCodes.RETURN) {
      e.preventDefault()
      toggleCheckbox($(this))
    }
  })

  var currentSemester = $('#currentSemester').data('semester')
  if (dropdownData[currentSemester]) {
      filterState.semester = currentSemester
      filterState.partofterm = 'Full Term'
      updateDropdowns()
  }

  $('#btn-reset-filters').on('click', function() {
    filterState.semester = currentSemester
    filterState.partofterm = 'Full Term'
    filterState.startDate = ''
    filterState.endDate = ''
    updateDropdowns()
    $('#select-partofterm').data('acdropdown').updateSelectedItem('Full Term')
    updateResults()
    updateStripes()
  })

  $('#btn-subscribe, #btn-mobile-subscribe').on('click', subscribe)

  $('#mobile-calendar-modal').focusout(function (e) {
    var tabbable = $('#mobile-calendar-modal').find(':tabbable');
    var first = tabbable.first();
    var last = tabbable.last();
    var targ = $(e.relatedTarget);
    if (targ.is('.focusstart')) {
      last.focus();
    } else if (targ.is('.focusend')) {
      first.focus();
    }
  })

  $('#mobile-calendar-modal').on('keydown', function(e) {
   if (e.keyCode === KeyCodes.ESCAPE) {
    closeMobileFilters()
   }
  })

  $('#mobile-filter-cancel').on('click',function() {
    closeMobileFilters()
  })

  $('#btn-more-filters-mobile').on('click', function() {
    openMobileFilters()
  })

  $('.toggle-mobile-subscribe').on('click', function() {
    var container = $(this).closest('.mobile-subscribe-container')
    if (container.hasClass('expanded')) {
      container.removeClass('expanded')
      $(this).attr('aria-expanded', false)
    } else {
      container.addClass('expanded')
      $(this).attr('aria-expanded', true)
    }
  })

  $('#btn-mobile-manage-events').on('click', function() {
    manageEvent('all')
  })

  $('#btn-subscribe').on('mouseover', function(e) {
    $('#subscribe-tooltip').addClass('shown')
  })

  $('#btn-subscribe').on('mouseout', function(e) {
    $('#subscribe-tooltip').removeClass('shown')
  })

  $('#subscribe-help').on('click', function() {
    $('#subscribe-tooltip').toggleClass('shown')
  })

  $('#subscribe-help').on('keydown', function(e) {
    if (e.keyCode === KeyCodes.ENTER || e.keyCode === KeyCodes.SPACE || e.keyCode === KeyCodes.RETURN) {
      e.preventDefault()
      e.stopPropagation()
      $('#subscribe-tooltip').toggleClass('shown')
    }
  })

  $('#select-manage-events').on('mouseover', function(e) {
    $('#manage-tooltip').addClass('shown')
  })

  $('#select-manage-events').on('mouseout', function(e) {
    $('#manage-tooltip').removeClass('shown')
  })

  $('#manage-help').on('click', function() {
    $('#manage-tooltip').toggleClass('shown')
  })

  $('#manage-help').on('keydown', function(e) {
    if (e.keyCode === KeyCodes.ENTER || e.keyCode === KeyCodes.SPACE || e.keyCode === KeyCodes.RETURN) {
      e.preventDefault()
      e.stopPropagation()
      $('#manage-tooltip').toggleClass('shown')
    }
  })

  $('#open-printable').on('click', function(e) {
    openPrintView();
  })

})
