[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html lang="en">
  <head>
    [@templatejs scripts=[
    ]/]
    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-blank/css/blank.scss"/>
    [@templatehead/]
  </head>

  <body>
    <main>
      [@cms.area name="contentParagraph" /]
    </main>
    [#include "/gato-template/templates/includes/video-modal.ftl"]
  </body>
</html>
