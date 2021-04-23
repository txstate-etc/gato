<div class="gato-section-full">
  <div class="gato-section-centered">
    <div class="academic-calendar-container">
      <div>Filters</div>
      <table class="event-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Event</th>
          </tr>
        </thead>
        <tbody>
        [#list model.items as item]
          <tr>
            <td>${item.humanStartDate}</td>
            <td>
              <div style="display: flex; flex-direction: column;">
                <div class="event-title">${item.title}</div>
                [#if item.description?has_content]
                  <div class="event-description">${item.description}</div>
                [/#if]
            </div>
            </td>
          </tr>
        [/#list]
        </tbody>
      </table>
    </div>
  </div>
</div>