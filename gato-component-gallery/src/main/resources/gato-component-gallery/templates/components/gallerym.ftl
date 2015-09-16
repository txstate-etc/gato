[#include "/gato-template/templates/includes/component.ftl"]

[@templatecomponent]
  [#if content.title?has_content]
    <h2>${content.title}</h2>
  [/#if]
  
  <div class="txst-photogallery" data-path="${cmsfn.asJCRNode(content).path}">
    [#list model.images as image ]
      <div class="txst-photogallery-image">
        <a href="${image.largeUrl}" title="${image.caption!''}" rel="${image.rel!''}">
          <img src="${image.thumbUrl}" 
               class="txst-multiresolution-image" 
               alt="${image.alt}" 
               border="0" 
               style="width: 100px; height: 100px;"
          />
        </a>
      </div>
    [/#list]
  </div>

[/@templatecomponent]
