[#assign title = ctx.request.getAttribute("safeTitle")]

<div class="formelement conditional ${(cmsfn.isEditMode())?then("edit", "")}">
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
  [#assign answers = []]
  [#if content.answers??]
    <div class="txst-khan-alert txst-khan-notice">
      Select an answer to add conditional questions.
    </div>
    [#assign answers = cmsfn.children(content.answers)]
  [/#if]
  <select class="conditional-select" name="${title}" id="${title}" [#if content.mandatory!false]aria-required="true"[/#if]>
    <option value="not selected">Please select:</option>
    [#list answers as answer]
      <option value="${answer.text}" data-answergroup="ans${gf.uuidToHtmlId(answer.@id)}">${answer.text}</option>
    [/#list]
  </select>
[#else]
<fieldset class="selectiongroup">
  [#if (content.title!"")?has_content || content.mandatory!false]
    <legend for="${title}" class="txst-form-text-label">
      ${cmsfn.decode(content).title!}
      [#if content.mandatory!false]*[/#if]
    </legend>
  [/#if]
  <div class="txst-form-selectiongroup" id="${title}">
    [#assign answers = []]
    [#if content.answers??]
      <div class="txst-khan-alert txst-khan-notice">
        Select an answer to add conditional questions.
      </div>
      [#assign answers = cmsfn.children(content.answers)]
    [/#if]
    <div>
    [#list answers as answer]
      <div>
        <input type="radio" class="radio choice" name=${title} id=${title}${answer?index} value=${answer.text} data-answergroup="ans${gf.uuidToHtmlId(answer.@id)}" />
        <label for="${title}${answer?index}" class="txst-form-selection-label">${answer.text}</label>
      </div>
    [/#list]
    </div>
  </div>
</fieldset>
[/#if]
[@cms.area name="answers"/]
