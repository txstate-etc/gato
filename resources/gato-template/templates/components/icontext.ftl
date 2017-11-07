[#include "/gato-template/templates/includes/commonmacros.ftl"]
[#assign iconColor = content.color!"color1"]
[#assign float = content.align!"center"]

[#macro buildIconText]
    <div class="icontext-icon ${iconColor}">
        <i class="fa ${content.icon!'fa-paw'}" aria-hidden="true"></i>
    </div>
    [#if content.title?has_content]
        [@h2 class="icontext-title"]${content.title}[/@h2]
    [/#if]
    [#if content.text?has_content]
        <p class="icontext-text">
            ${content.text}
        </p>
    [/#if]
[/#macro]

[#if cmsfn.isEditMode()]
  <div cms:add="box"></div>
[/#if]
[#if content.link?has_content]
    <a href="${gf.filterUrl(content.link)}" class="icontext ${float}">
        [@buildIconText/]
    </a>
[#else]
    <div class="icontext">
        [@buildIconText/]
    </div>
[/#if]
