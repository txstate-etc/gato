<div id="homepage-banner">
  <div class="homepage-banner-content">
    
    <div class="homepage-banner-toprow">
    
      <div class="homepage-banner-logo">
        <a href="http://www.txstate.edu">
          <img src="${ctx.contextPath}/.resources/gato-template-txstate2015/images/txst-primary.png"/>
        </a>
      </div>

      <div class="hamburger">
        <a class="toggle-button" href="#nowhere">Menu</a>
      </div>

      <div class="homepage-banner-searchwrap">
        [#import "search.ftl" as search]
        [@search.searchBar false false/]
      </div>

    </div>

    <nav class="homepage-banner-nav">
      <div class="homepage-banner-nav-logo">
        <a href="http://www.txstate.edu">
          <img src="${ctx.contextPath}/.resources/gato-template-txstate2015/images/txst-star.png"/>
        </a>
      </div>

      <div class="audience-link-tabs">
        <ul role="tablist">
          <li role="presentation">
              <a href="#tabpanel-future" role="tab" aria-controls="tabpanel-future" aria-selected="true" tabindex="0" id="tab-future">Future Students</a>
          </li>
          <li role="presentation">
              <a href="#tabpanel-current" role="tab" aria-controls="tabpanel-current" aria-selected="false" tabindex="-1" id="tab-current">Current Students</a>
          </li>
          <li role="presentation">
              <a href="#tabpanel-facstaff" role="tab" aria-controls="tabpanel-facstaff" aria-selected="false" tabindex="-1" id="tab-facstaff">Faculty &amp; Staff</a>
          </li>
          <li role="presentation">
              <a href="#tabpanel-visitors" role="tab" aria-controls="tabpanel-visitors" aria-selected="false" tabindex="-1" id="tab-visitors">Alumni, Family &amp; Visitors</a>
          </li>
        </ul>
      </div>

      <div class="audience-links">
        
      </div>
    
    </nav>

  </div>
</div>
