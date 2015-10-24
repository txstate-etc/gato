[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
  <head>
    [@templatejs scripts=[
    ]/]
    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-blank/css/blank.compiled.css"/>
    [@templatehead/]
  </head>

  <body>
    <main>
      [@cms.area name="contentParagraph" /]
    </main>
  </body>
</html>
