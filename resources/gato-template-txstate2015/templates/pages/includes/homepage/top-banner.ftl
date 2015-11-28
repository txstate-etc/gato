[#include "audience-links.ftl"]

<div id="homepage-banner">
  <div class="homepage-banner-content">
    
    <div class="homepage-banner-toprow">
    
      <div class="homepage-banner-logo">
        <a href="http://www.txstate.edu">
          <img src="${ctx.contextPath}/.resources/gato-template-txstate2015/images/txst-primary.png"/>
        </a>
      </div>

      <div class="hamburger">
        <a class="toggle-button" href="#">Menu</a>
      </div>

      <div class="homepage-banner-searchwrap">
        [@search.searchBar false false/]
      </div>

    </div>

    <nav class="homepage-banner-nav">
      <div class="homepage-banner-nav-content">
        
        <div class="homepage-banner-nav-logo">
          <a href="http://www.txstate.edu">
            <img src="${ctx.contextPath}/.resources/gato-template-txstate2015/images/txst-secondary.png"/>
          </a>
        </div>

        <div class="audience-link-tabs">
          <ul role="menubar">
            <li role="presentation">
                <a href="#audience-future-students" role="menuitem" aria-controls="audience-future-students" aria-selected="false" tabindex="0" id="tab-audience-future-students">Future Students</a>
            </li>
            <li role="presentation">
                <a href="#audience-current-students" role="menuitem" aria-controls="audience-current-students" aria-selected="false" tabindex="-1" id="tab-audience-current-students">Current Students</a>
            </li>
            <li role="presentation">
                <a href="#audience-faculty-staff" role="menuitem" aria-controls="audience-faculty-staff" aria-selected="false" tabindex="-1" id="tab-audience-faculty-staff">Faculty &amp; Staff</a>
            </li>
            <li role="presentation">
                <a href="#audience-alumni-visitors" role="menuitem" aria-controls="audience-alumni-visitors" aria-selected="false" tabindex="-1" id="tab-audience-alumni-visitors">Alumni, Family &amp; Visitors</a>
            </li>
          </ul>
        </div>

        <div class="audience-links">
          [@audienceLinks 'future-students' ; featuredLinks]
            [@featuredLinksFuture featuredLinks /]
          [/@audienceLinks]
          [@audienceLinks 'current-students' /]
          [@audienceLinks 'faculty-staff' /]
          [@audienceLinks 'alumni-visitors' /]
        </div>
      
      </div>
    </nav>

  </div>
</div>
