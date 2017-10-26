[#if model.error?has_content]

  <div class="txst-events-error">
    There was an error retrieving the event feed.
  </div>

[#elseif model.items?has_content]
  [#assign endDateHash = {}]
  [#assign recurrenceIdHash = {}]
  [#-- Copied from calendar content type --]
  [#if content.hideRepeats!false]
    [#list model.items as item]
      [#-- If the item's event ID is not in the hash or it has a later end date, save it in the hash --]
      [#if !endDateHash[item.eventId]?? || (endDateHash[item.eventId]?datetime < item.endDate?datetime)]
        [#assign endDateHash = endDateHash + {item.eventId : item.endDate}]
      [/#if]

      [#-- If the item's event ID has not been added yet or its first occurrence is before the current value --]
      [#if !recurrenceIdHash[item.eventId]?? || item.recurrenceId?number < recurrenceIdHash[item.eventId]?number]
        [#assign recurrenceIdHash = recurrenceIdHash + {item.eventId : item.recurrenceId}]
      [/#if]
    [/#list]
  [/#if]
<div class="wittliff-event-filters">
  <div class="month">
    <select name="month">
      <option value="">All Dates</option>
      [#list model.months as month]
        <option value="${month.key}">${month.name}</option>
      [/#list]
    </select>
  </div>
  <div class="category">
    <select name="category">
      <option value="">All Categories</option>
      [#list model.categories as cat]
        <option>${cat}</option>
      [/#list]
    </select>
  </div>
</div>
<div class="wittliff-event-list">
  [#list model.items as item]

    [#-- if content.hideRepeats is missing or false OR content.hideRepeats is true and this is the first/only recurrence of an event --]
    [#if (!content.hideRepeats?? || !content.hideRepeats) || (content.hideRepeats && recurrenceIdHash[item.eventId] == item.recurrenceId)]

      [#assign eventClass=item.cancelled?string('txst-eventdetail-cancelled','h-event vevent')]

      <div class="event ${eventClass}" data-month-key="${item.machineMonth}" data-categories="${item.categoryJson?html}">
        <div class="event-datetime">
          <time class="dt-start dtstart" datetime="${item.machineStartDate}">
             [#assign startDate = item.machineStartDate?datetime("yyyy-MM-dd'T'HH:mm:ssZ")]
             <div class="event-dow">${startDate?string["EEE"]}</div>
             <div class="event-day">${startDate?string["MMM d"]}</div>
             [#assign ampm = startDate?string['a']]
             [#assign marker = ("AM" == ampm)?string('a.m.', 'p.m')]
             <div class="event-time">${startDate?string['h:mm']} ${marker}</div>
          </time>
        </div>
        <div class="event-content" aria-expanded="false">
          <div class="event-category"></div>
          <div class="event-title">
            ${item.cancelled?string('CANCELLED - ','')}
            <span class="p-name summary">
              ${item.title}
            </span>
          </div>
          <a href="#" class="event-details">
            Event Details
            <i class="fa fa-cog"></i>
          </a>
          <div aria-hidden="true" style="display:none">
            [#if item.description?has_content]
              <div class="event-description">
                <span class="p-description">${item.description}</span>
                [#if item.link?has_content]
                  <a href="${item.link}" class="u-url url">
                    More Information
                  </a>
                [/#if]
              </div>
            [/#if]
            <div class="event-icon-links">
              <a title="add ${item.title} to calendar"
                  href="${item.calendarUrl}"
                  class="addtocalendar ${item.image?has_content?string("", "no-image")}">
                  <i class="fa fa-calendar" aria-hidden="true"></i>
                  <span class="linktext">Add to Calendar</span>
              </a>
            </div>
          </div>
        </div>
        <div class="event-image">
          [#if item.image?has_content]
              <img alt="${item.title}" src="${gf.getImg(item.image, 600, 0, false, false, 0, 0, 0, 0)}" />
          [/#if]
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
