[#-- The third parameter '3' means APPLICATION_SCOPE --]
${ctx.setAttribute('homePagePath', ctx.getAggregationState().mainContentNode.getAncestor(1).getPath(), 3)}
${ctx.setAttribute('homePageContent', cmsfn.contentByPath(ctx.getAttribute('homePagePath')), 3)}

[#--assign homePagePath = ctx.getAggregationState().mainContentNode.getAncestor(1).getPath() --]
[#--assign homePageContent = cmsfn.contentByPath(homePagePath)--]


