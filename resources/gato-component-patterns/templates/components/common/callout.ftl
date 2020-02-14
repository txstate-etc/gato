[#macro callout lead title text="" buttons=[] hasbackground=false]
<div class="centered">
  <h2 class="visuallyhidden">${lead} ${title}</h2>
  <div class="stat ${hasbackground?then('background', '')}" aria-hidden="true">${lead}</div>
  <div class="title" aria-hidden="true">${title}</div>
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
