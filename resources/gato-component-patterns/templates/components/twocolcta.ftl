[#if cmsfn.isEditMode()]
<div cms:edit="bar"></div>
[/#if]
<div class="mobilefirst-pattern">
  <div class="pattern-content callout twocolcta ${content.colorLeft!color1} ${content.alignContent!'text-center'}">
    <div class="centered">
      <div class="title cta">${content.titleLeft}</div>
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
  </div>
  <div class="pattern-content callout twocolcta ${content.colorRight!color1} ${content.alignContent!'text-center'}">
    <div class="centered">
      <div class="title cta">${content.titleRight}</div>
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
</div>
