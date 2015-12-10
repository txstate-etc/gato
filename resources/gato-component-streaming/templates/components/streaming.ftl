<div class="gatoStreamingWrapper">
  [#if content.title?has_content]
    <h2>${content.title}</h2>
  [/#if]
  <div
    class="gatoEmbedContainer"
    data-url="${content.videourl}"
    [#if content.ustreamChannelId?has_content]data-ustream="${content.ustreamChannelId}"[/#if]>
  </div>
</div>
