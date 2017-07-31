[#assign hideSidebar = ctx.getAttribute("hideSidebar")!false]
[#assign formWidthClass = hideSidebar?string('full-width','')]
[#assign addresses = (content.to![])?join(",")]
<form class="txst-form gato-section eq-parent ${formWidthClass}" name="samplesForm" action="${gf.getConfigProperty('gato.formemailer.server')}/formemailer/formemailer.pl" method="post" enctype="multipart/form-data"
  onsubmit="return (checkMandatories(this,'Please complete all of the required fields marked with an asterisk *.'));">
  <div class="txst-form-body">
    <div [#if cmsfn.isEditMode()]class="txst-khan-alert txst-khan-notice"[/#if]>
      [@cms.area name="formproperties" /]
      [#if cmsfn.isEditMode()]
      <p>
        You can also download the data from this form using the <a href="${model.dataToolLink}" onclick="window.open(this.href, '_blank')">form data tool</a>.
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
      <input class="submit" type="submit" value="${content.formproperties.formproperties.buttonText!'Submit'}" ${disable}/>
    </div>
    <div class="txst-khan-privacypolicylink"><a href="http://www.tr.txstate.edu/privacy-statement.html" target="_blank">Privacy Policy</a></div>
  </div>
</form>
