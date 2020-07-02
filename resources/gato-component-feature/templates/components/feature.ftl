<div class="gato-slideshow ${cmsfn.isEditMode()?then('edit', '')}" data-feature-timer="${content.defaultTimer!none}">
  <button class="btnPauseSlider">
    <i class="fa fa-pause" aria-hidden="true"></i>
    <span class="visuallyhidden">Pause Slider</span>
  </button>
  <div class="arrow-container">
    <button class="prev" tabindex="-1"><i class="fa fa-angle-left"></i><span class="visuallyhidden">Previous Slide</span></button>
    <button class="next" tabindex="-1"><i class="fa fa-angle-right"></i><span class="visuallyhidden">Next Slide</span></button>
  </div>
  [@cms.area name="slides" contextAttributes={"colorClass":content.color!, "skiptruncation":content.skiptruncation!'false', "aspectratio":(content.aspect!0)?number} /]
</div>
