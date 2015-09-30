[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
  <head>
    [@templatejs scripts=[
    ]/]
    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-blank/css/blank.compiled.css"/>
    [@templatehead/]
  </head>
  
  <body>
    <main class="tsus-home-content-bg">
      [@cms.area name="contentParagraph" /]
    </main>
  </body>
</html>
