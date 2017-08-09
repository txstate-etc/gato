[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html lang="en">
  <head>
    [@templatejs scripts=['gato-template-wittliff/js/wittliff.js']/]
    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-wittliff/css/standard.compiled.css"/>
    [@templatehead publisher="The Wittliff Collections"/]
  </head>
  <body class="template-wittliff">
    [@skipnav/]
    [#include "includes/header.ftl"]
    <div class="page_content">
      [#assign hideSidebar = content.hideSidebar!false]
      [#if !cmsfn.isEditMode() && !gf.areaHasChildrenIncludingInheritance(content.navBlocks)]
        [#assign hideSidebar = true]
      [/#if]
      <main class="contentcolumn">
        [@headline hideSidebar /]
        [#if def.parameters.isMailTemplate!false]
          [@cms.area name="mail" /]
        [#else]
          [@cms.area name="contentParagraph" contextAttributes={"hideSidebar":hideSidebar} /]
        [/#if]
      </main>

      [#if !hideSidebar]
        <aside class="sidebar-container">
          <div class="sidebar">
            [@cms.area name="navBlocks" /]
          </div>
        </aside>
      [/#if]
    </div>
    [#include "includes/footer.ftl"]
    [@cssjsmodals /]
  </body>
</html>
