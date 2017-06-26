[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html lang="en">
  <head>
    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-tsus2017/css/tsus-standard.compiled.css"/>
    [@templatejs scripts=['gato-lib/js/jquery-ui/jquery-ui.min.js',
                          'gato-template-tsus2017/js/tsus.js',
                          'gato-template-txstate2015/js/sidebarwrap.js',
                          'gato-template/js/search-gsa.js',
                          'gato-template-txstate2015/js/globalsearch.js']/]
  </head>
  <body>
    [#include "includes/header.ftl"]
    <div class="container search-container global web" id="search-results">
        <form class="search-form">
            <input type="text" class="search" name="q" value=""></input>
            <button class="icon magnify"><i class="fa fa-search" aria-label="Start Search"></i></button>
            <button class="icon reset"><i class="fa fa-times" aria-label="Reset Search"></i></button>
        </form>
        <div class="search-column-main eq-parent">
          <ul class="search-tabs" role="tablist">
            <li id="search-tab-web" class="search-tab-web" role="tab" tabindex="0">Web</li>
            <!--<li id="search-tab-people" class="search-tab-people" role="tab" tabindex="0">People</li> -->
          </ul>
          <div class="search-web results-list" role="tabpanel" aria-labeledby="search-tab-web"></div>
          <!--<div class="search-people results-list" role="tabpanel" aria-labeledby="search-tab-people"></div>-->
        </div>
    </div>
  </body>
</html>