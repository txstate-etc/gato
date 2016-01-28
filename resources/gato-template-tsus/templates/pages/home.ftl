[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html lang="en">
	<head>
		[@templatejs scripts=['gato-template-tsus/js/tsus-slideshow.js']/]
    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-tsus/css/tsus-home.compiled.css"/>
		[@templatehead publisher="Texas State University System"/]
	</head>

  <body class="${cmsfn.isEditMode()?string('admin', '')}">
		[#include "includes/topbanner.ftl"]
		<div class="slideshow-bg">
			[@cms.area name="slideshow" /]
		</div>
		<div class="tsus-home-content-bg">
			<div class="tsus-home-content">
				<div class="tsus-home-contentbox left">
					[@cms.area name="tsushomeleft" /]
				</div>
				<div class="tsus-home-contentbox right">
					[@cms.area name="tsushomeright" /]
				</div>
			</div>
		</div>
		<div class="tsus-institution-logos">
			[@cms.area name="tsuslogos" /]
		</div>
		[#include "includes/footer.ftl"]

		[@cssjsmodals /]
		[@sidebarmodal skipsocial=true /]

	</body>
</html>
