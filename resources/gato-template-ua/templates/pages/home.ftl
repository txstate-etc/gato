[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html>
<head>
  [@templatejs scripts=['gato-template-ua/js/accordion.js']/]
  <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-ua/css/home.compiled.css"/>
  [@templatehead /]
</head>

<body class="${cmsfn.isEditMode()?string('admin', '')}">
  <div id="ua-frame">
    [#include "../includes/header.ftl"]
    <div class="ua-banner">
      <div class="ua-banner-content">
        [@cms.area name="accordion" /]
      </div>
    </div>

    <div class="gato-columnparent gato-fullwidth">
      <div class="gato-contentcolumn gato-styledcontent">
        <div class="ua-contentboxes">
          [@cms.area name="contentBoxes" /]
        </div>
        <div class="ua-news">
          <h3 class="ua-news-header">Latest News</h3>
          <a class="ua-news-viewmore" href="news-all.html">view more</a>
          [@cms.area name="news" /]
        </div>
        <div class="ua-video">
          <h3 class="ua-video-header">Video Feature</h3>
          [@cms.area name="video" /]
        </div>
      </div>
    </div>
		[#include "../includes/footer.ftl"]
  </div>
  [@cssjsmodals /]
  [@sidebarmodal /]
  [@bannermodal /]
</body>
</html>

