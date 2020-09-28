[#assign tags = gf.propertyValues(content.tags![])]
[#if cmsfn.isEditMode()]
<div cms:edit="bar"></div>
[/#if]
<div class="listitem" data-tags="${tags?join(",")}" data-keywords="[#if content.keywords?has_content]${content.keywords?join(',')}[/#if]" id="${gf.uuidToHtmlId(content.@id)}">
  [#assign usingImage = false]
  [#if content.includeImage?? && content.includeImage == "hasImage" && content.image?has_content]
    [#assign usingImage = true ]
  [/#if]
  <div class="image-container ${usingImage?then('', 'contains-default-image')}">
  [#if usingImage!false]
    [#assign srcset = gf.getSrcSet(
        content.image,
        (content.imagecropleft!0)?number!0,
        (content.imagecropright!0)?number!0,
        (content.imagecroptop!0)?number!0,
        (content.imagecropbottom!0)?number!0,
        true
      )]
    [#assign altText = content.imageAlt!]
    [#if content.imageAlt?? && content.imageAlt == content.title]
      [#assign altText = ""]
    [/#if]
    <img src="${gf.getImgDefault(content.image)}" alt="${altText}" srcset="${srcset}" />
  [#else]
    <img class="default-image" src="${ctx.contextPath}/.resources/gato-area-filterable-search/images/star-placeholder.jpg" alt="" aria-hidden="true" />
  [/#if]
  [#if content.description?has_content]
  <button class="btnShowMoreContent" aria-haspopup="true" aria-expanded="false" aria-controls="more-content-popup" data-item-id="${gf.uuidToHtmlId(content.@id)}">
    <i class="fa fa-arrows-alt" aria-hidden="true"></i>
    <span class="visuallyhidden">Show more about ${content.title}</span>
  </button>
  [/#if]
  </div>
  <div class="info-container">
    [#if content.link?has_content]
      <a href="${gf.filterUrl(content.link)}">
    [/#if]
    <div class="listitem-title no-margin" style="[#if !content.description?has_content]margin: 0[/#if]" data-searchable="true" data-alpha="true">
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
