[#if content.title?has_content]
  <h2>${content.title}</h2>
[/#if]

<ul class="txst-gallery eq-parent">
  [#list model.images as image ]
    <li class="txst-gallery-image eq-xs-1-2 eq-sm-1-3 eq-md-1-5 eq-lg-1-8 eq-xl-1-12">
      <a href="${image.largeUrl}" title="${image.caption!''}" data-size="${image.sizeAttr}">
        <img src="${image.thumbUrl}" alt="${image.alt}" />
      </a>
    </li>
  [/#list]
</ul>

[#include "/gato-lib/templates/includes/pswpmodal.ftl"]
  
