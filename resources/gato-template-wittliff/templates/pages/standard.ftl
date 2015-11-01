[#include "/gato-template-wittliff/templates/includes/init.ftl"]

<!DOCTYPE HTML>
<html>
<head>
  [@templatejs scripts=[]/]
  <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-wittliff/css/standard.compiled.css"/>
  [@templatehead publisher="The Wittliff Collections"/]

	<!-- stylesheets-->
	<c:import url="/templates/gato/wittliff/includes/custom-colors.jsp" />
	<c:import url="/templates/gato/includes/customjs/customcss.jsp" />
</head>
<body class="fullpage">

  <div id="outercontainer">
    <header id="header">
      [#if !sectionIsHomePage]
        <div id="logo">
          <a href="${cmsfn.link(homepage)}" title="${gf.nodeTitle(homepage)}">${gf.nodeTitle(homepage)}</a>
        </div>
      [/#if]
      <div id="sectiontitle">
        <a href="${cmsfn.link(sectionHomePage)}">${gf.nodeTitle(sectionHomePage)}</a>
      </div>
      <nav id="mainnav">
        <ul>
          [@navloop cmsfn.children(sectionHomePage, 'mgnl:page') ; page]
            <li class="submenu">
              <div class="dropdownbackground"></div>
              <ul>
                <li class="top">
                  <a href="${cmsfn.link(page)}">${gf.nodeTitle(page)}</a>
                </li>
                [@navloop cmsfn.children(page, 'mgnl:page') ; subpage]
                  <li class="item"><a href="${cmsfn.link(subpage)}">${gf.nodeTitle(subpage)}</a></li>
                [/@navloop]
              </ul>
            </li>
          [/@navloop]
        </ul>
      </nav>
    </header>

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
          [@cms.area name="footer"/]
        </div>
        <div class="righttricolumnfooter">
          [@search image='gato-template-wittliff/images/searchglass.png'/]
          <a href="${ctx.contextPath}${homepage.@path}/sitemap.html">site map &gt;&gt;</a>
        </div>
      </div>
    </footer>
  </div>

  [@cssjsmodals /]
</body>
</html>
