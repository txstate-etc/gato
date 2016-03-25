[#assign globalLinks = cmsfn.asContentMap(cmsfn.nodeByPath('/homepage-data/global-links', 'gatoapps'))]
[#if cmsfn.isEditMode()]
  <div class="footerLinks_admin" cms:add="box">
    [#if component?has_content]
      [@cms.component content=component /]
    [/#if]
  </div>
[/#if]

[#assign linkGroup = 'option1']
[#if component??]
  [#assign linkGroup = component.linkGroup]
[/#if]

[#if linkGroup == 'option1']
    [#assign linkList = cmsfn.children(globalLinks.footerLinksPrimary, "mgnl:component")]
[#else]
    [#assign linkList = cmsfn.children(globalLinks.footerLinksSecondary, "mgnl:component")]
[/#if]

<ul class="foot_linkage">
    [#list linkList as component ]
      <li><a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.text, component.link)}</a></li>
[/#list]
</ul>
[#if linkGroup == 'option1']
    <a class="apply_now" href="http://www.txstate.edu/admissions#apply">Apply Now</a>
[#else]
    <a class="apply_now about_txstate" href="http://www.txstate.edu/about">About Texas State</a>
[/#if]