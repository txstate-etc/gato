[#import "/gato-template-txstate2015/templates/includes/headerImageLogic.ftl" as headerLogic]
<div class="${headerLogic.headerClass}">
	[@cms.area name="headerImage" /]
	<div class="title">
    <div class="dept_name">
      [@cms.area name="parentOrganization" content=gf.getOrCreateArea(homepage, 'parentOrganization') editable=isHomePage  /]
      <h1 class="office_name"><a href="${cmsfn.link(homepage)}">${gf.nodeTitle(homepage)}</a></h1>
    </div>
  </div>
</div>
