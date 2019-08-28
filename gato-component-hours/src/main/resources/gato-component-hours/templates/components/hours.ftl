<script type="text/javascript">
  if (!window.gato_hours_data) window.gato_hours_data = {};
  var data = ${model.getData()};
  for (var i = 0; i < data.length; i++) {
    var entry = data[i];
    entry.start = moment(entry.start);
    entry.end = moment(entry.end);
    entry.canceled = entry.className === 'canceled';
  }
  window.gato_hours_data['${content.calendarId?json_string}'] = {
    "title" : "${(cmsfn.decode(content).displayTitle!'')?json_string}",
    "today_abbreviated" : "${model.getAbbreviated()?json_string}",
    "today_full" : "${model.getFull()?json_string}",
    "currently_open" : ${model.isOpen()?string('true','false')},
    "pdf_link" : "${gf.filterUrl(content.pdflink!)?json_string}",
    "fullcalendar_data" : data
  };
</script>
<div class="gato-component-hours">
  <div class="words fadeInDown animated">
    <span class="short-description">${model.getAbbreviated()}</span>
  </div>
  <a class="full" data-calendarid="${content.calendarId}" href="${gf.filterUrl(content.hourstarget!'')}" title="Calendar of Hours" ><i aria-hidden="true" class="fa fa-clock-o"></i>All Hours</a></span>
</div>
