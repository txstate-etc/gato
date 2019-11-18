jQuery(document).ready(function($) {
    var tabs = $('.tab-list button')
    var showTab = function(tab) {
      //hide other tabs
      $('.tab-list button').not(':eq('+ tab.index() +')').velocity({marginLeft: 0}, {
        duration: 200,
        begin: function() {
          $(this).closest('.overlay-block').addClass("animating")
          $(this).attr('aria-selected', "false");
          $(this).attr('tabindex', -1);
          $(this).removeClass('selected-tab');
          $('.overlay-content').not(':eq('+ tab.index() +')').attr('tabindex', -1);
          $('.overlay-content').not(':eq('+ tab.index() +')').removeClass('selected-content');
        },
        complete: function() {
          $(this).closest('.overlay-block').removeClass("animating")
        }
      })
      //show new tab
      tab.velocity({marginLeft: "10%"}, {
        duration: 200,
        complete: function() {
          $(this).addClass('selected-tab');
          $(this).attr('aria-selected', "true");
          $(this).attr('tabindex', 0);
          $('.overlay-content').eq(tab.index()).addClass('selected-content');
          $('.overlay-content').eq(tab.index()).attr('tabindex', 0);
        }
      })
      $('.overlay-content').not(':eq('+ tab.index() +')').velocity("fadeOut", {
        duration: 100
      })
      $('.overlay-content').eq(tab.index()).velocity("fadeIn", {
        duration: 100, delay: 100
      })
    }
    
    var reset = function() {
      //stop animation
      $('.tab-list button').velocity("stop")
      $('.overlay-content').velocity("stop")
    }
        
    //tabs animation
    var handleTabClick = function(e) {
      var overlayBlock = $(this).closest('.overlay-block');
      var currentTab = $('.tab-list button.selected-tab');
      var nextTab = $(this);
      if (currentTab.index() == nextTab.index()) return;
      if (overlayBlock.is(".animating")) {
        reset();
      }
      showTab(nextTab);
    }
    
    tabs.focus(function(e) {
      handleTabClick.call($(e.target))
    });
    
    tabs.on('keydown', function(e) {
      switch(e.keyCode) {
        case KeyCodes.HOME:
          e.preventDefault()
          tabs.first().focus();
          break;
        case KeyCodes.END:
          e.preventDefault()
          tabs.last().focus();
          break;
        case KeyCodes.RIGHT:
        case KeyCodes.DOWN:
          e.preventDefault();
          var focusedIndex = $(':focus').index();
          if (focusedIndex < tabs.length - 1) {
            tabs.eq(focusedIndex + 1).focus();
          }
          else {
            tabs.first().focus();
          }
          break;
        case KeyCodes.LEFT:
        case KeyCodes.UP:
          e.preventDefault();
          var focusedIndex = $(':focus').index();
          if (focusedIndex > 0) {
            tabs.eq(focusedIndex - 1).focus();
          }
          else {
            tabs.last().focus();
          }
          break;
        default:
          var keyCode = e.keyCode;
      }
    })
});
