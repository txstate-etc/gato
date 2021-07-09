jQuery(document).ready(function($) {

  $('.gato-table.sortable').each(function() {
    function isDate(val) {
      var date = moment(val)
      return date.isValid()
    }

    var table = $(this)

    // make sure there is a table head
    if (table.find('thead').length === 0) {
      return
    }

    function sortRows(header) {
      var rows = table.find('tr:gt(0)').toArray()
      var columnIndex = header.index()
      table.find('thead th').each(function() {
        if ($(this).index() != columnIndex) {
          $(this).removeClass('sort-asc').removeClass('sort-desc')
        }
      })
      if (header.hasClass('sort-asc')) {
        header.removeClass('sort-asc')
        header.addClass('sort-desc')
        direction = 'descending'
      } else {
        header.removeClass('sort-desc')
        header.addClass('sort-asc')
        direction = 'ascending'
      }
      rows.sort(function(a,b) {
        var valA = $(a).find('td').eq(columnIndex).text()
        var valB = $(b).find('td').eq(columnIndex).text()
        if (!isNaN(valA) && !isNaN(valB)) {
          return valA - valB
        } else if (isDate(valA) && isDate(valB)) {
          var dateA = moment(valA)
          var dateB = moment(valB)
          if (dateA.isBefore(dateB)) return -1
          else if (dateA.isAfter(dateB)) return 1
          else return 0
        } else {
          return valA.toString().localeCompare(valB.toString())
        }
      })
      if (direction == 'descending') rows.reverse()
      for (var i = 0; i < rows.length; i++){
        $(rows[i]).removeClass('odd').removeClass('even')
        $(rows[i]).addClass(i%2 == 0 ? 'even' : 'odd')
        table.append(rows[i])
      }
      sortDescription.text('Table now sorted by ' + header.text() + ', ' + direction)
    }

    table.after('<span class="visuallyhidden sort-description" aria-live="polite"></span>')
    sortDescription = table.next('.sort-description')

    table.find('th').each(function() {
      var header = $(this)
      if (header.attr('colspan')) return
      var headerText = $(this).text()
      header.contents().wrap('<span class="header-container" role="button" tabindex="0" aria-label="sort by ' + headerText + '">')
      header.find('.header-container').append('<i class="fa fa-caret-up" aria-hidden="true" style="margin-left: 10px"></i>')

      header.on('click', function() {
        sortRows($(this))
      })
      header.on('keydown', function(e) {
        if (e.keyCode === KeyCodes.ENTER || e.keyCode === KeyCodes.SPACE || e.keyCode === KeyCodes.RETURN) {
          e.preventDefault()
          sortRows($(this))
        }
      })
    })
  })
})