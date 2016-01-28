[#include "/gato-template/templates/includes/head.ftl"]
<!DOCTYPE html>
<html lang="en">
<head>
  [@templatejs scripts=[]/]
  <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-txstate2009/css/mobile.compiled.css"/>
  [@templatehead/]
  <script type="text/javascript">
    function hideAddressBar(evt) {
      if (evt == 'load') {
        setTimeout(function() { if (!location.hash && document.viewport.getScrollOffsets().top == 0) window.scrollTo(0, 0); }, 100);
      } else if (!location.hash && document.viewport.getScrollOffsets().top == 0) {
        window.scrollTo(0, 0);
      }
    }

    Event.observe( window, 'load', function() { hideAddressBar('load'); } );
    Event.observe( window, orientationChangeEventName, hideAddressBar );
  </script>
</head>
<body>
  <div id="iphone-banner-container">
    <div id="iphone-banner">
      <div id="iphone-banner-logo"><a href="http://www.txstate.edu"><img src="${gf.resourcePath()}/gato-template-txstate2009/images/texas-state-logo-iphone.png" alt="Texas State University Logo" width="58" height="34"/></a></div>
      <h1 id="iphone-banner-title">
        <a href="${cmsfn.link(homepage)}">
          ${gf.nodeTitle(homepage)}
        </a>
      </h1>
    </div>
    [@cms.area name="gato-banners"/]

    [#if !isHomePage]
      <div id="iphone-back">
        <a href="${cmsfn.link(ancestorsbottomup?first)}">Back: ${ gf.nodeTitle(ancestorsbottomup?first) }</a>
      </div>
    [/#if]
  </div>

  <div id="iphone-contentarea" class="txst-contentarea txst-styledcontent gato-styledcontent">
    [#if !isHomePage]<h1>${gf.nodeTitle(page)}</h1>[/#if]
    [#if def.parameters.isMailTemplate!false]
      [@cms.area name="mail" /]
    [#else]
      [@cms.area name="contentParagraph" contextAttributes={"iam2009tmpl": true} /]
    [/#if]
  </div>
  [@mobilemenu page/]
  <div class="full-site-link gato-styledcontent">
    <a href="javascript: createCookie('gatoforcedesktop', 'yes'); location.reload(true);">View Full Site</a>
  </div>
</body>
</html>
