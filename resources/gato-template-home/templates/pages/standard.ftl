[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html lang="en">
  <head>
    [#assign scripts = ['gato-template-home/js/standard.cjs']]
    [@templatejs scripts /]

    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-home/css/standard.scss"/>
    [@templatehead publisher="Texas State"/]
  </head>
  <body class="${cmsfn.isEditMode()?then(' admin','')}">
    [#assign isTXSTHome = true]
    [@skipnav/]
    [#include "/gato-template-mobilefirst/templates/pages/includes/header.ftl"]
    [#include "/gato-template-mobilefirst/templates/pages/includes/menu.ftl"]
    <div class="page-container" id="panel">
      <div class="header-bars">
        <div class="top-bar">

        </div>
        <div class="bottom-bar">
        </div>
      </div>
      <main>
        [#if def.parameters.isHomeTemplate!false]
          [@cms.area name="homecontent"/]
        [#else]
          [@cms.area name="landingcontent"/]
        [/#if]
      </main>
    </div>
    [#include "/gato-template-mobilefirst/templates/pages/includes/footer.ftl"]
    [@cssjsmodals /]
    [#include "/gato-template/templates/includes/video-modal.ftl"]
  </body>
</html>
