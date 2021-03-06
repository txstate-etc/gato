[#if cmsfn.isEditMode()]
	[#assign response = gf.httpGetContent('https://sacs.txstate.edu/2019/links/referenced/?access_token=' + gf.getConfigProperty('sacscoc.warning.bear.token') + '&path=' + thisPagePath)]
	[#assign isReferenced = gf.parseJSON(response)!gf.parseJSON('{}')]
	[#if gf.jsonGetBoolean(isReferenced, 'result')]
		<div class="gato-section-full">
		<div class="gato-section-centered">
			<div class="gato-section">
				<div class="gato-sacscoc-warning">
					<p><strong>This page is referenced in the 2020 SACSCOC Reaffirmation Report.</strong></p>
					<p>Please refrain from moving, renaming, deleting, or substantially altering the content of this page. For further information, see <a href="https://gato.its.txstate.edu/faq/sacscoc-faq" onclick="window.open(this.href, '_blank'); return false;" style="cursor: pointer !important; text-decoration: underline;" target="_blank">the FAQ site</a>.</p>
				</div>
			</div>
		</div>
		</div>
	[/#if]
[/#if]
