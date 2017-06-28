[#assign background_color = content.color!"color1"]

<div class="performance ${background_color}">
  <div class="container">

  <h2><span>${content.title}</span></h2>
  <ul class="charts">
      [@cms.area name="links"/]
  </ul>

  </div>
</div>
