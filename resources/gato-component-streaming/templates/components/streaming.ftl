<div class="gatoStreamingWrapper">
  [#if content.title?has_content]
    <h2>${content.title}</h2>
  [/#if]
  <div
    class="gatoEmbedContainer"
    data-url="${content.videourl!''}"
    data-embed="${gf.jsonGetString(gf.oEmbedAutodiscover(content.videourl), 'html')?html}"
    [#if content.videoid?has_content]data-videoid="${content.videoid}"[/#if]>
  </div>
</div>
