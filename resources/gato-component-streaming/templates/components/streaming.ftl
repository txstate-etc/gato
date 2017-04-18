<div class="gatoStreamingWrapper">
  [#if content.title?has_content]
    <h2>${content.title}</h2>
  [/#if]
  [#assign embedinfo=gf.oEmbedAutodiscover(content.videourl)!]
  [#if embedinfo?has_content]
    [#assign embedhtml=gf.jsonGetString(embedinfo, 'title')?html]
    [#assign embedtitle=gf.jsonGetString(embedinfo, 'title')?html]
  [/#if]
  <div
    class="gatoEmbedContainer"
    data-url="${content.videourl!''}"
    data-openinapp="${(content.openinapp!false)?string('true','false')}"
    [#if embedhtml?has_content]data-embed="${embedhtml}"[/#if]
    [#if embedtitle?has_content]data-embedtitle="${embedtitle}"[/#if]
    [#if content.videoid?has_content]data-videoid="${content.videoid}"[/#if]>
  </div>
</div>
