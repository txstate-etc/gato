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
    <i class="fa fa-university"></i>
    <p>Placeholder</p>
  </div>
  <div class="menubar">
    <button class="header-button btn-menu">
      <i class="fa fa-bars"></i>
      <span class="label">Menu</span>
    </button>
    <button class="header-button btn-search">
      <i class="fa fa-search"></i>
      <span class="label">Search</span>
    </button>
    <div class="menu">
      <a class="logo" href="http://www.txstate.edu">
        <img src="${ctx.contextPath}/.resources/gato-template-txstate2015/images/txst-secondary.png" alt="Texas State University" />
      </a>
      <ul class="menulinks">
        [@cms.area name="menulinks" content=gf.getOrCreateArea(homepage, 'menulinks') editable=isHomePage/]
      </ul>
    </div>
  </div>
</header>
