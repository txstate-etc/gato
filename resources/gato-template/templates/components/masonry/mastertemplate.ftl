[#assign useTemplate = def.parameters.templateName!"templateNotFound"]
[#if useTemplate=="rss"]
  [#assign rssClass = "gato-card-rss"]
[/#if]

[#if content.sizeSelect?has_content]
      <div class="card-item  ${rssClass!} eq-parent ${content.sizeSelect!} ${cmsfn.editMode?string('moveEditor', '')}">
            [#if useTemplate=="icontext"]
              [#include "*/components/icontext.ftl"]
            [#elseif useTemplate=="iframe"]
              [#include "*/components/iframe.ftl"]
            [#elseif useTemplate=="rss"]
              <div class=" gato-card-rss-container">
                [#include "*/gato-component-rss/templates/components/rss.ftl"]
              </div>
            [#elseif useTemplate=="richeditor"]
                [#include "*/components/richeditor.ftl"]
            [#elseif useTemplate=="imagecard"]
                [#include "*/components/imagecard.ftl"]
            [#elseif useTemplate=="textimage"]
                [#include "*/components/textimage.ftl"]
            [#else]
                <p>Error while rendering a template or did not find the requested template</p>
            [/#if]
        </div>
[/#if]
