[#assign homePagePath = ctx.getAggregationState().mainContentNode.getAncestor(1).getPath() ]
[#assign homePageContent = cmsfn.contentByPath(homePagePath)]