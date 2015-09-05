[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
	<head>
		[@templatejs scripts=[
			'gato-template-tsus/js/stretch-institutions.js'
		]/]
		[@templatecss files=[
			'gato-template-tsus/css/tsus-master.css',
			'gato-template-tsus/css/tsus-styledcontent.css',
			'gato-template-tsus/css/tsus-banner.css',
			'gato-template-tsus/css/tsus-ddmenu.css',
			'gato-template-tsus/css/tsus-print.css',
			'gato-template-tsus/css/tsus-home.css'
		]/]
		[@templatehead publisher="Texas State University System"/]
	</head>
	
	<body>
		[#include "includes/topbanner.ftl"]
		<h1 id="maincontent" tabindex="-1" class="visuallyhidden">[@pagetitle page /]</h1>

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
		<ul class="tsus-institution-logos">
			[@cms.area name="tsuslogos" /]
		</ul>
		[#include "includes/footer.ftl"]
		
		[@cssjsmodals /]
		[@sidebarmodal skipsocial=true /]

	</body>
</html>
