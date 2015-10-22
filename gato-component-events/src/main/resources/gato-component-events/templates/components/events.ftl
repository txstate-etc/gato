[#if !faqButtonsAdded!false]
  <div class="gato-faq-expand-collapse">
    <a href="#" id="txst-expand-all-faqs">Expand</a> or
    <a href="#" id="txst-collapse-all-faqs">Collapse</a> all.
  </div>
  [#global "faqButtonsAdded" = true]
[/#if]

[#if content.title?has_content]
  <h2>${content.title}</h2>
[/#if]

[#if model.error?has_content]

  <div class="txst-events-error">
    There was an error retrieving the event feed.
  </div>

[#else]

  [#if model.items?has_content]
    [#assign displayStyleClass="txst-eventdetail-${content.displayStyle?lower_case}style"]
    
    [#list model.items as item]
      [#assign eventClass=item.cancelled?string('txst-eventdetail-cancelled','vevent')]
    
      <div class="txst-eventdetail ${eventClass} ${displayStyleClass}">

        <div class="txst-eventdetail-mainbox">
          <h3 class="txst-eventdetail-title">
            ${item.cancelled?string('CANCELLED - ','')}
            <span class="summary">
              ${item.title}
            </span>
          </h3>
          <div class="txst-eventdetail-dates">
            <abbr class="dtstart" title="${item.machineStartDate}">
              ${item.humanStartDate}
            </abbr>
            [#if item.showEndDate]
              &ndash;
              <abbr class="dtend" title="${item.machineEndDate}">
                ${item.humanEndDate}
              </abbr>
            [/#if]
          </div>
          [#if item.description?has_content]
            <div class="txst-eventdetail-description description">
              [#if item.image?has_content]
                <img class="txst-eventdetail-thumbnail" 
                  alt="${item.title}"
                  src="${item.image}" />
              [/#if]
              ${item.description}
              [#if item.link?has_content]
                <br/><br/>
                <a href="${item.link}" class="url">
                  Click here for more information
                </a>
              [/#if]
            </div>
          [/#if]
        </div>
        
        <div class="txst-eventdetail-detailsbox">
          [#if item.facility?has_content]
            <div class="txst-eventdetail-detailsboxheader">Location:</div>
            <div class="txst-eventdetail-detailsboxdata location">${item.facility}</div>
          [/#if]
          
          <div class="txst-eventdetail-detailsboxheader">Cost:</div>
          <div class="txst-eventdetail-detailsboxdata">${item.cost}</div>

          <div class="txst-eventdetail-detailsboxheader">Campus Sponsor:</div>
          <div class="txst-eventdetail-detailsboxdata">${item.sponsor}</div>

          <div class="txst-eventdetail-detailsboxheader">Contact:</div>
          <div class="txst-eventdetail-detailsboxdata">${item.contact}</div>

          <div class="txst-eventdetail-extra1"></div>
          
          <a title="add ${item.title} to your calendar"
            href="${item.calendarUrl}"
            class="txst-eventdetail-addtocalendar">
            [add to your calendar]
          </a>
        </div>
        
        <div class="txst-eventdetail-extra2"></div>
        <div class="txst-eventdetail-togglebutton"></div>
        <div class="txst-eventdetail-footer"></div>
      </div>
    [/#list]
  [#else]
    <div class="txst-events-empty">
      No results.
    </div>
  [/#if]

[/#if]
