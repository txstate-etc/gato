<div class="gato-hours">
[#if content.title?has_content]<h3>${content.title}</h3>[/#if]
${model.getEvents(false)}
<a class="hours-full" href="#" data-hours="${model.getFullCalendar(content.calendarId)}"><i class="fa fa-calendar"></i> More Hours</a>
</div>
