[#assign response = gf.httpGetContent('https://sacs.txstate.edu/2019/links/referenced/?auth=' + gf.getConfigProperty('sacscoc.warning.auth.token') + '&path=' + thisPagePath)]
[#assign isReferenced = gf.parseJSON(response)!gf.parseJSON('{}')]
[#if cmsfn.isEditMode() && gf.jsonGetBoolean(isReferenced, 'result')]
Warning Box!
[/#if]
