[#include "/gato-template/templates/includes/component.ftl"]
[#include "/gato-template/templates/includes/commonmacros.ftl"]
<div class="side_nav ${(content.title?has_content || content.type == 'auto2')?string('nav-with-title','nav-without-title')}">
  [#if cmsfn.isEditMode() && ctx.inheritedfrom?has_content]
    <div class="inheritedalert">
      Inherited from ${gf.nodeTitle(ctx.inheritedfrom)} <a href="${cmsfn.link(ctx.inheritedfrom)}" role="navigation">Jump To Original</a>
    </div>
  [/#if]
  [#if content.type == 'auto2']
    [@navloop cmsfn.children(page, "mgnl:page") ; subpage]
      <h3 class="side_nav_header ${gf.hasNavChildren(subpage)?string('','solo')}"><a href="${cmsfn.link(subpage)}">${gf.nodeTitle(subpage)}</a></h3>
      [#if gf.hasNavChildren(subpage)]
        <ul class="side_nav_list">
          [@navloop cmsfn.children(subpage, "mgnl:page") ; grandchild]
            <li><a href="${cmsfn.link(grandchild)}">${gf.nodeTitle(grandchild)}</a></li>
          [/@navloop]
        </ul>
      [/#if]
    [/@navloop]
  [#else]
    [#assign haschildren = gf.hasComponents(content.links) || (content.type=='auto' && gf.hasNavChildren(page))]
    [#if content.title?has_content]
      <h3 class="side_nav_header ${haschildren?string('','solo')}">${cmsfn.decode(content).title}</h3>
    [/#if]
    [#if haschildren || cmsfn.isEditMode()]
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
  [/#if]
</div>
