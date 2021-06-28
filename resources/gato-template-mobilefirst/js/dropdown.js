(function ( $ ) {

  $.acdropdown = function(el, options) {
    var base = this
    base.$el = $(el)
    base.el = el
    base.currentSelected
    base.contextPath = window.location.pathname.substring(0, window.location.pathname.indexOf("/.magnolia"))

    base.$el.data('acdropdown', base)

    function menuIsOpen() {
      return base.$el.hasClass('expanded')
    }

    function buildMobileMenu() {
      var html = '<div class="ac-mobile-menu" role="dialog" aria-modal="true">' +
                  '<div tabindex="0" class="menu-focusstart visuallyhidden"></div>' +
                  '<div id="mobile-menu-content">' +
                  '<ul>'
      var menuItems = base.$el.find('.menu li')
      menuItems.each(function() {
        html += '<li tabindex="0">' + $(this).text() + '</li>'
      })
      html +=         '<li tabindex="0" class="cancel">Cancel</li>'
      html +=       '</ul>'
      html +=     '</div>' +
                  '<div tabindex="0" class="menu-focusend visuallyhidden"></div>' +
                '</div>'
      return html
    }

    function openMobileMenu() {
      $('.ac-mobile-menu').addClass('shown')
      $('.ac-mobile-menu').find('li').first().focus()
      $('body').children().not('.ac-mobile-menu').each(function() {
        if (!$(this).attr('aria-hidden') || $(this).attr('aria-hidden') == "false") {
          $(this).attr('aria-hidden', true).attr('data-hidden', true)
        }
      })
    }

    function closeMobileMenu() {
      $('.ac-mobile-menu').removeClass('shown')
      $('body').children('*[data-hidden="true"]').each(function() {
        $(this).attr('aria-hidden', false).removeAttr('data-hidden')
        base.$el.focus()
      })
      base.settings.onMenuClose()
    }

    function handleMobileMenu() {
      if ($('.ac-mobile-menu').length > 0) {
        $('.ac-mobile-menu').remove()
      } 
      $('body').append(buildMobileMenu())
      $('.ac-mobile-menu').on('click', function(e) {
        if ($(e.target).hasClass('cancel') || $(e.target).closest('#mobile-menu-content').length === 0) {
          closeMobileMenu()
        } else {
          base.selectItem($(e.target))
          closeMobileMenu()
        }
      })
      $('.ac-mobile-menu').on('keydown', function(e) {
        if (e.keyCode === KeyCodes.ESCAPE) {
          closeMobileMenu()
        } else if (e.keyCode == KeyCodes.DOWN) {
          e.preventDefault()
          var idx = $('.ac-mobile-menu li').index(e.target)
          var newIdx = Math.min(idx + 1, $('.ac-mobile-menu li').length - 1)
          $('.ac-mobile-menu li').eq(newIdx).focus()
        } else if (e.keyCode == KeyCodes.UP) {
          var idx = $('.ac-mobile-menu li').index(e.target)
          var newIdx = Math.max(0, idx - 1)
          $('.ac-mobile-menu li').eq(newIdx).focus()
        } else if (e.keyCode === KeyCodes.ENTER || e.keyCode === KeyCodes.SPACE || e.keyCode === KeyCodes.RETURN) {
          e.preventDefault()
          if ($(e.target).hasClass('cancel')) {
            closeMobileMenu()
          } else {
            base.selectItem($(e.target))
            closeMobileMenu()
          }
        }
      })
      $('#mobile-menu-content').focusout(function (e) {
        var tabbable = $('.ac-mobile-menu').find(':tabbable');
        var first = tabbable.first();
        var last = tabbable.last();
        var targ = $(e.relatedTarget);
        if ($('.ac-mobile-menu').css('display') != 'none' ) {
          if (targ.is('.menu-focusstart')) {
            last.focus();
          } else if (targ.is('.menu-focusend')) {
            first.focus();
          }
        }
      })
    }

    function openMenu() {
      if (window.matchMedia) {
        if (window.matchMedia("(max-width: 31.25em)").matches) {
          handleMobileMenu()
          openMobileMenu()
        } else {
          base.$el.addClass('expanded')
          base.$el.find('.menu').velocity("slideDown", {duration: 200})
        }
      }
      else {
        if ($(window).width() < 501) {
          handleMobileMenu()
          openMobileMenu()
        } else {
          base.$el.addClass('expanded')
          base.$el.find('.menu').velocity("slideDown", {duration: 200})
        }
      }
      base.$el.attr('aria-expanded', true)
    }

    function closeMenu() {
      base.$el.removeClass('expanded')
      base.$el.attr('aria-expanded', false)
      base.$el.find('.menu').velocity("slideUp", {duration: 200})
      base.settings.onMenuClose()
    }

    function updateSelectedCount(count) {
      return count + (count === 1 ? ' item': ' items') + ' selected'
    }

    function safeString(val) {
      return val.replace(/\W/g, '_')
    }

    function selectMultiSelectItem(val) {
      var selectedItems = base.$el.find('.selected-items')
      var html = '<li role="option" tabindex="-1" aria-selected="true" class="selected-listitem" data-text="' + val + '">' +
                    '<div id="selected-'+ safeString(val) +'" class="selected-item">' + val + 
                    '<img class="remove-filter" src="' + base.contextPath + '/.resources/gato-template-mobilefirst/images/academic-calendar/academic-calendar-x.svg" aria-hidden="true"/>' +
                    '<span class="visuallyhidden">, press delete to remove</span>'
                    '</div>' + 
                  '</li>'
      
      var newItem = $(html)
      selectedItems.append(newItem)
      $('#selected-' + safeString(val) + ' .remove-filter').on('click', function(e) {
        e.stopPropagation()
        $('#' + base.$el.attr('id') + '-' + safeString(val)).removeClass('selected')
        $(this).closest('li').remove()
        base.$el.find('.info').text(updateSelectedCount(selectedItems.find('li').length))
        if (selectedItems.find('li').length < 1) {
          base.$el.find('.text').removeClass('hidden')
          base.settings.onChange('')
        } else {
          var allSelected = []
          base.$el.find('.menu li.selected').each(function() {
            allSelected.push($(this).text())
          })
          base.currentSelected = allSelected.join(';')
          base.settings.onChange(allSelected.join(';'))
        }
        base.$el.focus()
      })
      base.$el.find('.text').addClass('hidden')
      $('#' + base.$el.attr('id') + '-' + safeString(val)).addClass('selected')
      base.$el.find('.info').text(updateSelectedCount(selectedItems.find('li').length))
    }
  
    base.init = function() {
      var dropdown = base.$el
      base.settings = $.extend({}, $.acdropdown.defaultOptions, options)
      base.$menu = dropdown.find('.menu')

      
      if (base.settings.selected ) {
        base.currentSelected = base.settings.selected
        if (base.settings.showSelected) {
          base.$el.find('.text').text(base.settings.selected)
        }
      } else {
        base.currentSelected = ''
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
        } else if (e.keyCode === KeyCodes.LEFT) {
            var selectedItems = dropdown.find('.selected-items li')
            if ($(e.target).is('.selected-listitem')) {
              var idx = selectedItems.index(e.target)
              if (idx > 0) {
                selectedItems.eq(idx - 1).focus()
              }
            } else {
              if (selectedItems.length > 0) {
                selectedItems.eq(selectedItems.length - 1).focus()
              }
            }
        } else if (e.keyCode === KeyCodes.RIGHT) {
          if ($(e.target).is('.selected-listitem')) {
            var selectedItems = dropdown.find('.selected-items li')
            var idx = selectedItems.index(e.target)
            if (idx < selectedItems.length - 1) {
              selectedItems.eq(idx + 1).focus()
            }
          }
        } else if (e.keyCode === KeyCodes.ESCAPE) {
          closeMenu()
        } else if (e.keyCode === KeyCodes.ENTER || e.keyCode === KeyCodes.SPACE || e.keyCode === KeyCodes.RETURN) {
          e.preventDefault()
          if (menuIsOpen()) {
            if ($(e.target).is('.menu li')) {
              base.selectItem($(e.target))
            }
          } else {
            openMenu()
            menuItems.eq(0).focus()
          }
        } else if (e.keyCode === KeyCodes.DELETE || e.keyCode === KeyCodes.BACK_SPACE) {
          e.preventDefault()
          if ($(e.target).find('.remove-filter').length > 0) {
            e.stopPropagation()
            var selection = $(e.target).data('text')
            $('#' + base.$el.attr('id') + '-' + safeString(selection)).removeClass('selected')
            $(e.target).closest('li').remove()
            base.$el.find('.info').text(updateSelectedCount(base.$el.find('.selected-items').find('li').length))
            if (base.$el.find('.selected-items li').length < 1) {
              base.$el.find('.text').removeClass('hidden')
              base.settings.onChange('')
            } else {
              var allSelected = []
              base.$el.find('.menu li.selected').each(function() {
                allSelected.push($(this).text())
              })
              base.currentSelected = allSelected.join(';')
              base.settings.onChange(allSelected.join(';'))
            }
            base.$el.focus()
          }
        } else if (e.keyCode === KeyCodes.TAB) {
          closeMenu()
        }
      })

      dropdown.find('.remove-all-filters').on('click', function(e) {
        e.stopPropagation()
        dropdown.find('.selected-items').empty()
        dropdown.find('.menu li').removeClass('selected')
        dropdown.find('.text').removeClass('hidden')
        base.settings.onChange('')
        base.currentSelected = ''
        closeMenu()
      })
    }

    base.selectItem = function(item) {
      var selection = item.text()
      if (!base.settings.multiple) {
        base.currentSelected = selection
        if (base.settings.showSelected) {
          base.$el.find('.text').text(selection)
        }
        base.$el.find('.menu li').attr('aria-selected', false)
        item.attr('aria-selected', true)
        base.settings.onChange(selection)
        closeMenu()
      } else {
        selectMultiSelectItem(selection)
        //get all selected Items
        var allSelected = []
        base.$el.find('.menu li.selected').each(function() {
         allSelected.push($(this).text())
        })
        base.currentSelected = allSelected.join(';')
        base.settings.onChange(allSelected.join(';'))
      }
      
      base.$el.focus()
    }

    base.updateSelectedItem = function(selection) {
      if (!base.settings.multiple) {
        base.settings.selected = selection
        base.currentSelected = selection
        var menuItems = base.$el.find('.menu li')
        menuItems.attr('aria-selected', false)
        menuItems.each(function() {
          if ($(this).text() === selection) {
            $(this).attr('aria-selected', true)
          }
        })
        if (base.settings.showSelected) {
          base.$el.find('.text').text(selection)
        }
      } else {
        selectMultiSelectItem(selection)
      }
      
    }

    base.addMenuItem = function(text) {
      var selectId = base.$el.attr('id')
      var itemId = selectId + '-' + safeString(text)
      base.$el.find('.menu').append('<li id="'+ itemId +'" role="option" tabindex="-1">' + text + '</li>')
      if (!base.settings.multiple) {
        if (text == base.currentSelected) {
          $('#' + itemId).attr('aria-selected', true)
        } else {
          $('#' + itemId).attr('aria-selected', false)
        }
      }
    }

    base.resetSelected = function() {
      if (!base.settings.multiple) {
        if (base.settings.showSelected) {
          base.$el.find('.text').text(base.settings.placeholder)
        }
      } else {
        base.$el.find('.selected-items').empty()
        base.$el.find('.menu li').removeClass('selected')
        base.$el.find('.text').removeClass('hidden')
      }
    }

    base.init()
  }

  $.acdropdown.defaultOptions = {
    multiple: false,
    onChange: function(value) {
      console.log(value)
    },
    showSelected: true,
    selected: undefined,
    placeholder: 'Choose...',
    onMenuClose: function() {

    }
  }

  $.fn.acdropdown = function(options) {
    return this.each(function() {
      (new $.acdropdown(this, options))
    })
  }

}( jQuery ));