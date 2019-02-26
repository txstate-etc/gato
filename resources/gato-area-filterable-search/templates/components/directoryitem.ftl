[#assign tags = gf.propertyValues(content.tags![])]
[#if cmsfn.isEditMode()]
<div cms:edit="bar"></div>
[/#if]
<div class="listitem" data-tags="${tags?join(",")}" data-keywords="[#if content.keywords?has_content]${content.keywords?join(',')}[/#if]">
  <div class="image-container">
    [#if content.includeImage == "hasImage" && content.image?has_content]
      [#assign srcset = gf.getSrcSet(
          content.image,
          (content.imagecropleft!0)?number!0,
          (content.imagecropright!0)?number!0,
          (content.imagecroptop!0)?number!0,
          (content.imagecropbottom!0)?number!0,
          true
        )]
      <img src="${gf.getImgDefault(content.image)}" alt="${content.imageAlt!}" srcset="${srcset}" />
    [#else]
      <img class="default-image" src="${ctx.contextPath}/.resources/gato-area-filterable-search/images/star-placeholder.jpg" alt="No Image Provided for ${content.prefix!} ${content.firstname!} ${content.lastname!}" aria-hidden="true" />
    [/#if]
  </div>
  <div class="info-container">
    [#if content.link?has_content]
      <a href="${gf.filterUrl(content.link)}">
    [/#if]
    <div class="listitem-title" data-searchable="true">
      ${content.prefix!} ${content.firstname!} ${content.lastname!}
    </div>
    <div class="listitem-alpha" data-alpha="true">
      ${content.lastname!}${content.firstname!}
    </div>
    [#if content.link?has_content]
      </a>
    [/#if]
    [#if content.position?has_content]
      <div class="listitem-position" data-searchable="true">
        ${content.position}
      </div>
    [/#if]
    [#if content.email?has_content]
      <div class="listitem-email">
        Email: ${content.email}
      </div>
    [/#if]
    [#if content.office?has_content]
      <div class="listitem-office">
        Office: ${content.office}
      </div>
    [/#if]
    [#if content.phone?has_content]
      <div class="listitem-phone">
        Phone: ${content.phone}
      </div>
    [/#if]
    [#if content.description?has_content]
      <div class="listitem-description" data-searchable="true">
        ${cmsfn.decode(content).description}
      </div>
    [/#if]
  </div>
</div>
