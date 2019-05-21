[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html lang="en">
  <head>
    [@templatejs scripts=['gato-template-tsus/js/table-hover.js', 'gato-template-tsus/js/fixlineup.js']/]
    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-tsus/css/standard.compiled.css"/>
    [@templatehead publisher="Texas State University System"/]
  </head>
  <body class="${cmsfn.isEditMode()?string('admin', '')}">
    [#include "includes/topbanner.ftl"]
    [@breadcrumbs hidetxstate=true /]
    [#assign showRightBar=!(def.parameters.isMailTemplate!false) && (cmsfn.isEditMode() || (content.rightbar?? && cmsfn.children(content.rightbar, 'mgnl:component')?size > 0))]
    <div class="tsus-columnparent ${(content.hideSidebar!false)?string('tsus-fullwidth','')} ${showRightBar?string('tsus-rightbar','')}">
			[#if !(content.hideSidebar!false)]
        <nav class="gato-navcolumn">
          [@cms.area name="navBlocks" /]
        </nav>
      [/#if]

      <main class="tsus-contentcolumn txst-styledcontent">
				[#if !gf.isEmptyString(content.title) && !isHomePage && !(content.hideTitle!false)]
					<h1 id="maincontent" class="tsus-page-title">${content.title}</h1>
        [#else]
          <h1 id="maincontent" class="visuallyhidden">Main content</h1>
				[/#if]
        [#if def.parameters.isMailTemplate!false]
          [@cms.area name="mail" /]
        [#else]
          [@cms.area name="contentParagraph" /]
        [/#if]
      </main>

      [#if showRightBar]
        <div class="tsus-rightcolumn txst-styledcontent">
          [@cms.area name="rightbar" /]
        </div>
      [/#if]
    </div>
    [#include "includes/footer.ftl"]
    [@cssjsmodals /]
  </body>
</html>
