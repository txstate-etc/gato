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
    [@macro breadcrumbs hidetxstate=true /]
    [@cms.area name="contentParagraph" /]
    [#include "includes/footer.ftl"]
    [@cssjsmodals /]
  </body>
</html>
