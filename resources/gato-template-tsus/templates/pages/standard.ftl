[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html>
  <head>
    [@templatejs scripts=[]/]
    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-tsus/css/standard.compiled.css"/>
    [@templatehead publisher="Texas State University System"/]
  </head>
  <body>
    [#include "includes/topbanner.ftl"]
    [@breadcrumbs hidetxstate=true /]
    [#assign showRightBar=!(def.parameters.isMailTemplate!false) && (cmsfn.isEditMode() || (content.rightbar!false))]
    <div class="tsus-columnparent ${(content.hideSidebar!false)?string('tsus-fullwidth','')} ${showRightBar?string('tsus-rightbar','')}">
			[#if !(content.hideSidebar!false)]
        <nav class="gato-navcolumn">
          [@cms.area name="navBlocks" /]
        </nav>
      [/#if]

      <main class="tsus-contentcolumn txst-styledcontent">
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
