<div class="conditional-answer ${(cmsfn.isEditMode())?then("edit", "")}" id="ans${gf.uuidToHtmlId(content.@id)}">
  [#if cmsfn.isEditMode()]
    <div class="answer-edit-bar" data-title="Answer - ${content.text!''}" cms:edit></div>
  [/#if]
  <div class="txst-khan-alert txst-khan-notice">
  These questions will appear if the form submitter's answer is <strong>${content.text!}</strong>.
  </div>
  [@cms.area name="conditionalformfields"/]
</div>
