<!DOCTYPE HTML>
[#-- important variables set in here --]
[#include "includes/init.ftl"]
<html lang="en-US" xmlns="http://www.w3.org/1999/xhtml">
	<head>
		[#include "includes/head-common.ftl"]
		[@cms.page /]
	</head>
	<body>
		<div id="panel" class="container">
			<!--"super user" menu bar -->
			[@cms.area name="superUser"/]
			[#--include "includes/super-user.ftl"--]
			<!-- banner with logo and search bar -->
			[#include "includes/top-banner.ftl"]
			<!--header image, parent organization, department name -->
			[#include "includes/header.ftl"]
			<!-- main menu -->
			[#include "includes/main-menu.ftl"]
			<div class="page_content">
				[#assign hidetxstate=false]
				[#include "includes/breadcrumbs.ftl"]
			</div> <!-- end of page_content -->
		</div> <!-- end of the container -->
	</body>
</html>