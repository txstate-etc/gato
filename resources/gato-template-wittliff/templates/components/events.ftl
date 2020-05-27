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
    <label for="selectmonth" class="visuallyhidden">Select Month</label>
    <select name="month" id="selectmonth">
      <option value="">All Dates</option>
      [#list model.months as month]
        <option value="${month.key}">${month.name} (${month.count} Event${(month.count != 1)?string('s','')})</option>
      [/#list]
    </select>
  </div>[#--
  --]<div class="category">
    <label for="selectcategory" class="visuallyhidden">Select Category</label>
    <select name="category" id="selectcategory">
      <option value="">All Categories</option>
      [#list model.categories as cat]
        [#if cat == "Music" || cat == "Photography" || cat == "Literary"]
          <option>${cat}</option>
        [/#if]
      [/#list]
      <option>Other</option>
    </select>
  </div>
</div>
<div class="wittliff-event-list">
  [#list model.items as item]

    [#-- if content.hideRepeats is missing or false OR content.hideRepeats is true and this is the first/only recurrence of an event --]
    [#if (!content.hideRepeats?? || !content.hideRepeats) || (content.hideRepeats && recurrenceIdHash[item.eventId] == item.recurrenceId)]

      [#assign eventClass=item.cancelled?string('txst-eventdetail-cancelled','h-event vevent')]

      <div class="event ${eventClass}" data-month-key="${item.machineMonth}" data-categories="${item.categoryJson?html}" id="event-${item.recurrenceId}">
        <div class="event-datetime">
          <time class="dt-start dtstart" datetime="${item.machineStartDate}">
             [#assign startDate = item.machineStartDate?datetime("yyyy-MM-dd'T'HH:mm:ssZ")]
             <div class="event-dow">${startDate?string["EEE"]}</div>
             <div class="event-day">${startDate?string["MMM d"]}</div>
             <div class="event-time">${gf.formatTime(startDate)}</div>
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
            [#if cmsfn.isEditMode()]
              <div class="txst-khan-notice">Anchor for linking to this event: #event-${item.recurrenceId}</div>
            [/#if]
            [#if item.facility?has_content]
            <div class="event-location">
              <span class="event-label">Location:</span> <div>${item.facility}</div>
            </div>
            [/#if]
            [#if item.contact?has_content]
            <div class="event-contact">
              <span class="event-label">Contact:</span> <div>${item.contact}</div>
            </div>
            [/#if]
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
              <a class="share bottom" href="#" aria-haspopup="true" aria-controls="gato-share-panel" data-gato-share-link="${item.url!}" data-gato-share-subject="${item.title!}" data-gato-share-text="Event at The Wittliff Collections: ${item.title!}" data-gato-share-image="${gf.filterUrl(item.image)}"><i class="fa fa-share-square-o" aria-hidden="true"></i> Share</a>
              <a title="add ${item.title} to calendar"
                  href="${item.calendarUrl}"
                  class="addtocalendar ${item.image?has_content?string("", "no-image")}">
                  <i class="fa fa-calendar" aria-hidden="true"></i>
                  <span class="linktext">Add to Calendar</span>
              </a>
              [#if item.facility?contains('ALK')]
                <a class="directions" href="${gf.filterUrl('/wittliff/plan-your-visit.html')}#f103b6add"><i class="fa fa-map-marker" aria-hidden="true"></i> Directions & Parking</a>
              [/#if]
            </div>
          </div>
        </div>
        <div class="event-image">
          [#if item.image?has_content]
              <img alt="" src="${gf.getImg(item.image, 600, 0, false, false, 0, 0, 0, 0)}" />
          [/#if]
        </div>
      </div>
    [/#if]
  [/#list]
  <div class="events-empty">
    There are currently no events based on your selection. Additional events are always being planned and may be visible here in the near future. Please refine your search and try again.
  </div>
</div>
[#else]
  <div class="wittliff-events-empty">
    There are currently no upcoming events. Additional events are always being planned and may be visible here in the near future.
  </div>
[/#if]
