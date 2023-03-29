[#import "/gato-template-txstate2015/templates/includes/headerImageLogic.ftl" as headerLogic]
<div class="${headerLogic.headerClass} txstate-dept-title">
	[@cms.area name="headerImage" /]
	<div class="title">
    <div class="dept_name">
      [#if isHomePage]
        [@cms.area name="parentOrganization" content=gf.getOrCreateArea(homepage, 'parentOrganization') editable=isHomePage /]
      [#else]
        [#assign parentOrgContent = homepage.parentOrganization!homepage["organization-info"]!]
        [#if parentOrgContent?has_content]
          [@cms.area name="parentOrganization" content=parentOrgContent editable=false /]
        [/#if]
      [/#if]
      <span class="office_name"><a href="${cmsfn.link(homepage)}">${gf.nodeTitle(homepage)}</a></span>
    </div>
  </div>
</div>
