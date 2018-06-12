[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html lang="en">
  <head>
    [@templatejs scripts=['gato-template-mobilefirst/js/standard.cjs']/]
    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-mobilefirst/css/standard.scss"/>
    <link href="https://fonts.googleapis.com/css?family=Adamina|Muli:300,300i,400,400i,600,600i,700,700i,800,800i" rel="stylesheet">
    [@templatehead/]
  </head>
  <body>
    [#include "includes/header.ftl"]
    <div class="page_content">
      [@cms.area name="top-banner" content=gf.getOrCreateArea(homepage, 'top-banner')/]
      <div style="min-height: 50rem">
      </div>
    </div>
    [#include "includes/footer.ftl"]
    [@cssjsmodals /]
  </body>
</html>
