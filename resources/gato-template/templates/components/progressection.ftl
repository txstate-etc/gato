[#include "/gato-template/templates/includes/component.ftl"]
[#include "/gato-template/templates/includes/commonmacros.ftl"]

<div class="performance">
  <div class="container">

  <h2><span>${content.title}</span></h2>
  <ul class="charts">
      [@cms.area name="links"/]
  </ul>

  </div>
</div>
