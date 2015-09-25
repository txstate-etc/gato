<form class="txst-form" name="samplesForm" action="formemailerServer/formemailer/formemailer.pl" method="post" enctype="multipart/form-data"
  onsubmit="return (checkMandatories(this.name,'Please complete all of the required fields (marked with an asterisk).'));">
  <div class="txst-form-body">
  [#if cmsfn.isEditMode()]
    <div class="txst-khan-alert txst-khan-notice">
      <p>
        This form currently send its results here:
        <strong>${(content.to![])?join(",")}[#if (content.to![])?size == 0]NO ADDRESS DEFINED[/#if]</strong>
      </p>
      <p>
        To change the email to which the result are mailed, the subject of the
        email, or the page that's displayed after the form is submitted click the edit button in the Mail Form Content bar.
      </p>
      Some form-data-link.jsp thing
    </div>
  [/#if]
  [#if content.copySender!false]
    <input type="hidden" name="options" value="send-to-sender" />
  [/#if]
    <input type="hidden" name="destinationemail" value="${(content.to![])?join(",")}" />
    <input type="hidden" name="MessageSubject" value="${content.subject!""}" />

    <input type="hidden" id="formemailersetid" name="formemailersetid" value="pageuuid" />
    <input type="hidden" id="thankyoupage" name="thankyoupage" value="${gf.absoluteUrl(content.redirect)}" />
  </div>
  [#list components as component]
    [@cms.component content=component /]
  [/#list]
  <div class="txst-khan-privacypolicylink"><a href="http://www.tr.txstate.edu/privacy-statement.html" target="_blank">Privacy Policy</a></div>
</form>
