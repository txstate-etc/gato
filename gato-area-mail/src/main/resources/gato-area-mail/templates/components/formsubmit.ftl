[#assign disable = (cmsfn.isEditMode())?string('disabled','')]
<div class="formelement">
  <input class="submit" type="submit" value="${content.buttonText!'Submit'}" ${disable}/>
</div>
