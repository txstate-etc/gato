[#assign useTemplate = def.parameters.templateName!"templateNotFound"]
[#if useTemplate=="rss"]
  [#assign rssClass = "gato-card-rss"]
[/#if]
<div class="grid-card  ${rssClass!} eq-parent ${ctx.cardsperrow!} ${cmsfn.editMode?string('moveEditor', '')}" data-gridtags="${content.tags!''}">
            [#if useTemplate=="icontext"]
              [#include "/gato-template/templates/components/icontext.ftl"]
            [#elseif useTemplate=="iframe"]
              [#include "/gato-template/templates/components/iframe.ftl"]
            [#elseif useTemplate=="rss"]
              <div class="gato-card-rss-container">
                [#include "/gato-component-rss/templates/components/rss.ftl"]
              </div>
            [#elseif useTemplate=="richeditor"]
                [#include "/gato-template/templates/components/richeditor.ftl"]
            [#elseif useTemplate=="textimage"]
                [#include "/gato-template/templates/components/textimage.ftl"]
            [#elseif useTemplate=="imagecard"]
                [#include "/gato-template/templates/components/imagecard.ftl"]
            [#elseif useTemplate=="videocard"]
                [#include "/gato-component-streaming/templates/components/masonryStreaming.ftl"]
            [#else]
                <p>Error while rendering a template or did not find the requested template</p>
            [/#if]
</div>
