(function ( $ ) {

  $.acdropdown = function(el, options) {
    var base = this
    base.$el = $(el)
    base.el = el

    base.$el.data('acdropdown', base)

    function menuIsOpen() {
      return base.$el.hasClass('expanded')
    }

    function openMenu() {
      base.$el.addClass('expanded')
      base.$el.attr('aria-expanded', true)
    }

    function closeMenu() {
      base.$el.removeClass('expanded')
      base.$el.attr('aria-expanded', false)
    }

    function updateSelectedCount(count) {
      return count + (count === 1 ? ' item': ' items') + ' selected'
    }
  
    base.init = function() {
      var dropdown = base.$el
      base.settings = $.extend({}, $.acdropdown.defaultOptions, options)
      base.$menu = dropdown.find('.menu')
      
      if (base.settings.selected && base.settings.showSelected) {
        base.$el.find('.text').text(base.settings.selected)
      }

      dropdown.on('click', function() {
        if (menuIsOpen()) {
          closeMenu()
        } else {
          openMenu()
        }
      })

      dropdown.on('blur', function(e) {
        if (!$.contains(this,e.relatedTarget)) {
          closeMenu()
        }
      })

      base.$menu.on('click', function(e) {
        e.stopPropagation()
        e.preventDefault()
        var item = $(e.target)
        base.selectItem(item)
      })

      base.$menu.find('li').on('blur', function(e) {
        if(!$.contains(base.$menu[0], e.relatedTarget)) {
          closeMenu()
        }
      })

      dropdown.on('keydown', function(e) {
        var menuItems = base.$menu.find('li:not(.selected)')
        if (e.keyCode === KeyCodes.DOWN) {
          e.preventDefault()
          if (menuIsOpen()) {
            var idx = menuItems.index(e.target)
            var newIdx = Math.min(idx + 1, menuItems.length - 1)
            menuItems.eq(newIdx).focus()
          } else {
            openMenu()
            menuItems.eq(0).focus()
          }
        } else if (e.keyCode === KeyCodes.UP) {
          e.preventDefault()
          if (menuIsOpen()) {
            var idx = menuItems.index(e.target)
            var newIdx = Math.max(0, idx - 1)
            menuItems.eq(newIdx).focus()
          } else {
            openMenu()
            menuItems.eq(menuItems.length - 1).focus()
          }
        } else if (e.keyCode === KeyCodes.ESCAPE) {
          closeMenu()
        } else if (e.keyCode === KeyCodes.ENTER || e.keyCode === KeyCodes.SPACE || e.keyCode === KeyCodes.RETURN) {
          e.preventDefault()
          if ($(e.target).is('.remove-all-filters')) {
            e.stopPropagation()
            dropdown.find('.selected-items').empty()
            dropdown.find('.menu li').removeClass('selected')
            dropdown.find('.text').removeClass('hidden')
          } else if ($(e.target).is('.remove-filter')) {
            e.stopPropagation()
            var selection = $(e.target).data('text')
            $('#' + base.$el.attr('id') + '-' + selection).removeClass('selected')
            $(e.target).closest('li').remove()
            base.$el.find('.info').text(updateSelectedCount(base.$el.find('.selected-items').find('li').length))
            if (base.$el.find('.selected-items li').length < 1) {
              base.$el.find('.text').removeClass('hidden')
            }
          } else if (menuIsOpen()) {
            if ($(e.target).is('.menu li')) {
              base.selectItem($(e.target))
            }
          } else {
            openMenu()
            menuItems.eq(0).focus()
          }
        }
      })

      dropdown.find('.remove-all-filters').on('click', function(e) {
        e.stopPropagation()
        dropdown.find('.selected-items').empty()
        dropdown.find('.menu li').removeClass('selected')
        dropdown.find('.text').removeClass('hidden')
      })
    }

    base.selectItem = function(item) {
      var selection = item.text()
      if (!base.settings.multiple) {
        if (base.settings.showSelected) {
          base.$el.find('.text').text(selection)
        }
        closeMenu()
      } else {
        var selectedItems = base.$el.find('.selected-items')
        var html = '<li>' +
                      '<div id="selected-'+ selection +'" class="selected-item">' + selection + 
                        '<button class="remove-filter" data-text="' + selection + '"><i class="fa fa-close" aria-label="Remove filter ' + selection + '"></i></button>' +
                      '</div>' + 
                    '</li>'
        selectedItems.append(html)
        $('#selected-' + selection + ' .remove-filter').on('click', function(e) {
          e.stopPropagation()
          $('#' + base.$el.attr('id') + '-' + selection).removeClass('selected')
          $(this).closest('li').remove()
          base.$el.find('.info').text(updateSelectedCount(selectedItems.find('li').length))
          if (selectedItems.find('li').length < 1) {
            base.$el.find('.text').removeClass('hidden')
          }
        })
        base.$el.find('.text').addClass('hidden')
        item.addClass('selected')
        base.$el.find('.info').text(updateSelectedCount(selectedItems.find('li').length))
      }
      
      base.settings.onSelect(selection)
      base.$el.focus()
    }

    base.updateSelectedItem = function(selection) {
      base.settings.selected = selection
      if (base.settings.showSelected) {
        base.$el.find('.text').text(selection)
      }
    }

    base.init()
  }

  $.acdropdown.defaultOptions = {
    multiple: false,
    onSelect: function(value) {
      console.log(value)
    },
    showSelected: true,
    selected: undefined
  }

  $.fn.acdropdown = function(options) {
    return this.each(function() {
      (new $.acdropdown(this, options))
    })
  }

}( jQuery ));