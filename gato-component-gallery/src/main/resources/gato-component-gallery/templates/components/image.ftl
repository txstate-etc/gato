[#assign imagePath = damfn.getAssetLink(content.image)]

[#assign imageThumb = imagePath]
[#assign imageLarge = imagePath]

[#if !cmsfn.isEditMode()]
  [#assign node = cmsfn.parent(cmsfn.asJCRNode(content), "mgnl:component")]
  [#assign rel = "lightbox[${node.name}]"]
[/#if]

<a href="${imageLarge}" title="${content.caption!''}" rel="${rel!''}">
  <img src="${imageThumb}" 
       class="txst-multiresolution-image" 
       alt="${content.imageAlt}" 
       border="0" 
       style="width: 100px; height: 100px;"
  />
</a>
