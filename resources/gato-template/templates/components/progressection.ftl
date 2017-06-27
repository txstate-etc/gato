[#include "/gato-template/templates/includes/component.ftl"]
[#include "/gato-template/templates/includes/commonmacros.ftl"]
[#assign background_color = content.color!"color1"]
<h1>${background_color}</h1>
<div class="performance ${background_color}">
  <div class="container">

  <h2><span>${content.title}</span></h2>
  <ul class="charts">
      [@cms.area name="links"/]
  </ul>

  </div>
</div>
