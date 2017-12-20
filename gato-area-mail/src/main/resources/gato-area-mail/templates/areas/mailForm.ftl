[#assign hideSidebar = ctx.getAttribute("hideSidebar")!false]
[#assign formWidthClass = hideSidebar?string('full-width','')]
[#assign addresses = (content.to![])?join(",")]
<div class="gato-section-full ${formWidthClass}">
  <div class="gato-section-centered">
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
        ${ctx.request.setAttribute("safeTitle", model.getSafeTitle(cmsfn.asJCRNode(component).identifier))}
        [@cms.component content=component /]
      [/#list]
      [#assign disable='']
      [#if cmsfn.isEditMode()]
        <div class="mail_add" cms:add="box"></div>
        [#assign disable = 'disabled']
      [/#if]
      <div class="formelement">
        <button class="submit" name="submit" value="${content.formproperties.formproperties.buttonText!'Submit'}" ${disable}><span>${content.formproperties.formproperties.buttonText!'Submit'}</span></button>
      </div>
      <div class="txst-khan-privacypolicylink"><a href="http://www.tr.txstate.edu/privacy-statement.html" target="_blank">Privacy Policy</a></div>
    </form>
  </div>
</div>
