<div class="gato-slider" data-feature-timer="${content.defaultTimer!none}" data-feature-carousel="${(content.carousel!false)?string('true','false')}">
  <button class="btnPauseSlider"><i class="fa fa-pause" aria-hidden="true"></i><span class="visuallyhidden">Pause Slider</span></button>
  [@cms.area name="slides" contextAttributes={"colorClass":content.color!, "skiptruncation":content.skiptruncation!'false', "aspectratio":(content.aspect!0)?number} /]
</div>
