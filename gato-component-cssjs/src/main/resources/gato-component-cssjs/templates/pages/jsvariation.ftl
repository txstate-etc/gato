[#include "/gato-template/templates/includes/head.ftl"]
${ctx.response.setContentType('application/javascript; charset=UTF-8')}
[#compress]
  [@customJS page ancestorstopdown /]
[/#compress]
