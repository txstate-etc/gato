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
      $('#pot-menu').append('<li>' + p + '</li>')
    }
    $('#pot-menu li').on('click', function(e) {
      handleChangePartOfTerm($(this))
    })
    var relevantCategories = dropdownData[filterState.semester][filterState.partofterm].categories
    $('#category-menu').empty()
    for (var c of relevantCategories) {
      $('#category-menu').append('<li>' + c + '</li>')
    }

    var minDate = moment(dropdownData[filterState.semester][filterState.partofterm].mindate).format('YYYY-MM-DD')
    var maxDate = moment(dropdownData[filterState.semester][filterState.partofterm].maxdate).format('YYYY-MM-DD')
    $('#ac-startdate').attr('min', minDate).attr('max', maxDate)
    $('#ac-enddate').attr('min', minDate).attr('max', maxDate)
  }

  var handleChangeSemester = function(selected) {
    var value = selected.text()
    filterState.semester = value
    filterState.partofterm = 'Full Term'
    filterState.categories = []
    filterState.startDate = ''
    filterState.endDate = ''
    selected.closest('.ac-dropdown').find('.toggle-dropdown').trigger('click')
    updateDropdowns()
  }

  var handleChangePartOfTerm = function(selected) {
    var value = selected.text()
    filterState.partofterm = value
    filterState.categories = []
    filterState.startDate = ''
    filterState.endDate = ''
    selected.closest('.ac-dropdown').find('.toggle-dropdown').trigger('click')
    updateDropdowns()
  }

  var semesters = Object.keys(dropdownData)
  // TODO: How am I supposed to sort these?
  for (var s of semesters) {
    $('#semester-menu').append('<li>' + s + '</li>')
  }
  
  $('.ac-dropdown').each(function() {
    var dropdown = $(this)
    var menu = $(this).find('.menu')
    
    var closeMenu = function() {
      dropdown.removeClass('expanded')
      dropdown.find('.toggle-dropdown').attr('aria-expanded', false)
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
  })

  $('#semester-menu li').on('click', function(e) {
    handleChangeSemester($(this))
  })

  $('#pot-menu li').on('click', function(e) {
    handleChangePartOfTerm($(this))
  })
  
  $('#btn-toggle-more-filters').on('click', function() {
    var moreFilters = $('.filters .more')
    if (moreFilters.hasClass('expanded')) {
      moreFilters.removeClass('expanded')
      $(this).find('span').text('Show more filters')
      $(this).attr('aria-expanded', false)
    } else {
      moreFilters.addClass('expanded')
      $(this).find('span').text('Hide more filters')
      $(this).attr('aria-expanded', true)
    }
  })

  $('.event-cbx').on('click', function(e) {
    var cb = $(this)
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

  
})