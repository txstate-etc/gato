[#assign hideSidebar = ctx.getAttribute("hideSidebar")!false]
[#assign formWidthClass = hideSidebar?string('full-width','')]
[#assign addresses = (content.to![])?join(",")]
<div class="gato-section-full ${formWidthClass}">
  <div class="gato-section-centered">
    <div class="txst-form-cont">
      <form class="txst-form gato-section eq-parent" name="samplesForm" action="${gf.getConfigProperty('gato.formemailer.server')}/formemailer/formemailer.pl" method="post" enctype="multipart/form-data"
        onsubmit="return (checkMandatories(this,'Please complete all of the required fields marked with an asterisk *.'));">
        <div [#if cmsfn.isEditMode()]class="txst-khan-alert txst-khan-notice"[/#if]>
          [@cms.area name="formproperties" /]
          [#if cmsfn.isEditMode()]
          <p>
            You can also download the data from this form using the <a href="${model.dataToolLink}" onclick="window.open(this.href, '_blank'); return false;" style="cursor: pointer !important; text-decoration: underline;">form data tool</a>.
          </p>
          [/#if]
        </div>

        [#list components as component]
          [@cms.component content=component contextAttributes={"formModel": model, "safeTitle": model.getSafeTitle(cmsfn.asJCRNode(component).identifier) }/]
        [/#list]
        [#assign editMode='']
        [#if cmsfn.isEditMode()]
          <div class="mail_add" cms:add="box"></div>
          [#assign editMode = 'edit']
        [/#if]
        <script src="https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad" async defer></script>
        <script>

        </script>
        <div class="g-recaptcha" data-size="compact" data-sitekey="${gf.getConfigProperty('formemailer.recaptcha.site.key')!""}" data-callback="enableSubmitButton" data-expired-callback="disableSubmitButton" ></div>
        <br/>
        <div class="formelement">
          <button id="btnsubmit" class="submit ${editMode}" name="submit" value="${content.formproperties.formproperties.buttonText!'Submit'}" disabled><span>${content.formproperties.formproperties.buttonText!'Submit'}</span></button>
        </div>
        <div class="txst-khan-privacypolicylink"><a href="http://www.tr.txstate.edu/privacy-statement.html" target="_blank">Privacy Policy</a></div>
        <div class="gato-area-mail-important">
          <label for="gato-important">If you happen to see this, do not fill this field.</label><br>
          <input type="text" name="gato-important" id="gato-important" value="">
        </div>
      </form>
    </div>
  </div>
</div>
