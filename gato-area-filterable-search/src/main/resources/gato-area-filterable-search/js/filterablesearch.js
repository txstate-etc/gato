jQuery(document).ready(function($) {

  var activeFilters = {};

  //TODO: The mobile-first template goes to mobile layout below 800 px but is that
  //true for all templates?
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

  var searchArea = $('.filterable-search-container');
  var filterToggleButton = $('.btn-toggle-filters');
  var mobileUrlParams = {};

  //open and close filter panel
  filterToggleButton.click(function(e) {
    if (searchArea.hasClass('filters-open')) {
      searchArea.removeClass('filters-open');
      filterToggleButton.attr('aria-expanded', false);
      filterToggleButton.focus();
    }
    else {
      searchArea.addClass('filters-open');
      filterToggleButton.attr('aria-expanded', true);
      $('.invisible-focus').focus();
      if (isMobile()) {
        //save current url parameters
        mobileUrlParams = getUrlParameters();
      }
    }
    //close filter lists
    $('.select-filters').each(function(index, element) {
      var element = $(element);
      if (element.hasClass('open')) {
        element.find('.header').attr('aria-expanded', false);
        element.find('.body').css('display', 'none');
        element.removeClass('open');
      }
    })
    toggleArrows();
    setImageContainerSize()
  })

  //open and close filter lists
  var toggleFilterList = function(target) {
    var dropdown = $(target);
    var panel = dropdown.parent().find('.body');
    if (dropdown.parent().hasClass('open')) {
      dropdown.attr('aria-expanded', false);
      panel.velocity("slideUp", {duration: 300});
    }
    else {
      dropdown.attr('aria-expanded', true);
      panel.velocity("slideDown", {duration: 300});
    }
    dropdown.parent().toggleClass('open');
  }

  $('.select-filters .header').click(function(e) {
    toggleFilterList(this);
  })

  $('.select-filters .header').keydown(function(e) {
    if (e.which == 32 || e.which == 13) {
      e.preventDefault();
      toggleFilterList(e.target);
    }
  })

  var clearFilters = function() {
    $('.filter-container .filter-cbx').each(function(index, value) {
      var checkbox = $(value);
      if (checkbox.hasClass('is-checked')) {
        toggleCheckbox(checkbox);
      }
    })
    if (isMobile()) {
      $('.btn-apply-filters').text('Apply Reset');
      if ($('.apply-filters').css('display') == "none")
        $('.apply-filters').velocity("slideDown", {duration: 300});
    }
    updateSearchResults();
  }

  var getSelectedFilters = function() {
    var selected = [];
    $('.filter-container .filter-cbx').each(function(index, value) {
      var checkbox = $(value);
      if (checkbox.hasClass('is-checked')) {
        selected.push(checkbox.attr('id'));
      }
    })
    return selected;
  }

  var updateActiveFilters = function(filterIds) {
    activeFilters = {};
    for (var i=0; i<filterIds.length; i++) {
      var id = filterIds[i];
      var groupId = $('#' + id).data('group');
      if (!activeFilters[groupId]) {
        activeFilters[groupId] = [];
      }
      activeFilters[groupId].push(id);
    }
  }

  var updateUrlParameters = function(filters, query) {
    var params = getUrlParameters();
    params.filters = filters.join(',');
    if (query.length > 0) {
      params.q = query
    }
    history.pushState(null, null, createUrlQuery(params));
  }

  var updateScreenReaderFilterGroupText = function(group) {
    var numSelectedFilters = group.find('.filter-cbx.is-checked').length;
    var text = numSelectedFilters;
    text += (numSelectedFilters == 1) ? " filter selected." : " filters selected.";
    group.find('.header .sr-filters-selected').text(text);
  }

  var splitwords = function (str) {
    return str.trim().toLocaleLowerCase().split(/\W+/).filter(function (w) { return w && !stopwords[w] })
  }

  var itemIndex = {}
  var itemContainsQuery = function(item, words) {
    var id = item.attr('id')
    if (!itemIndex[id]) {
      var textchunks = item.find("*[data-searchable='true']").map(function () { return $(this).text() }).get()
      textchunks.push(item.data('keywords'))
      var moretext = $.map(item.data('tags').split(','), function (t) { return $('#' + t).data('name') })
      textchunks = textchunks.concat(moretext)
      var itemwordset = new Set()
      $.each(textchunks, function(idx, text) {
        var itemwords = splitwords(text)
        for (var i = 0; i < itemwords.length; i++) {
          var w = itemwords[i]
          for (var j = 1; j <= w.length; j++) {
            itemwordset.add(w.substring(0, j))
          }
        }
      });
      itemIndex[id] = itemwordset
    }
    return words.every(w => itemIndex[id].has(w));
  }

  var itemMatchesFilters = function(item) {
    var isRelevant = true;
    var tags = item.data('tags').split(',');
    for (var group in activeFilters) {
      if (activeFilters.hasOwnProperty(group)) {
        var selectedTags = activeFilters[group];
        var hasTag = selectedTags.some(function(v) {
          return tags.indexOf(v) >= 0;
        });
        if (!hasTag) {
          isRelevant = false;
          continue;
        }
      }
    }
    return isRelevant;
  }

  var updateResultsShown = function() {
    var totalItems = $('.filtered-results .listitem').length;
    var itemsHidden = $('.result.listitem-hidden').length;
    var resultCountText = "";
    if (itemsHidden == 0) {
      resultCountText = totalItems + (totalItems == 1 ? " Result" : " Results");
    }
    else {
      var itemsShown = totalItems - itemsHidden;
      resultCountText = itemsShown + (itemsShown == 1 ? " result" : " results of " + totalItems);
    }
    $('#result-count').text(resultCountText);
    $('#mobile-result-count').text(resultCountText);
    if (itemsHidden == totalItems) {
      $('#no-results-message').removeClass("message-hidden")
    }
    else {
      $('#no-results-message').addClass("message-hidden")
    }
  }

  var updateStripes = function() {
    $('.result:not(".listitem-hidden")').each(function(i,v) {
      $(v).removeClass('has-background');
      if (i % 2 == 1) {
        $(v).addClass('has-background');
      }
    });
  }

  var updateSearchResults = function() {
    var query = $('#search-field').val();
    if (isMobile()) {
      query = $('#mobile-search-field').val();
    }
    query = query.toLowerCase().trim();
    var arrFilters = getSelectedFilters();
    $('.filter-count').text("(" + arrFilters.length + ")")
    var filterButtonAriaLabel = "Search Filters: " + arrFilters.length + ((arrFilters.length == 1) ? " filter " : " filters ") + "currently selected";
    $('.btn-toggle-filters').attr('aria-label', filterButtonAriaLabel)
    updateUrlParameters(arrFilters, query);
    updateActiveFilters(arrFilters);

    var words = splitwords(query)
    $('.filtered-results .listitem').each(function(index, item) {
      item = $(item);
      var isRelevant = true;
      if (query.length > 0) {
        isRelevant = itemContainsQuery(item, words);
        if (isRelevant) {
          isRelevant = itemMatchesFilters(item);
        }
      }
      else {
        isRelevant = itemMatchesFilters(item);
      }

      if (!isRelevant) {
        item.closest('li').addClass('listitem-hidden')
        item.closest('li').attr('aria-hidden', true);
      }
      else {
        item.closest('li').removeClass('listitem-hidden')
        item.closest('li').attr('aria-hidden', false);
      }
    });

    updateResultsShown();
    updateStripes();
    updateAlphaHeaders();
  }

  var buildActiveFilter = function(name, id) {
    var html = '<li id="active_' + id +'">' +
      '<span class="active-filter">' + name +
        '<button class="remove-filter" aria-label="remove filter ' +  name + '"><i class="fas fa-times" aria-hidden="true"></i></button>' +
      '</span>' +
    '</li>';
    return html;
  }

  var toggleCheckbox = function(cb) {
    var id = cb.attr('id');
    var activeFilterArea = cb.closest('.select-filters').find('.active-filters');
    if (cb.hasClass('is-checked')) {
      cb.attr('aria-checked', false);
      $('#active_' + id).remove();
    }
    else {
      cb.attr('aria-checked', true);
      activeFilterArea.append(buildActiveFilter(cb.data('name'), id));
      $('#active_' + id).find('button').click(function(e) {
        var checkbox = $('#' + id);
        toggleCheckbox(checkbox);
        if (isMobile()) {
          if ($('.apply-filters').css('display') == "none")
            $('.apply-filters').velocity("slideDown", {duration: 300});
        }
        updateSearchResults();
      });
    }
    cb.toggleClass('is-checked');
    cb.parent().toggleClass('selected');
    updateScreenReaderFilterGroupText(cb.closest('.select-filters'));
  }

  var resetModalFilters = function() {
    var filterList= [];
    var urlParams = getUrlParameters();
    if (urlParams.filters) {
      filterList = urlParams.filters.split(',');
    }
    $('.filter-container .filter-cbx').each(function(index, value) {
      var checkbox = $(value);
      if (filterList.includes(checkbox.attr('id'))) {
        if (!checkbox.hasClass('is-checked')) {
          toggleCheckbox(checkbox);
        }
      }
      else {
        if (checkbox.hasClass('is-checked')) {
          toggleCheckbox(checkbox);
        }
      }
    });
  }

  var updateAlphaHeaders = function() {
    if ($('.filtered-results').data('headers')) {
      if ( $('.result.listitem-hidden').length > 0) {
        removeAlphaHeaders();
      }
      else {
        groupListItemsByHeader();
      }
    }
  }

  var gridViewShowMore = function(listitem) {
    var popup = $('#more-content-popup');
    $('.btnShowMoreContent').attr('aria-expanded', false);
    $('.listitem .image-container').removeClass('arrow');
    var containerOffset = $('.filterable-search').offset().top;
    var listitemOffset = listitem.offset().top;
    var imageHeight = listitem.find('.image-container').height();
    var popupOffset = (listitemOffset - containerOffset + imageHeight + 3) + "px";
    popup.css("top", popupOffset);
    var content = listitem.find('.info-container').html();
    popup.find('.popup-content').html(content);
    popup.find('#btn-close-more-content-popup').attr('data-item-id', listitem.attr('id'))
    popup.find('#btn-close-more-content-popup .hidden-title').text(listitem.find('.listitem-title').text())
    popup.show();
    listitem.find('.btnShowMoreContent').attr('aria-expanded', true);
    listitem.find('.image-container').addClass('arrow');
    $('#more-content-popup #btn-close-more-content-popup').focus();
    //expand result area if the popup overlaps the footer
    var fSearchContainer = $('.results').last();
    var footerTopOffset = Math.ceil($('footer').offset().top);
    var popupBottom = Math.ceil(popup.offset().top + popup.outerHeight()) + 2;
    if (popupBottom >= footerTopOffset) {
      var initialBottomPadding = fSearchContainer.css('padding-bottom');
      var adjustedBottomPadding = parseInt(initialBottomPadding) + (popupBottom - footerTopOffset) + 40 + "px";
      fSearchContainer.attr('data-initial-bottom-padding', fSearchContainer.css('padding-bottom'));
      fSearchContainer.css('padding-bottom', adjustedBottomPadding);
    }
  }

  $('#more-content-popup').focusout(function (e) {
    var tabbable = $('#more-content-popup').find(':tabbable');
    var first = tabbable.first();
    var last = tabbable.last();
    var targ = $(e.relatedTarget);
    if (targ.is('.fspopup-focusstart')) {
      last.focus();
    } else if (targ.is('.fspopup-focusend')) {
      first.focus();
    }
  })

  $('.filter-cbx').click(function(e) {
    var checkbox = $(this);
    toggleCheckbox(checkbox);
    updateSearchResults()
    if (isMobile()) {
      $('.btn-apply-filters').text('Apply Filters');
      if ($('.apply-filters').css('display') == "none")
        $('.apply-filters').velocity("slideDown", {duration: 300});
    }
  })

  $('.filter-label').click(function(e) {
    var checkbox = $(this).parent().find('.filter-cbx');
    toggleCheckbox(checkbox);
    if (!isMobile())
      updateSearchResults();
  })

  $('.filter-cbx').keydown(function(e) {
    if (e.which == 32 || e.which == 13) {
      e.preventDefault();
      toggleCheckbox($(e.target));
      updateSearchResults();
      if (isMobile()) {
        $('.btn-apply-filters').text('Apply Filters');
        if ($('.apply-filters').css('display') == "none")
          $('.apply-filters').velocity("slideDown", {duration: 300});
      }
    }
  })

  $('.btn-search-list-items').click(function(e) {
    updateSearchResults();
  })

  $('#search-field, #mobile-search-field').keyup(function(e) {
    if (e.keyCode == 13) {
      updateSearchResults();
    }
    else {
      if ($(this).val().length > 0) {
        $('.btn-clear-search-field').show();
      }
      else {
        $('.btn-clear-search-field').hide();
        var params = getUrlParameters();
        params.q="";
        history.pushState(null, null, createUrlQuery(params));
        updateSearchResults();
      }
    }
  })

  //Clear all Filters
  $('.btn-clear-filters').click(function(e) {
    clearFilters();
  })

  $('.btn-close-modal').click(function(e) {
    searchArea.removeClass('filters-open');
    $('.apply-filters').css("display", "none");
    filterToggleButton.attr('aria-expanded', false);
    //reset url parameters to what they were when the filter panel was opened
    history.pushState(null, null, createUrlQuery(mobileUrlParams));
    mobileUrlParams = {};
    resetModalFilters();
    updateSearchResults();
    filterToggleButton.focus();
  });

  $('.btn-apply-filters').click(function(e) {
    searchArea.removeClass('filters-open');
    $('.apply-filters').css("display", "none");
    filterToggleButton.attr('aria-expanded', false);
    filterToggleButton.focus();
  });

  $('.btn-clear-search-field').click(function(e) {
    $('#search-field, #mobile-search-field').val("");
    $('.btn-clear-search-field').hide();
    updateSearchResults();
    var params = getUrlParameters();
    params.q="";
    history.pushState(null, null, createUrlQuery(params));
    $(this).prev('input').focus();
  })

  $('.btn-grid-view').click(function(e) {
    var filterableSearch = $('.filterable-search')
    filterableSearch.removeClass('list-view');
    filterableSearch.addClass('grid-view');
    $('.btn-list-view').prop('disabled', false);
    setTimeout(function() {
      $('.btn-list-view').focus();
      $('.btn-grid-view').prop('disabled', true);
    }, 50)
    setImageContainerSize()
  });

  $('.btn-list-view').click(function(e) {
    var filterableSearch = $('.filterable-search')
    filterableSearch.removeClass('grid-view');
    filterableSearch.addClass('list-view');
    $('.btn-grid-view').prop('disabled', false);
    setTimeout(function() {
      $('.btn-grid-view').focus();
      $('.btn-list-view').prop('disabled', true);
    }, 50)
    setImageContainerSize()
  })

  $('#btn-close-more-content-popup').click(function() {
    closeMoreContentPopup();
  });

  $('#more-content-popup').keydown(function(e) {
    if (e.keyCode == KeyCodes.ESCAPE) {
      var itemId = $('#btn-close-more-content-popup').attr('data-item-id');
      closeMoreContentPopup();
    }
  })

  var closeMoreContentPopup = function() {
    $('#more-content-popup').hide();
    $('.listitem .image-container').removeClass('arrow');
    var fSearchContainer = $('.results').last();
    var itemId = $('#btn-close-more-content-popup').attr('data-item-id');
    $('#btn-close-more-content-popup').removeAttr('data-item-id');
    $('#' + itemId).find('.btnShowMoreContent').attr('aria-expanded', false);
    $('#' + itemId).find('.btnShowMoreContent').focus();
    if (fSearchContainer.data('initial-bottom-padding')) {
      var initialBottomPadding = fSearchContainer.data('initial-bottom-padding');
      fSearchContainer.css('padding-bottom', initialBottomPadding);
      fSearchContainer.removeAttr('data-initial-bottom-padding');
    }
  }

  var addMoreContentEventHandlers = function() {
    $('.btnShowMoreContent').click(function() {
      var listitem = $(this).closest('.listitem')
      if("false" == $(this).attr('aria-expanded')) {
        gridViewShowMore(listitem)
      }
      else {
        closeMoreContentPopup();
      }
    })
  }

  var groupListItemsByHeader = function() {
    if ($('#result-list .alpha-header').length > 0) return
    var html = $('<div>')
    var activeAnchors = [];
    var fullList = $('#result-list ul.results');
    var firstItem = $('.filtered-results .listitem').first();
    var firstItemText = firstItem.find("*[data-alpha='true']").text().trim().replace(/^the /i, '');
    var currentLetter = firstItemText.charAt().toUpperCase();
    activeAnchors.push(currentLetter);
    html.append('<a id="anchor-' + currentLetter + '" class="alpha-header" aria-hidden="true">'+ currentLetter +'</a>');
    var currentAlphaList = $('<ul class="results">').appendTo(html);
    fullList.children('li').each(function(index, item) {
      var text = $(item).find("*[data-alpha='true']").text().trim().toUpperCase().replace(/^THE\s/i, '');
      var firstLetter = text.charAt();
      if (firstLetter != currentLetter) {
        currentLetter = firstLetter;
        activeAnchors.push(currentLetter);
        html.append('<a id="anchor-' + currentLetter + '"class="alpha-header">'+ currentLetter +'</a>');
        currentAlphaList = $('<ul class="results">').appendTo(html);
      }
      $(item).detach().appendTo(currentAlphaList)
    });
    fullList.replaceWith(html)
    buildAlphaAnchors(activeAnchors);
    addMoreContentEventHandlers();
  }

  var removeAlphaHeaders = function() {
    var html = $('<ul class="results">');
    var results = $('#result-list .result');
    results.each(function(index, item) {
      $(item).detach().appendTo(html)
    })
    $('#result-list').html("")
    html.appendTo($('#result-list'));
    addMoreContentEventHandlers();
    //remove anchor letter links
    $('.alphabet-anchors').html("")
    $('.anchor-link-container').hide();
  }

  var buildAlphaAnchors = function(activeAnchors) {
    var html = '';
    $('.anchor-link-container').show();
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    $.each(alphabet, function(i, letter) {
      var last = (i == alphabet.length - 1 ) ? "last" : "";
      if (activeAnchors.indexOf(letter) > -1) {
        html += '<li><a class="anchor-letter active '+last +'" href="#anchor-' + letter + '">' + letter + '</a></li>';
      }
      else {
        html += '<li aria-hidden="true"><div class="anchor-letter '+ last +'">' + letter + '</div></li>';
      }
    })
    html += '';
    $('.alphabet-anchors').append(html);
    if ($('.alphabet-anchors')[0].scrollWidth > $('.filtered-results').width()) {
      $('.alpha-arrow.right').show();
    }
    $('.alpha-arrow.right').click(function() {
      $('.anchor-link-container').velocity('scroll', {axis: 'x', duration: 400, container: $('.alphabet-anchors'), offset: $('.anchor-link-container').width() - 80})
    })
    $('.alpha-arrow.left').click(function() {
      $('.anchor-link-container').velocity('scroll', {axis: 'x', duration: 400, container: $('.alphabet-anchors'), offset: -$('.anchor-link-container').width() + 80})
    })
    $('.anchor-letter.active').click(function(e) {
      e.preventDefault();
      var anchor = $($(this).attr('href'));
      var headerHeight = (window.stickynavheight || 0) + 5;
      $('html').velocity('scroll', { duration: 400, offset: (anchor.offset().top-headerHeight)+'px' });
    })
  }

  var toggleArrows = function() {
    var anchorContainer = $('.anchor-link-container');
    var alphabetLinks = $('.alphabet-anchors');
    if (Math.abs(alphabetLinks.scrollLeft() - (alphabetLinks[0].scrollWidth - anchorContainer.width())) < 0.5)
      $('.alpha-arrow.right').hide();
    else {
      $('.alpha-arrow.right').show();
    }
    if (alphabetLinks.scrollLeft() > 0) {
      $('.alpha-arrow.left').show();
    }
    else {
      $('.alpha-arrow.left').hide();
    }
  }
  resizeTimeout(toggleArrows)
  $('.alphabet-anchors').scroll(toggleArrows)

  $('.alphabet-anchors').on("touchstart", function(e) {
    if ($(e.target).closest('.alpha-arrow').length == 0) {
      $('.alpha-arrow').addClass('touch');
    }
  })

  //on initial page load
  var urlParams = getUrlParameters();
  if (!(urlParams.q && urlParams.q.length > 0) && !urlParams.filters) {
    updateResultsShown();
    if ($('.filtered-results').data('headers')) {
      groupListItemsByHeader();
    }
    else {
      addMoreContentEventHandlers();
    }
    updateStripes();
  }
  else {
    var query = urlParams.q || "";
    $('#search-field,#mobile-search-field').val(query);
    if (query.length > 0) {
      $('.btn-clear-search-field').show();
    }
    if (urlParams.filters) {
      var filterList = urlParams.filters.split(',');
      updateActiveFilters(filterList);
      filterList.map(function(filterId) {
        var field = $('#' + filterId);
        toggleCheckbox(field);
        $('.filter-count').text("(" + filterList.length + ")")
        var filterButtonAriaLabel = "Search Filters: " + filterList.length + ((filterList.length == 1) ? " filter " : " filters ") + "currently selected";
        $('.btn-toggle-filters').attr('aria-label', filterButtonAriaLabel)
      })
    }
    updateSearchResults();
  }
  $('.select-filters').each(function() {
    var group = $(this);
    updateScreenReaderFilterGroupText(group);
  })

  var setImageContainerSize = function() {
    $('.filterable-search .results .result .listitem .image-container').each(function() {
      var el = $(this);
      el.css('height', el.css('width'))
    })
  }
  resizeTimeout(setImageContainerSize)
});

