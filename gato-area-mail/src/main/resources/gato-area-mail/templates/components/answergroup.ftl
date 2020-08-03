<div class="conditional-answer ${(cmsfn.isEditMode())?then("edit", "")}" id="ans${gf.uuidToHtmlId(content.@id)}">
  <div class="answer-edit-bar" data-title="Answer - ${content.text!''}" cms:edit></div>
  <div class="txst-khan-alert txst-khan-notice">
  These questions will appear if the form submitter's answer is <strong>${content.text!}</strong>.
  </div>
  [@cms.area name="conditionalformfields"/]
</div>
