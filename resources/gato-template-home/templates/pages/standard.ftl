[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html lang="en">
  <head>
    <!-- Add JS files with templatejs macro in gato-template/templates/includes/head.ftl -->

    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-home/css/standard.scss"/>
    [@templatehead publisher="Texas State"/]
  </head>
  <body class=${cmsfn.isEditMode()?then(' admin','')}">
    [@skipnav/]


    [@cssjsmodals /]
    [#include "/gato-template/templates/includes/video-modal.ftl"]
  </body>
</html>