const stopwords = {
  myself: true,
  our: true,
  ours: true,
  ourselves: true,
  you: true,
  your: true,
  yours: true,
  yourself: true,
  yourselves: true,
  him: true,
  his: true,
  himself: true,
  she: true,
  her: true,
  hers: true,
  herself: true,
  its: true,
  itself: true,
  they: true,
  them: true,
  their: true,
  theirs: true,
  themselves: true,
  what: true,
  which: true,
  who: true,
  whom: true,
  this: true,
  that: true,
  these: true,
  those: true,
  are: true,
  was: true,
  were: true,
  been: true,
  being: true,
  have: true,
  has: true,
  had: true,
  having: true,
  does: true,
  did: true,
  doing: true,
  the: true,
  and: true,
  but: true,
  because: true,
  until: true,
  while: true,
  for: true,
  with: true,
  about: true,
  against: true,
  between: true,
  into: true,
  through: true,
  during: true,
  before: true,
  after: true,
  above: true,
  below: true,
  from: true,
  down: true,
  out: true,
  off: true,
  over: true,
  under: true,
  again: true,
  further: true,
  then: true,
  once: true,
  here: true,
  there: true,
  when: true,
  where: true,
  why: true,
  how: true,
  all: true,
  any: true,
  both: true,
  each: true,
  few: true,
  more: true,
  most: true,
  other: true,
  some: true,
  such: true,
  nor: true,
  not: true,
  only: true,
  own: true,
  same: true,
  than: true,
  too: true,
  very: true,
  can: true,
  will: true,
  just: true,
  don: true,
  should: true,
  now: true
}
