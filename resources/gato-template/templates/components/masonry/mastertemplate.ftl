[#assign useTemplate = def.parameters.templateName!"templateNotFound"]
[#if content.sizeSelect?has_content]
      <div class="gato-card gato-card-rss eq-parent ${content.sizeSelect! }">
        <div class="gato-card-rss-container">
            [#if useTemplate=="icontext"]
              [#include "*/components/icontext.ftl"]
            [#elseif useTemplate=="iframe"]
              [#include "*/components/iframe.ftl"]
            [#elseif useTemplate=="rss"]
                [#include "*/gato-component-rss/templates/components/rss.ftl"]
            [#elseif useTemplate=="richeditor"]
                [#include "*/components/richeditor.ftl"]
            [#elseif useTemplate=="textimage"]
                [#include "*/components/textimage.ftl"]
            [#else]
                <p>Error while rendering a template or did not find the requested template</p>
            [/#if]
        </div>
      </div>
[/#if]
