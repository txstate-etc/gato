[#include "/gato-template-wittliff/templates/includes/init.ftl"]

<!DOCTYPE HTML>
<html>
<head>
  [@templatejs scripts=['gato-template-wittliff/js/wittliff.js']/]
  <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-wittliff/css/standard.compiled.css"/>
  [@templatehead publisher="The Wittliff Collections"/]
	[#include "/gato-template-wittliff/templates/includes/colors.ftl"]
</head>
<body class="fullpage ${cmsfn.isEditMode()?string('admin','public')}">

  <div id="outercontainer">
    [#include "/gato-template-wittliff/templates/includes/header.ftl"]
    <main id="bodycontent">
      [#if def.parameters.isMailTemplate!false]
        [@cms.area name="mail" /]
      [#else]
        [@cms.area name="contentParagraph" /]
      [/#if]
    </main>
    <footer id="footer">
      <div class="tricolumnfooter">
        <div class="lefttricolumnfooter"></div>
        <div class="middletricolumnfooter">
          [@cms.area name="footer" content=gf.getOrCreateArea(homepage, 'footer') editable=isHomePage /]
        </div>
        <div class="righttricolumnfooter">
          [@search image='gato-template-wittliff/images/searchglass.png'/]
          <a href="${ctx.contextPath}${homepage.@path}/sitemap.html" class="sitemap">site map &gt;&gt;</a>
        </div>
      </div>
    </footer>
  </div>

  [@cssjsmodals /]
</body>
</html>
