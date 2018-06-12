<header>
  <div class="header-buttons">
    <button class="header-button btn-menu">
      <i class="fa fa-bars"></i>
      <span class="label">Menu</span>
    </button>
    <button class="header-button btn-search">
      <i class="fa fa-search"></i>
      <span class="label">Search</span>
    </button>
  </div>
  <div class="logo-block">
    <a href="http://www.txstate.edu">
      <img src="${ctx.contextPath}/.resources/gato-template-mobilefirst/images/txstate_v_1a_primary_3color_rgb.png" alt="Texas State University" />
    </a>
  </div>
  <div class="menubar">
    <div class="menu">
      <a class="logo" href="http://www.txstate.edu">
        <img src="${ctx.contextPath}/.resources/gato-template-mobilefirst/images/txst-secondary.png" alt="Texas State University" />
      </a>
      <ul class="menulinks">
        [@cms.area name="menulinks" content=gf.getOrCreateArea(homepage, 'menulinks') editable=isHomePage/]
      </ul>
    </div>
  </div>
</header>
