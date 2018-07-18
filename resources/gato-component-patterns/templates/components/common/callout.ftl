[#macro callout lead title text="" buttons=[]]
<div class="centered">
  <div class="stat">${lead}</div>
  <div class="title">${title}</div>
  [#if text?has_content]<div class="text">${text}</div>[/#if]
  [#if buttons?has_content]
  <div class="buttons">
    <ul>
      [#list cmsfn.children(buttons) as button]
      <li>
        <a class="button" href="${gf.filterUrl(button.link)}">${button.text!}</a>
      </li>
      [/#list]
    </ul>
  </div>
  [/#if]
</div>
[/#macro]
