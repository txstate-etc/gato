[#include "/gato-template/templates/includes/head.ftl"]
<!DOCTYPE HTML>
<html lang="en">
<head>
	[@title /]
	<style type="text/css">
		span { font-size: 1em !important; }
	</style>
</head>
<body>
	<h1 class="pagetitle">${gf.nodeTitle(content)}</h1>
	<div class="pagecontent">
		[@cms.area name="contentParagraph" /]
	</div>
</body>
</html>
