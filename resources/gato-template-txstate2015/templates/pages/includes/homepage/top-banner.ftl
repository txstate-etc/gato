[#include "audience-links.ftl"]
[#assign future = cmsfn.asContentMap(cmsfn.nodeByPath('/homepage-data/audience-links/future-students', 'gatoapps'))]
[#assign current = cmsfn.asContentMap(cmsfn.nodeByPath('/homepage-data/audience-links/current-students', 'gatoapps'))]
[#assign facstaff = cmsfn.asContentMap(cmsfn.nodeByPath('/homepage-data/audience-links/faculty-staff', 'gatoapps'))]
[#assign alumni = cmsfn.asContentMap(cmsfn.nodeByPath('/homepage-data/audience-links/alumni-visitors', 'gatoapps'))]

<div id="homepage-banner">
  <div class="homepage-banner-content">

    <div class="homepage-banner-toprow">

      <div class="homepage-banner-logo">
        <a href="https://www.txstate.edu">
          <img src="${ctx.contextPath}/.resources/gato-template-txstate2015/images/txst-primary.png" alt="Texas State University" />
        </a>
      </div>

      <div class="hamburger">
        <button class="search-link search-link-mobile search-button" aria-label="start search"><i class="fa fa-search"></i></button>
        <button class="search-link search-link-mobile toggle-button" aria-label="Menu - toggle site navigation"><i class="fa fa-bars"></i></button>
      </div>

      <div class="homepage-banner-searchwrap">
        <div class="gato-search txst_search">
          <div class="search_bar">
            <button class="search-link search-button">
              <span class="search-words">Search people and pages</span>
              <i class="icon fa fa-search" aria-label="start search"></i>
            </button>
          </div>
        </div>
        [@search.searchBar false false true/]
      </div>

    </div>

    <div class="homepage-banner-nav-wrap">
      <nav class="homepage-banner-nav">
        <div class="homepage-banner-nav-content">

          <div class="homepage-banner-nav-logo">
            <a href="https://www.txstate.edu">
              <img src="${ctx.contextPath}/.resources/gato-template-txstate2015/images/txst-secondary.png" alt="Texas State University" />
            </a>
          </div>

          <div class="audience-link-tabs">
            <ul role="menubar">[#--
              --]<li role="presentation">
                  <a href="${gf.filterUrl(future.link)}" role="menuitem" aria-controls="audience-future-students" aria-selected="false" tabindex="0" id="tab-audience-future-students" class="needsclick">${gf.filterLinkTitle(future.title, future.link)}</a>
              </li>[#--
              --]<li role="presentation">
                  <a href="${gf.filterUrl(current.link)}" role="menuitem" aria-controls="audience-current-students" aria-selected="false" tabindex="-1" id="tab-audience-current-students" class="needsclick">${gf.filterLinkTitle(current.title, current.link)}</a>
              </li>[#--
              --]<li role="presentation">
                  <a href="${gf.filterUrl(facstaff.link)}" role="menuitem" aria-controls="audience-faculty-staff" aria-selected="false" tabindex="-1" id="tab-audience-faculty-staff" class="needsclick">${gf.filterLinkTitle(facstaff.title, facstaff.link)}</a>
              </li>[#--
              --]<li role="presentation">
                  <a href="${gf.filterUrl(alumni.link)}" role="menuitem" aria-controls="audience-alumni-visitors" aria-selected="false" tabindex="-1" id="tab-audience-alumni-visitors" class="needsclick">${gf.filterLinkTitle(alumni.title, alumni.link)}</a>
              </li>[#--
            --]</ul>
          </div>

          <div class="audience-links">
            [@audienceLinks 'future-students' future ; featuredLinks]
              [@featuredLinksFuture featuredLinks /]
            [/@audienceLinks]
            [@audienceLinks 'current-students' current /]
            [@audienceLinks 'faculty-staff' facstaff /]
            [@audienceLinks 'alumni-visitors' alumni /]
          </div>

        </div>
      </nav>
    </div>

  </div>
</div>
