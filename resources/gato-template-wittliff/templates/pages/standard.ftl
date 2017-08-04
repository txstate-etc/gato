[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html lang="en">
  <head>
    [@templatejs scripts=['gato-template-wittliff/js/wittliff.js']/]
    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-wittliff/css/standard.compiled.css"/>
    [@templatehead publisher="The Wittliff Collections"/]
  </head>
  <body>
    [#include "includes/header.ftl"]
    <div class="content-alignment" data-sidebar-width-percentage="22"></div>
    [#assign hideSidebar = content.hideSidebar!false]
    <main class="contentcolumn">
      [@headline /]
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
    [#include "includes/footer.ftl"]
    [@cssjsmodals /]
  </body>
</html>
