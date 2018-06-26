<div class="fullwidthlinks fw-content arrow">
  [#if content.title?has_content]<div class="title">${content.title}</div>[/#if]
  [#if content.subtitle?has_content]<div class="subtitle">${content.subtitle}</div>[/#if]

  [#assign items = []]
  [#if content.linkDisplay == "buttons" && content.buttons?has_content]
    [#assign items= content.buttons]
  [#elseif content.linkDisplay == "links" && content.links?has_content]
    [#assign items= content.links]
  [/#if]

  [#if items?has_content]
    <div class="${content.linkDisplay}">
      <ul>
      [#list cmsfn.children(items) as lnk]
        <li>
          <a href="${gf.filterUrl(lnk.link)}" class="${(content.linkDisplay=="buttons")?string('fullwidth-button', '')}">${lnk.text!}</a>
        </li>
      [/#list]
      </ul>
    </div>
  [/#if]
</div>
