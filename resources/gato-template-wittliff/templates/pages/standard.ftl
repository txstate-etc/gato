[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html lang="en">
  <head>
    [@templatejs scripts=['gato-template-wittliff/js/wittliff.js']/]
    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-wittliff/css/wittliff-standard.compiled.css"/>
    [@templatehead publisher="The Wittliff Collections"/]
  </head>
  <body>
    [#include "includes/header.ftl"]
    <div class="page_content">
      <div class="content-alignment" data-sidebar-width-percentage="22"></div>
      [#assign hideSidebar = content.hideSidebar!false]
      <main class="tsus-contentcolumn txst-styledcontent">
        [#if def.parameters.isMailTemplate!false]
          [@cms.area name="mail" /]
        [#else]
          [@cms.area name="contentParagraph" contextAttributes={"hideSidebar":hideSidebar} /]
        [/#if]
      </main>

      [#if hideSidebar == false]
        <aside class="sidebar">
          [@cms.area name="navBlocks" /]
        </aside>
      [/#if]
    </div>
    [#include "includes/footer.ftl"]
    [@cssjsmodals /]
  </body>
</html>
