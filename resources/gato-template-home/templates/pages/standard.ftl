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
    [@skipnav/]
    [#include "/gato-template-mobilefirst/templates/pages/includes/header.ftl"]

    [@cssjsmodals /]
    [#include "/gato-template/templates/includes/video-modal.ftl"]
  </body>
</html>
