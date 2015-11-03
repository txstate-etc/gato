[#include "/gato-template-wittliff/templates/includes/init.ftl"]

<!DOCTYPE HTML>
<html>
<head>
  [@templatejs scripts=['gato-template-wittliff/js/wittliff.js']/]
  <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-wittliff/css/sidebar.compiled.css"/>
  [@templatehead publisher="The Wittliff Collections"/]
	[#include "/gato-template-wittliff/templates/includes/colors.ftl"]
</head>
<body>
<div id="outercontainer">
  [#include "/gato-template-wittliff/templates/includes/header.ftl"]
  <div id="bodycontent">
    <main id="left">
      <header id="contenttop">
        <div id="sectionhead">
          <h1 id="maincontent">${gf.nodeTitle(content)}</h1>
          <hr>
        </div>
      </header>
      <main id="contentmiddle">
        [#if def.parameters.isMailTemplate!false]
          [@cms.area name="mail" /]
        [#else]
          [@cms.area name="contentParagraph" /]
        [/#if]
			</main>
			<footer id="contentbottom"></footer>
    </main>

    <div id="right">
      [@search image='gato-template-wittliff/images/searchglass.png'/]
      <a href="${ctx.contextPath}${homepage.@path}/sitemap.html" class="sitemap">site map &gt;&gt;</a>
			<div id="sidebar-paragraphs">
				[@cms.area name="sidebarParagraph" /]
			</div>
    </div>
  </div>
  <footer id="footer">
    <div class="tricolumnfooter">
      <div class="lefttricolumnfooter"></div>
      <div class="middletricolumnfooter">
        [@cms.area name="footer" content=gf.getOrCreateArea(homepage, 'footer') editable=isHomePage /]
      </div>
      <div class="righttricolumnfooter"></div>
    </div>
  </footer>
</div>
[@cssjsmodals /]
</body>
</html>
