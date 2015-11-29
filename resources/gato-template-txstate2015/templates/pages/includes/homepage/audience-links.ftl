[#macro linkList links]
  <ul>
    [#list links as link]
      <li><a href="${gf.filterUrl(link.link)}">${gf.filterLinkTitle(link.text, link.link)}</a></li>
    [/#list]
  </ul>
[/#macro]

[#macro featuredLinksFuture links]
  [#local links = links?chunk(3)]
    
  <h3 class="sub-nav-guide">Undergraduate</h3>
  [@linkList links[0] /]
  
  [#if links?size > 1]
    <h3 class="sub-nav-guide grad-guide">Graduate</h3>
    [@linkList links[1] /]
  [/#if]
[/#macro]


[#macro audienceLinks name component]
  [#local decodedContent = cmsfn.decode(component)]

  <div id="audience-${name}" class="audience-link-section" role="menu" aria-hidden="true">
    <div class="audience-link-content">

      <div class="image-block">
        [#if component.imageLink?has_content]
          <a href="${gf.filterUrl(component.imageLink)}">
        [/#if]
          <img src="${gf.getImgDefault(component.image)}" srcset="${gf.getSrcSet(component.image)}" alt="${component.alttext!}">
        [#if component.imageLink?has_content]
          </a>
        [/#if]
        
        [#if component.caption?has_content]
          ${gf.processRichText(decodedContent.caption)}
        [/#if]
      </div>
      
      <div class="featured-links ${name}">
        [#if component.featuredLinks?has_content]    
          [#local featuredLinks = cmsfn.children(component.featuredLinks, "mgnl:contentNode")]
          [#local nested][#nested featuredLinks][/#local]
          [#if nested?has_content]
            ${nested}
          [#else /]
            [@linkList featuredLinks?sort_by("text") /]
          [/#if]
        [/#if]

        [#if component.buttonLink?has_content]
          <a class="featured-links-button" href="${gf.filterUrl(component.buttonLink)}">
            ${gf.filterLinkTitle(decodedContent.buttonText, component.buttonLink)}
          </a>
        [/#if]
      </div>
      
      [#if component.otherLinks?has_content]    
        [#local otherLinks = cmsfn.children(component.otherLinks, "mgnl:contentNode")?sort_by("text")]
        [#local collen = (otherLinks?size / 2)?ceiling]
        [#local otherLinks = otherLinks?chunk(collen)]
        [#list otherLinks as column]
          <div class="links-column">
            [@linkList column /]
          </div>
        [/#list]              
      [/#if]
    </div>
  </div>
[/#macro]
