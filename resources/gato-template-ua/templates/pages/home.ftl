[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html>
<head>
  [@templatejs scripts=['gato-template-ua/js/accordion.js']/]
  <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-ua/css/home.compiled.css" crossorigin="anonymous"/>
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
          [@cms.area name="contentBoxes" contextAttributes={"bar_class":"content_add"} /]
        </div>
        <div class="ua-news">
          <h3 class="ua-news-header">A Note of Celebration</h3>
          <div class="ua-news-container">
            [@cms.area name="news" contextAttributes={"bar_class":"content_add"}/]
          </div>
        </div>
        <div class="ua-video">
          <h3 class="ua-video-header">Impact of Giving</h3>
          <div class="ua-video-container">
            [@cms.area name="video" /]
          </div>
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

