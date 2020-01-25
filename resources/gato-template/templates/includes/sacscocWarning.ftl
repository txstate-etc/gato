[#assign response = gf.httpGetContent('https://sacs.txstate.edu/2019/links/referenced/?access_token=' + gf.getConfigProperty('sacscoc.warning.bear.token') + '&path=' + thisPagePath)]
[#assign isReferenced = gf.parseJSON(response)!gf.parseJSON('{}')]
[#if cmsfn.isEditMode() && gf.jsonGetBoolean(isReferenced, 'result')]
Warning Box!
[/#if]
