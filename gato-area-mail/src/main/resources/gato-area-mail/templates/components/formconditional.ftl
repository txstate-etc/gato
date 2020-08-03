[#assign title = ctx.request.getAttribute("safeTitle")]

<div class="formelement conditional ${(cmsfn.isEditMode())?then("edit", "")}">
[#if content.mandatory!false]
  <input type="hidden" name="mgnlMandatory" value="${title}" />
[/#if]

<fieldset class="selectiongroup">
  [#if (content.title!"")?has_content || content.mandatory!false]
    <legend for="${title}" class="txst-form-text-label">
      ${cmsfn.decode(content).title!}
      [#if content.mandatory!false]*[/#if]
    </legend>
  [/#if]
  <div class="txst-form-selectiongroup" id="${title}">
    <div class="txst-khan-alert txst-khan-notice">
    Select an answer to add conditional questions.
    </div>
    [#assign answers = cmsfn.children(content.answers)![]]
    [#list answers as answer]
      <input type="radio" class="radio choice" name=${title} id=${title}${answer?index} value=${answer.text} data-answergroup="ans${gf.uuidToHtmlId(answer.@id)}" />
      <label for="${title}${answer?index}" class="txst-form-selection-label">${answer.text}</label>
    [/#list]
  </div>
</fieldset>

[@cms.area name="answers"/]
