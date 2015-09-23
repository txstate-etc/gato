[#include "/gato-template/templates/includes/component.ftl"]

[@templatecomponent]
  [#if content.title?has_content]
    <h2>${content.title}</h2>
  [/#if]
  
  <ul class="txst-gallery" >
    [#list model.images as image ]
      <li class="txst-gallery-image">
        <a href="${image.largeUrl}" title="${image.caption!''}" data-size="${image.sizeAttr}">
          <img src="${image.thumbUrl}" 
               class="txst-multiresolution-image" 
               alt="${image.alt}" 
               border="0" 
               style="width: 100px; height: 100px;"
          />
        </a>
      </li>
    [/#list]
  </ul>
  
  [#include "/gato-lib/templates/includes/pswpmodal.ftl"]
  
[/@templatecomponent]
