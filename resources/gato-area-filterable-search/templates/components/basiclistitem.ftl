[#assign tags = gf.propertyValues(content.tags![])]
[#if cmsfn.isEditMode()]
<div cms:edit="bar"></div>
[/#if]
<div class="listitem" data-tags="${tags?join(",")}" data-keywords="[#if content.keywords?has_content]${content.keywords?join(',')}[/#if]">
  <div class="image-container">
  [#if content.includeImage?? && content.includeImage == "hasImage" && content.image?has_content]
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
    <img class="default-image" src="${ctx.contextPath}/.resources/gato-area-filterable-search/images/star-placeholder.jpg" alt="No Image Provided for ${content.title}" aria-hidden="true" />
  [/#if]
  </div>
  <div class="info-container">
    [#if content.link?has_content]
      <a href="${gf.filterUrl(content.link)}">
    [/#if]
    <div class="listitem-title" data-searchable="true" data-alpha="true">
      ${content.title}
    </div>
    [#if content.link?has_content]
      </a>
    [/#if]
    [#if content.description?has_content]
      <div class="listitem-description" data-searchable="true">
        ${cmsfn.decode(content).description}
      </div>
    [/#if]
  </div>
</div>
