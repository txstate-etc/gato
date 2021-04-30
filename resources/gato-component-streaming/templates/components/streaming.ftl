[#include "/gato-template/templates/includes/commonmacros.ftl"]
<div class="gatoStreamingWrapper">
  [#if !gf.isEmptyString(content.title)]
    [@h2 class="level1header streaming-title"]${content.title}[/@h2]
  [/#if]
  [#assign embedinfo=gf.oEmbedCached(content)!]
  [#if embedinfo?has_content]
    [#assign embedhtml=gf.jsonGetString(embedinfo, 'html')?html]
    [#assign embedtitle=gf.jsonGetString(embedinfo, 'title')?html]
    [#assign embedaspect=56.25]
    [#if gf.jsonGetInteger(embedinfo, 'height') > 0 && gf.jsonGetInteger(embedinfo, 'width') > 0]
      [#assign embedaspect=100.0 * gf.jsonGetInteger(embedinfo, 'height') / gf.jsonGetInteger(embedinfo, 'width')]
      [#if embedaspect < 18][#assign embedaspect=18][/#if]
      [#if embedaspect < 57 && embedaspect > 55][#assign embedaspect=56.25][/#if]
    [/#if]
  [/#if]
  <div
    class="gatoEmbedContainer"
    style="padding-bottom: ${embedaspect}%"
    data-url="${content.videourl!''}"
    data-openinapp="${(content.openinapp!false)?string('true','false')}"
    [#if embedhtml?has_content]data-embed="${embedhtml}"[/#if]
    [#if embedtitle?has_content]data-embedtitle="${embedtitle}"[/#if]
    [#if content.videoid?has_content]data-videoid="${content.videoid}"[/#if]>
  </div>
</div>
