[#assign title = ctx.request.getAttribute("safeTitle")]

<div class="formelement">
[#if content.mandatory!false]
  <input type="hidden" name="mgnlMandatory" value="${title}" />
[/#if]

[#if content.type == "select"]
  [#if (content.title!"")?has_content || content.mandatory!false]
    <label for="${title}" class="txst-form-text-label">
      ${cmsfn.decode(content).title!}
      [#if content.mandatory!false]*[/#if]
    </label>
  [/#if]
  [#if content.helptext??]
    <div id="${title}-help" class="helptext">${content.helptext}</div>
  [/#if]
  <select class="txst-select" name="${title}" id="${title}" [#if content.mandatory!false]aria-required="true"[/#if] [#if content.helptext?has_content]aria-describedby="${title}-help"[/#if]>
    <option value="not selected">Select</option>
    [#if content.options??]
      [#list cmsfn.children(content.options) as option]
        [#assign value = option.answer?keep_before("|")]
        [#assign label = option.answer?keep_after("|")]
        [#if !label?has_content][#assign label = value][/#if]
        <option value="${value}" [#if option.helptext?has_content]data-help="${option.helptext}"[/#if]>${label}</option>
      [/#list]
    [/#if]
  </select>
  <div aria-live="polite" id="${title}-option-help" class="helptext"></div>
[#else]
  <fieldset class="selectiongroup">
  [#if (content.title!"")?has_content || content.mandatory!false]
    <legend for="${title}">
      <div class="txst-form-text-label">
        ${cmsfn.decode(content).title!}
        [#if content.mandatory!false]*[/#if]
      </div>
      [#if content.helptext??]
        <div id="${title}-help" class="helptext">${content.helptext}</div>
      [/#if]
    </legend>
  [/#if]
  <div class="txst-form-selectiongroup ${content.type}-type" id="${title}">
  [#assign i = 0]
  [#if content.options??]
    [#list cmsfn.children(content.options) as option]
      <div class="txst-form-selection-item">
        [#assign value = option.answer?keep_before("|")]
        [#assign label = option.answer?keep_after("|")]
        [#if !label?has_content][#assign label = value][/#if]
        <div class="field-cont">
          <input name="${title}" id="${title}${i}" type="${content.type}" class="${content.type}" value="${value}" [#if content.mandatory!false]aria-required="true"[/#if][#if option.helptext?? && option.helptext?has_content]aria-describedby="${title}${i}-help"[/#if]/>
          <label for="${title}${i}" class="txst-form-selection-label">${label}</label>
        </div>
        [#if option.helptext?? && option.helptext?has_content]<div class="helptext ${content.type}" id="${title}${i}-help">${option.helptext}</div>[/#if]
      </div>
      [#assign i = i + 1]
    [/#list]
  [/#if]
  </div>
  </fieldset>
[/#if]
</div>
