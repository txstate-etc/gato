<div cms:edit="bar"></div>
<div class="mobilefirst-pattern">
  <div class="callout pattern-content ${content.colorLeft!color1} ${content.alignContentLeft!center}">
    <div class="stat">${content.calloutLeft}</div>
    <div class="title">${content.titleLeft!}</div>
    [#if content.textLeft?has_content]<div class="text">${content.textLeft}</div>[/#if]
    [#if content.buttonsLeft?has_content]
    <div class="buttons">
      <ul>
        [#list cmsfn.children(content.buttonsLeft) as button]
        <li>
          <a class="button" href="${gf.filterUrl(button.link)}">${button.text!}</a>
        </li>
        [/#list]
      </ul>
    </div>
    [/#if]
  </div>
  <div class="callout pattern-content ${content.colorRight!color2} ${content.alignContentRight!center}">
    <div class="stat">${content.calloutRight}</div>
    <div class="title">${content.titleRight!}</div>
    [#if content.textRight?has_content]<div class="text">${content.textRight}</div>[/#if]
    [#if content.buttonsRight?has_content]
    <div class="buttons">
      <ul>
        [#list cmsfn.children(content.buttonsRight) as button]
        <li>
          <a class="button" href="${gf.filterUrl(button.link)}">${button.text!}</a>
        </li>
        [/#list]
      </ul>
    </div>
    [/#if]
  </div>
</div>
