<div class="gatoStreamingWrapper">
  [#if content.title?has_content]
    <h2>${content.title}</h2>
  [/#if]
  [#assign vurl = content.videourl!'']
  [#if vurl?contains('ensemble') || vurl?contains('mediaflo')]
    [#assign translatedurl = gf.translateMediafloLink(vurl)]
    [#if translatedurl?has_content][#assign vurl = translatedurl][/#if]
  [/#if]
  <div
    class="gatoEmbedContainer"
    data-url="${vurl}"
    [#if content.videoid?has_content]data-videoid="${content.videoid}"[/#if]>
  </div>
</div>
