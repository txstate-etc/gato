[#include "/gato-template/templates/includes/component.ftl"]
[#include "/gato-template/templates/includes/commonmacros.ftl"]
<div class="grid__item">
  <div class="news">
    [#assign sectiontitle = "Latest News"]
    [#if content.title?has_content]
        [#assign sectiontitle = cmsfn.decode(content).title]
    [/#if]
    <h3><span>${sectiontitle}</span></h3>
    <ul class="news-list">
        [@cms.area name="links"/]
    </ul>
  </div>
</div>
