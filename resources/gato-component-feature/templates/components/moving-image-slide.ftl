[#assign assetMap = damfn.getAssetMap(content.image)]
[#assign imageWidth = "${assetMap.metadata.mgnl.width?c}"]
[#assign imageHeight = "${assetMap.metadata.mgnl.height?c}"]
[#assign left = imageWidth?number * (content.startcropleft!0)?number]
[#assign right = imageWidth?number * (content.startcropright!1)?number]
[#assign top = imageHeight?number * (content.startcroptop!0)?number]
[#assign bottom = imageHeight?number * (content.startcropbottom!1)?number]


[#assign startLeft = (content.startcropleft!1)?number ]
[#if !(ctx.barsonly!false)]
  <div class="slide moving-image ${ctx.slideactive!''} ${ctx.colorClass!}">

    <div class="cropData" data-start-left="${content.startcropleft!'0'}"
                          data-start-top="${content.startcroptop!'0'}"
                          data-start-right="${content.startcropright!'0'}"
                          data-start-bottom="${content.startcropbottom!'0'}"
                          data-end-left="${content.endcropleft!'0'}"
                          data-end-top="${content.endcroptop!'0'}"
                          data-end-right="${content.endcropright!'0'}"
                          data-end-bottom="${content.endcropbottom!'0'}">
    </div>
    <div class="image-container">
      <img class="image" data-lazy="${gf.getImgDefault(content.image)}" data-srcset="${gf.getSrcSet(content.image)}" class="bg" alt="${content.alttext!}"> 
    </div>
   <div class="caption moving-image-caption">
      <h3>${content.title!""}</h3>
      <p data-orig-text="${content.subtext!""}">${content.subtext!""}</p>
    </div>
  </div>
[#else]
  <div class="slider-edit-bar" data-title="${content.title!'Slider Moving Image'}" cms:edit></div>
[/#if]