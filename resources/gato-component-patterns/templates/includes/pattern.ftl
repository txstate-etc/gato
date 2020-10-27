[#macro prebuiltsection hasBackground=false]
  <div id="${gf.htmlId(content)}" class="gato-section-full full-width pattern [#if hasBackground]has-background[/#if]">
    <div class="gato-section-centered">
      <div class="gato-section eq-parent">
        [#nested]
      </div>
    </div>
  </div>
[/#macro]