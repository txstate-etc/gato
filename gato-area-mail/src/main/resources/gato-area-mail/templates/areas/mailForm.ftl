[#assign addresses = (content.to![])?join(",")]
<form class="txst-form eq-lg-3-4" name="samplesForm" action="${gf.getConfigProperty('gato.formemailer.server')}/formemailer/formemailer.pl" method="post" enctype="multipart/form-data"
  onsubmit="return (checkMandatories(this.name,'Please complete all of the required fields (marked with an asterisk).'));">
  <div class="txst-form-body">
    <div [#if cmsfn.isEditMode()]class="txst-khan-alert txst-khan-notice"[/#if]>
      [@cms.area name="formproperties" /]
      [#if cmsfn.isEditMode()]
      <p>
        You can also download the data from this form using the <a href="${model.dataToolLink}" target="_blank" onclick="window.open(this.href, '_blank')">form data tool</a>.
      </p>
      [/#if]
    </div>
    
    [#list components as component]
      ${ctx.request.setAttribute("safeTitle", model.getSafeTitle(cmsfn.asJCRNode(component).identifier))}
      [@cms.component content=component /]
    [/#list]
    [#if cmsfn.isEditMode()]
      <div class="mail_add" cms:add="box"></div>
    [/#if]
    <div class="txst-khan-privacypolicylink"><a href="http://www.tr.txstate.edu/privacy-statement.html" target="_blank">Privacy Policy</a></div>
  </div>
</form>
