[#include "/gato-template/templates/includes/commonmacros.ftl"]

[#macro formatTime date includeAMPM=true]
  [#if date?time?string['h:mma'] == "12:00AM"]
    Midnight
  [#elseif date?time?string['h:mma'] == "12:00PM"]
    Noon
  [#else]
    [#if !includeAMPM]
      ${date?time?string['h:mm']?replace(':00', '')}
    [#else]
      ${date?time?string['h:mm a']?replace(':00', '')?replace('PM', 'p.m.')?replace('AM', 'a.m.')}
    [/#if]
  [/#if]
[/#macro]

[#assign offset = 0]
[#if !gf.isEmptyString(content.title)]
  [@h2 class="event-list-title" offset=offset]${content.title}[/@h2]
  [#assign offset=offset + 1]
[/#if]

[#if !model.error?has_content && model.items?has_content]
  [#include "/gato-lib/templates/includes/accordion.ftl"]
[/#if]

[#if model.error?has_content]

  <div class="txst-events-error">
    There was an error retrieving the event feed.
  </div>

[#elseif model.items?has_content]
  [#assign endDateHash = {}]
  [#assign recurrenceIdHash = {}]

  [#if content.hideRepeats!false]
    [#list model.items as item]

      [#if item.seriesId?has_content]
        [#-- If the item's series ID is not in the hash or it has a later end date, save it in the hash --]
        [#if !endDateHash[item.seriesId]?? || (endDateHash[item.seriesId]?datetime < item.endDate?datetime)]
          [#assign endDateHash = endDateHash + {item.seriesId : item.endDate}]
        [/#if]

        [#-- If the item's series ID has not been added yet or its first occurrence is before the current value --]
        [#if !recurrenceIdHash[item.seriesId]?? || item.recurrenceId?number < recurrenceIdHash[item.seriesId]?number]
          [#assign recurrenceIdHash = recurrenceIdHash + {item.seriesId : item.recurrenceId}]
        [/#if]
      [/#if]
    [/#list]
  [/#if]

  <div class="accordion-controls">
    <a href="#" class="gato-accordion-toggle">
      <span class="action">Expand</span>
      <span class="visuallyhidden">Event List</span>
    </a>
  </div>
  <div class="gato-events">
  [#list model.items as item]
    [#-- if content.hideRepeats is missing or false OR content.hideRepeats is true and this is the first/only recurrence of an event --]
    [#if (!content.hideRepeats?? || !content.hideRepeats) || (content.hideRepeats && (!item.seriesId?has_content || recurrenceIdHash[item.seriesId] == item.recurrenceId))]
      [#assign eventClass=item.cancelled?string('txst-eventdetail-cancelled','h-event vevent')]
      [#assign eventDomId]e${item.recurrenceId}[/#assign]

      <div class="txst-eventdetail gato-accordion ${eventClass}"
          data-start-collapsed="${model.collapsed?string('true', 'false')}">

        <div class="gato-accordion-header">
          [@h2 class="txst-eventdetail-title" offset=offset]
            <a href="#" class="p-name summary" aria-haspopup="true" aria-expanded="${model.collapsed?string('false', 'true')}" aria-controls="${eventDomId}">
              ${item.title}
            </a>
          [/@h2]
          [#if item.allDay!false]
            <div class="txst-eventdetail-dates">
              [#assign actualEndDate = item.endDate]
              [#if item.endDate?time?string['HH:mm'] == "00:00"]
                [#assign actualEndDate = model.fixAllDayEventEndDate(item.endDate)]
              [/#if]
              [#if item.startDate?date?string != actualEndDate?date?string]
                [#if item.startDate?date?string['MMMM'] == actualEndDate?date?string['MMMM']]
                  <span class="dow-range">${item.startDate?date?string['EEEE']} &ndash; ${actualEndDate?date?string['EEEE']},</span>
                  <time class="dt-start dtstart">${item.startDate?date?string['MMMM']} ${item.startDate?date?string['d']}</time>
                   &ndash;
                  <time class="dt-end dtend">${actualEndDate?date?string['d']}</time>
                [#else]
                  <time class="dt-start dtstart">
                    ${item.startDate?date?string['EEEE, MMMM d']}
                  </time>
                  &ndash;
                  <time class="dt-end dtend">
                    ${actualEndDate?date?string['EEEE, MMMM d']}
                  </time>
                [/#if]
              [#else]
                <time class="dt-start dtstart">
                  ${item.startDate?date?string['EEEE, MMMM d']}
                </time>
              [/#if]
              [#-- If repeat events are hidden and this is a recurring event.  Don't show end date for one time events --]
              [#if (content.hideRepeats!false) && item.seriesId?has_content]
                <span class="repeat-event-enddate">
                  until ${abbrMonth(endDateHash[item.seriesId]?string('MMMM'))} ${endDateHash[item.seriesId]?string('d')}
                </span>
              [/#if]
            </div>
          [#else]
            <div class="txst-eventdetail-dates">
              [#if item.startDate?date?string['MMMM d yy'] == item.endDate?date?string['MMMM d yy']]
                <time class="dt-start dtstart" datetime="${item.machineStartDate}">
                  [#assign includeAMPM = !(item.startDate?date?string['a'] == item.endDate?date?string['a'])]
                  ${item.startDate?date?string['EEEE, MMMM d']}, [@formatTime item.startDate includeAMPM/]
                </time>
                &ndash;
                <time class="dt-end dtend">
                  [@formatTime item.endDate/]
                </time>
              [#else]
                <time class="dt-start dtstart" datetime="${item.machineStartDate}">
                  ${item.startDate?date?string['EEEE, MMMM d']}, [@formatTime item.startDate/]
                </time>
                &ndash;
                <time class="dt-end dtend" datetime="${item.machineEndDate}">
                  ${item.endDate?date?string['EEEE, MMMM d']}, [@formatTime item.endDate/]
                </time>
              [/#if]
              [#-- If repeat events are hidden and this is a recurring event.  Don't show end date for one time events --]
              [#if (content.hideRepeats!false) && item.seriesId?has_content]
                <span class="repeat-event-enddate">
                  until ${abbrMonth(endDateHash[item.seriesId]?string('MMMM'))} ${endDateHash[item.seriesId]?string('d')}
                </span>
              [/#if]
            </div>
          [/#if]
        </div>
        <div class="gato-accordion-content" id="${eventDomId}">

          <div class="thumb-container">
            [#if item.image?has_content]
              <div class="txst-eventdetail-thumbnail">
                <img alt="${item.title}" src="${gf.getImg(item.image, 600, 0, false, false, 0, 0, 0, 0)}" />
              </div>
            [/#if]

            <a title="add ${item.title} to calendar"
              href="${item.calendarUrl}"
              class="txst-eventdetail-addtocalendar ${item.image?has_content?string("", "no-image")}">
              <i class="fa fa-calendar" aria-hidden="true"></i>
              <span class="linktext">add to calendar</span>
            </a>
          </div>

          <div class="detail-container">
            <dl class="txst-eventdetail-detailsbox">
              [#if item.facility?has_content]
                <dt>Location:</dt>
                <dd class="p-location">${item.facility}</dd>
              [/#if]

              <dt>Cost:</dt>
              <dd>${item.cost}</dd>

              <dt>Contact:</dt>
              <dd>${item.contact}</dd>
              [#if item.sponsor?has_content]
                <dt>Campus Sponsor:</dt>
                <dd>${item.sponsor}</dd>
              [/#if]
            </dl>
          </div>

          [#assign itemlink = item.link]
          [#if item.description?has_content]
            <div class="txst-eventdetail-description">
              <span class="p-description">${item.description}</span>
              [#if itemlink?has_content]
              <a href="${itemlink}" class="u-url url">
                Click here for more information
              </a>
              [/#if]
            </div>
          [/#if]

          <a class="txst-eventdetail-morelink" href="${itemlink}">
            <span class="linktext">more about event</span>
            <i class="fa fa-angle-right" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    [/#if]
  [/#list]
  </div>
[#else]

  <div class="txst-events-empty">
    No results.
  </div>

[/#if]

[#function abbrMonth month]
  [#assign val=""/]
  [#switch (month?lower_case)]
    [#case "january"]
      [#assign val="Jan."/]
      [#break]
    [#case "february"]
      [#assign val="Feb."/]
      [#break]
    [#case "march"]
    [#case "april"]
    [#case "may"]
    [#case "june"]
    [#case "july"]
      [#assign val = month/]
      [#break]
    [#case "august"]
      [#assign val="Aug."/]
      [#break]
    [#case "september"]
      [#assign val="Sept."/]
      [#break]
    [#case "october"]
      [#assign val="Oct."/]
      [#break]
    [#case "november"]
      [#assign val="Nov."/]
      [#break]
    [#case "december"]
      [#assign val="Dec."/]
      [#break]
  [/#switch]
  [#return val]
[/#function]
