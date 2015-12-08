[#assign quickLinks = cmsfn.asContentMap(cmsfn.nodeByPath('/homepage-data/legal-links/quick-links', 'website'))]
[#assign quickLinks = cmsfn.children(quickLinks, "mgnl:component")?sort_by("text")]
[#assign requiredLinks = cmsfn.asContentMap(cmsfn.nodeByPath('/homepage-data/legal-links/required-links', 'website'))]
[#assign requiredLinks = cmsfn.children(requiredLinks, "mgnl:component")?sort_by("text")]
[#assign collen = (requiredLinks?size / 3)?ceiling]

[#macro linklist links]
  [#list links as component]
    <p><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></p>
  [/#list]
[/#macro]

<div id="legal-footer" class="content-row">
  <div class="content-row-content"> 
    <div class="eq-parent">

      <div class="eq-mn-1-1 eq-ml-1-4">
        <div id="quick-links" class="legal-links">
          [@linklist quickLinks /]
        </div>
      </div>
      
      [#if requiredLinks?has_content]
        [#list requiredLinks?chunk(collen) as column]
          <div class="eq-mn-1-1 eq-ml-1-4">
            <div class="legal-links">
              [@linklist column /]
            </div>
          </div>
        [/#list]
      [/#if]

    </div>

    <div class="member-statement">
      <a class="image-link" href="http://www.tsus.edu">
        <img src="${ctx.contextPath}/.resources/gato-template/images/tsus-member.png"/>
      </a>
    </div>

  </div>  
</div> 
