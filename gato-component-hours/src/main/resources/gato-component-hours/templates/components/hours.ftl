[#--<a class="hours-full" href="#" data-calendarid="${content.calendarId}"><i class="fa fa-calendar"></i> More Hours</a>--]
<script type="text/javascript">
  var gato_hours_data = {
    "calendars" : [ {id: "${content.calendarId?json_string}"} ],
    "${content.calendarId?json_string}" : {
      "today_abbreviated" : "${model.getEvents(true)?json_string}",
      "today_full" : "${model.getEvents(false)?json_string}",
      "fullcalendar_data" : ${model.getFullCalendar(content.calendarId)}
    }
  };
</script>

