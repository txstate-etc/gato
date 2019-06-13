[#include "/gato-template/templates/includes/commonmacros.ftl"]
[#if cmsfn.isEditMode()]<div cms:edit></div>[/#if]
[#if content.title?has_content]
<div class="mobilefirst-pattern">
  <div class="pattern-content single">
    <div class="explore">
      <div class="explore-bar">
        <div class="left">
        [@h2 class="explore-title"]${content.title}[/@h2]
        </div>
        [#if content.links?has_content]
          <div class="links explore-title">
            <ul>
            [#list cmsfn.children(content.links) as lnk]
              <li>
                <a href="${gf.filterUrl(lnk.link)}">${lnk.text!}  <i class="arrow right"></i></a>
              </li>
            [/#list]
            </ul>
          </div>
        [/#if]
      </div>
      [/#if]
      [#if content.caption?has_content]
        <p>${content.caption}</p>
      [/#if]
      <div class="explore-flex">
      [@cms.area name="exploreLeft"/]
      [@cms.area name="exploreRight"/]
      </div>
    </div>
  </div>
</div>