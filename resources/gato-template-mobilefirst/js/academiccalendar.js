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
  console.log(dropdownData)

  var filterState = {
    audience: [],
    semester: 'Spring 2021',
    partofterm: 'Full Term',
    startDate: '',
    endDate: '',
    category: []
  }

  var updateDropdowns = function () {
    $('#select-semester').find('.selected-value').text(filterState.semester)
    $('#select-partofterm').find('.selected-value').text(filterState.partofterm)
    var relevantPartsOfTerm = Object.keys(dropdownData[filterState.semester])
    $('#pot-menu').empty();
    for (var p of relevantPartsOfTerm) {
      $('#pot-menu').append('<li tabindex="-1">' + p + '</li>')
    }
    $('#pot-menu').append('<li class="cancel" tabindex="-1">Cancel</li>')
    $('#pot-menu li').on('click', function(e) {
      handleChangePartOfTerm($(this))
    })
    $('#pot-menu li').on('keydown', function(e) {
      if (e.keyCode === KeyCodes.ENTER || e.keyCode === KeyCodes.SPACE || e.keyCode === KeyCodes.RETURN) {
        handleChangePartOfTerm($(this))
      }
    })
    var relevantCategories = dropdownData[filterState.semester][filterState.partofterm].categories
    $('#category-menu').empty()
    for (var c of relevantCategories) {
      $('#category-menu').append('<li tabindex="-1">' + c + '</li>')
    }

    var minDate = moment(dropdownData[filterState.semester][filterState.partofterm].mindate).format('YYYY-MM-DD')
    var maxDate = moment(dropdownData[filterState.semester][filterState.partofterm].maxdate).format('YYYY-MM-DD')
    $('#ac-startdate').attr('min', minDate).attr('max', maxDate)
    $('#ac-enddate').attr('min', minDate).attr('max', maxDate)
  }

  var handleChangeSemester = function(selected) {
    var value = selected.text()
    if (!selected.hasClass('cancel')) {
      filterState.semester = value
      filterState.partofterm = 'Full Term'
      filterState.categories = []
      filterState.startDate = ''
      filterState.endDate = ''
      updateDropdowns()
    }
    selected.closest('.ac-dropdown').find('.toggle-dropdown').trigger('click')
  }

  var handleChangePartOfTerm = function(selected) {
    var value = selected.text()
    if (!selected.hasClass('cancel')) {
      filterState.partofterm = value
      filterState.categories = []
      filterState.startDate = ''
      filterState.endDate = ''
      updateDropdowns()
    }
    selected.closest('.ac-dropdown').find('.toggle-dropdown').trigger('click')
  }

  var toggleCheckbox = function(cb) {
    if (cb.hasClass('is-checked')) {
      cb.removeClass('is-checked')
    } else {
      cb.addClass('is-checked')
    }
    if ($('.event-cbx.is-checked').length > 0) {
      $('.manage-events-container').css('display', 'block')
    } else {
      $('.manage-events-container').css('display', 'none')
    }
  }

  var manageEvent = function(action) {
    var url = 'https://eventactions.com/eventactions/txstate#/'
    if (action === "myevents") {
      url += "myevents"
    } else {
      url += 'actions/' + action + '/'
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

  var semesters = Object.keys(dropdownData)
  // TODO: How am I supposed to sort these?
  for (var s of semesters) {
    $('#semester-menu').append('<li tabindex="-1">' + s + '</li>')
  }
  $('#semester-menu').append('<li class="cancel" tabindex="-1">Cancel</li>')
  
  $('.ac-dropdown').each(function() {
    var dropdown = $(this)
    var menu = $(this).find('.menu')
    
    var closeMenu = function() {
      dropdown.removeClass('expanded')
      dropdown.find('.toggle-dropdown').attr('aria-expanded', false).focus()

    }

    var openMenu = function() {
      dropdown.addClass('expanded')
      dropdown.find('.toggle-dropdown').attr('aria-expanded', true)
    }

    dropdown.find('.toggle-dropdown').on('click', function() {
      if (dropdown.hasClass('expanded')) {
        closeMenu()
      } else {
        openMenu()
      }
    })

    dropdown.on('keydown', function(e) {
      if (e.keyCode === KeyCodes.ESCAPE) {
        closeMenu()
      } else if (e.keyCode === KeyCodes.DOWN) {
        e.preventDefault()
        if (!dropdown.hasClass('expanded')) {
          openMenu()
        } else {
          dropdown.find('.menu li').eq(0).focus()
        }
      }
    })

    menu.on('keydown', function(e) {
      e.preventDefault()
      var menuItems = $(this).find('li')
      if (e.keyCode === KeyCodes.DOWN) {
        e.stopPropagation()
        var idx = menuItems.index(e.target)
        if (idx === menuItems.length - 1) {
          menuItems.eq(0).focus()
        } else {
          menuItems.eq(idx + 1).focus()
        }
      } else if (e.keyCode === KeyCodes.UP) {
        e.stopPropagation()
        var idx = menuItems.index(e.target)
        if (idx === 0) {
          menuItems.eq(menuItems.length -1).focus()
        } else {
          menuItems.eq(idx - 1).focus()
        }
      }
    })
  })

  $('#semester-menu li').on('click', function(e) {
    handleChangeSemester($(this))
  })
  $('#semester-menu li').on('keydown', function(e) {
    if (e.keyCode === KeyCodes.ENTER || e.keyCode === KeyCodes.SPACE || e.keyCode === KeyCodes.RETURN) {
      handleChangeSemester($(this))
    }
  })

  $('#pot-menu li').on('click', function(e) {
    handleChangePartOfTerm($(this))
  })
  
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

  $('#btn-manage-events').on('click', function() {
    var menu = $('#manage-events-menu')
    if (menu.hasClass('expanded')) {
      menu.removeClass('expanded')
      $(this).attr('aria-expanded', false)
    } else {
      menu.addClass('expanded')
      $(this).attr('aria-expanded', true)
    }
  })
  
  $('#btn-manage-events').on('keydown', function(e) {
    var menu = $('#manage-events-menu')
    if (e.keyCode === KeyCodes.ESCAPE) {
      menu.removeClass('expanded')
      $(this).attr('aria-expanded', false)
    } else if (e.keyCode === KeyCodes.DOWN) {
      e.preventDefault()
      if (!menu.hasClass('expanded')) {
        menu.addClass('expanded')
        $(this).attr('aria-expanded', true)
      } else {
        menu.find('li').eq(0).focus()
      }
    }
  })

  $('#manage-events-menu li').on('click', function() {
    var action = $(this).data('action')
    manageEvent(action)
  })

  $('#manage-events-menu li').on('keydown', function(e) {
    var menu = $('#manage-events-menu')
    var menuItems = menu.find('li')
    var button = $('#btn-manage-events')
    if (e.keyCode === KeyCodes.ESCAPE) {
      menu.removeClass('expanded')
      button.attr('aria-expanded', false).focus()
    } else if (e.keyCode === KeyCodes.DOWN) {
      e.preventDefault()
      e.stopPropagation()
      var idx = menuItems.index(e.target)
      if (idx === menuItems.length - 1) {
        menuItems.eq(0).focus()
      } else {
        menuItems.eq(idx + 1).focus()
      }
    } else if (e.keyCode === KeyCodes.UP) {
      e.preventDefault()
      e.stopPropagation()
      var idx = menuItems.index(e.target)
      if (idx === 0) {
        menuItems.eq(menuItems.length -1).focus()
      } else {
        menuItems.eq(idx - 1).focus()
      }
    } else if (e.keyCode === KeyCodes.ENTER || e.keyCode === KeyCodes.SPACE || e.keyCode === KeyCodes.RETURN) {
      var action = $(this).data('action')
      manageEvent(action)
    }
  })

})