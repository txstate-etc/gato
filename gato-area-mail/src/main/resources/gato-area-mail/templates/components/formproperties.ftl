[#assign addresses = (content.to![])?join(",")]
[#if cmsfn.isEditMode()]
<p>
  This form currently sends its results here:
  <strong>${addresses}[#if !addresses?has_content]NO ADDRESS DEFINED[/#if]</strong>
</p>
<p>
  Edit the form properties to change the email to which the results are mailed, the subject of the
  email, or the page that's displayed after the form is submitted.
</p>
[/#if]
[#if content.copySender!false]
  <input type="hidden" name="options" value="send-to-sender" />
[/#if]
<input type="hidden" name="destinationemail" value="${addresses}" />
<input type="hidden" name="MessageSubject" value="${content.subject!''}" />

<input type="hidden" id="formemailersetid" name="formemailersetid" value="${cmsfn.page(content).@id}" />
<input type="hidden" id="thankyoupage" name="thankyoupage" value="${gf.absoluteUrl(content.redirect)}" />
