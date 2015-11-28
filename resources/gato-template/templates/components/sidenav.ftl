[#include "/gato-template/templates/includes/component.ftl"]
<div class="side_nav ${content.title?has_content?string('nav-with-title','nav-without-title')}">
  [#if cmsfn.isEditMode() && ctx.inheritedfrom?has_content]
    <div class="inheritedalert">Inherited from ${gf.nodeTitle(ctx.inheritedfrom)}</div>
  [/#if]
  [#if content.type == 'auto2']
    [@navloop cmsfn.children(page, "mgnl:page") ; subpage]
      <h3 class="side_nav_header"><a href="${cmsfn.link(subpage)}">${gf.nodeTitle(subpage)}</a></h3>
      [#if gf.hasNavChildren(subpage)]
        <ul class="side_nav_list">
          [@navloop cmsfn.children(subpage, "mgnl:page") ; grandchild]
            <li><a href="${cmsfn.link(grandchild)}">${gf.nodeTitle(grandchild)}</a></li>
          [/@navloop]
        </ul>
      [/#if]
    [/@navloop]
  [#else]
    [#if content.title?has_content]
      <h3 class="side_nav_header">${cmsfn.decode(content).title}</h3>
    [/#if]
    <ul class="side_nav_list">
      [#-- loop through all the components and display them --]
      [#if content.type == 'auto']
        [@navloop cmsfn.children(page, "mgnl:page") ; subpage]
          <li><a href="${cmsfn.link(subpage)}">${gf.nodeTitle(subpage)}</a></li>
        [/@navloop]
      [#else]
        [@cms.area name="links"/]
      [/#if]
    </ul>
  [/#if]
</div>
