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
    "Email to Friends": "forward"
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
    multiple: true
  })

  $('#select-semester').acdropdown({
    onSelect: function(item) {
      handleChangeSemester(item)
    }
  })
  
  $('#select-partofterm').acdropdown({
    onSelect: function(item) {
      handleChangePartOfTerm(item)
    },
    selected: 'Full Term'
  })
  $('#select-category').acdropdown( {
    multiple: true
  })

  $('#select-download-print').acdropdown( {
    showSelected: false
  })

  $('#select-manage-events').acdropdown( {
    showSelected: false,
    onSelect: function(item) {
      manageEvent(item)
    }
  })

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
    $('#ac-startdate').attr('min', minDate).attr('max', maxDate)
    $('#ac-enddate').attr('min', minDate).attr('max', maxDate)
  }

  var updateResults = function() {
    var rows = $('.event-table tbody tr')
    rows.removeClass('row-hidden').attr('aria-hidden', false)
    for (var row of rows) {
      //check if row matches filters. hide it if it doesn't
      var eventData = $(row).find('.event-data')
      if (eventData.data('semester').indexOf(filterState.semester) < 0) {
        hideRow(row)
      } else if (eventData.data('partsofterm').indexOf(filterState.partofterm) < 0) {
        hideRow(row)
      }
    }
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
  }

  var openMobileFilters = function() {
    var modal = $('#mobile-calendar-modal')
    $('#mobile-category').empty()
    for (var cat of dropdownData[filterState.semester][filterState.partofterm].categories) {
      $('#mobile-category').append('<li><div class="mobile-filter-cbx" role="checkbox" tabindex="0">'+ cat +'</div></li>')
    }
    $('#panel').attr('aria-hidden', true)
    $('#btn-more-filters-mobile').attr('aria-expanded', true)
    modal.css('top', $('.academic-calendar-container').offset().top + 'px')
    modal.addClass('shown')
    modal.find('.invisible-focus').focus();
  }

  var closeMobileFilters = function() {
    $('#panel').attr('aria-hidden', false)
    $('#mobile-calendar-modal').removeClass('shown')
    $('#btn-more-filters-mobile').attr('aria-expanded', false)
    $('#btn-more-filters-mobile').focus()
  }

  var toggleCheckbox = function(cb) {
    if (cb.hasClass('is-checked')) {
      cb.removeClass('is-checked')
    } else {
      cb.addClass('is-checked')
    }
    if ($('.event-cbx.is-checked').length > 0) {
      $('#select-manage-events').css('display', 'block')
      $('#manage-help').css('display', 'block')
    } else {
      $('#select-manage-events').css('display', 'none')
      $('#manage-help').css('display', 'none')
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

  var semesters = Object.keys(dropdownData)
  // TODO: How am I supposed to sort these?
  for (var s of semesters) {
    $('#select-semester').data('acdropdown').addMenuItem(s)
  }
  
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

})
