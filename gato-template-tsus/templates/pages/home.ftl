[#include "/gato-lib/templates/includes/head-include.ftl"]

<!DOCTYPE HTML>
	<head>
		[@title txstate=false]
		[@templatejs scripts=[
			'/gato-templates-tsus/js/stretch-institutions.js'
		]]
		[@templatecss files=[
			'/gato-templates-tsus/css/meta-home.css'
		]]
	</head>
	
	<body>
		[#if cmsfn.isEditMode()]
			<div id="gato-customjs-modal" class="gato-customjs-column">		
				[@cms.area name="customjs" /]
			</div>
			<div id="gato-customcss-modal" class="gato-customjs-column">
				[@cms.area name="customcss" /]
			</div>
			[@sidebarmodal skipsocial=true /]
			</c:import>
		[/#if]

		[#include "includes/topbanner.ftl"]
		<h1 id="maincontent" tabindex="-1" class="visuallyhidden">${content.title}</h1>

		<div class="slideshow-bg">
			[@cms.area name="slideshow" /]
		</div>
		<div class="tsus-home-content-bg">
			<div class="tsus-home-content">
				<div class="tsus-home-contentbox left">
					[@cms.area name="tsushomeleft" /]
				</div>
				<div class="tsus-home-contentbox middle">
					[@cms.area name="tsushomemiddle" /]
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
		[@googleanalytics /]
	</body>
</html>
