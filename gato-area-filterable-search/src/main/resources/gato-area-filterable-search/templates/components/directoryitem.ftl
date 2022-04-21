[#assign tags = gf.propertyValues(content.tags![])]
[#if cmsfn.isEditMode()]
<div cms:edit="bar"></div>
[/#if]
<div class="listitem" data-tags="${tags?join(",")}" data-keywords="[#if content.keywords?has_content]${content.keywords?join(',')}[/#if]" id="${gf.uuidToHtmlId(content.@id)}">
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
      <img src="${gf.getImgDefault(content.image)}" alt="" srcset="${srcset}" />
    [#elseif content.includeImage == "fpimage" && content.fpimage?has_content]
      [#assign cropped = (content.fpfacedetected!false)?then("cropped", "")]
      [#assign wide = (content.fpfaceaspect?? && content.fpfaceaspect > 1)?then("wide", "")]
      [#assign style = (content.fpfacedetected!false)?then("left:-" + content.fpfaceleft + "%; top:-" + content.fpfacetop + "%; width:" + content.fpfacewidth + "%;", "")]
      <img class="fpimage ${cropped} ${wide}" src="${gf.getImg(content.fpimage, 600, 600, false, true, 0, 0, 0, 0)}" alt="" style="${style}"/>
    [#else]
      <img class="default-image" src="${ctx.contextPath}/.resources/gato-area-filterable-search/images/star-placeholder.jpg" alt="" aria-hidden="true" />
    [/#if]
    [#if content.email?has_content || content.office?has_content || content.phone?has_content || content.description?has_content]
    <button class="btnShowMoreContent" aria-haspopup="true" aria-expanded="false" aria-controls="more-content-popup" data-item-id="${gf.uuidToHtmlId(content.@id)}">
      <i class="fa fa-arrows-alt" aria-hidden="true"></i>
      <span class="visuallyhidden">Show more about ${content.prefix!} ${content.firstname!} ${content.lastname!}</span>
    </button>
    [/#if]
  </div>
  <div class="info-container">
    [#assign hasPronouns = content.pronouns?has_content && content.pronouns != 'None Selected']
    <div class="listitem-title ${hasPronouns?then('has-pronouns', '')}" data-searchable="true">
      [#if content.preferredname??]
        ${content.preferredname}
        [#assign displayname = content.preferredname]
      [#else]
        ${content.prefix!} ${content.firstname!} ${content.lastname!}
        [#assign displayname = "${content.prefix!} ${content.firstname!} ${content.lastname!}"]
      [/#if]
    </div>
    <div class="listitem-alpha" data-alpha="true">
      ${content.lastname!}${content.firstname!}
    </div>
    [#if hasPronouns]
      <div class="listitem-pronouns">
        ${content.pronouns}
      </div>
    [/#if]
    [#if content.position?has_content]
      <div class="listitem-position" data-searchable="true">
        ${content.position}
      </div>
    [/#if]
    [#if content.email?has_content]
      <div class="listitem-email">
        Email: <a href="mailto:${content.email}">${content.email}</a>
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
    [#assign scrolling=""]
    [#if (ctx.showbiography && content.biography?has_content) || (ctx.showteaching && content.teachinginterests?has_content) || (ctx.showresearch && content.researchinterests?has_content)]
      [#assign scrolling="scroll-area"]
    [/#if]
    <div class="${scrolling}">
      [#if ctx.showbiography && content.biography?has_content]
        <div class="listitem-biography">
          <div class="listitem-heading">Biography and Education</div>
          <div>${gf.tidyHTML(gf.truncateText(cmsfn.decode(content).biography, 300, "..."))}</div>
          [#if content.biography?length > 300]
            <a class="linktofp" href="${gf.filterUrl(content.fplink)}#biography">
              View Full Biography and Education<span class="visuallyhidden"> for ${displayname!}</span>
            </a>
          [/#if]
        </div>
      [/#if]
      [#if ctx.showteaching && content.teachinginterests?has_content]
        <div class="listitem-teaching">
          <div class="listitem-heading">Teaching Interests</div>
          <div>${gf.tidyHTML(gf.truncateText(cmsfn.decode(content).teachinginterests, 300, "..."))}</div>
          [#if content.teachinginterests?length > 300]
            <a class="linktofp" href="${gf.filterUrl(content.fplink)}#teaching">
              View Full Teaching Interests<span class="visuallyhidden"> for ${displayname!}</span>
            </a>
          [/#if]
        </div>
      [/#if]
      [#if ctx.showresearch && content.researchinterests?has_content]
        <div class="listitem-research">
          <div class="listitem-heading">Research Interests</div>
          <div>${gf.tidyHTML(gf.truncateText(cmsfn.decode(content).researchinterests, 300, "..."))}</div>
          [#if content.researchinterests?length > 300]
            <a class="linktofp" href="${gf.filterUrl(content.fplink)}#research">
              View Full Research Interests<span class="visuallyhidden"> for ${displayname!}</span>
            </a>
          [/#if]
        </div>
      [/#if]
      [#if content.links?has_content || content.fplink?has_content]
      <div class="links">
        <ul>
          [#if content.fplink?has_content]
          <li>
            <a href="${gf.filterUrl(content.fplink)}">View Full Profile<span class="visuallyhidden"> for ${displayname}</span></a>
          </li>
          [/#if]
          [#if content.links?has_content]
            [#list cmsfn.children(content.links) as lnk]
              <li>
                <a href="${gf.filterUrl(lnk.link)}">${lnk.text!}<span class="visuallyhidden">,${displayname!}</span></a>
              </li>
            [/#list]
          [/#if]
        </ul>
      </div>
      [/#if]
    </div>
  </div>
</div>
