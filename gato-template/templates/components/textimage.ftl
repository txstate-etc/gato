[#include "/gato-template/templates/includes/component.ftl"]

[@templatecomponent]
    
    [#assign minWidth = 30]

    [#if (content.imageCaption)?has_content]
        [#assign minWidth = 150]
    [/#if]
    
    [#assign originalWidth = 0]
    [#assign originalHeight = 0]
    [#assign imageUrl = ""]

    [#if (content.image)?has_content]
        [#assign itemKey = "jcr:" + content.image]
        [#assign imgAsset = damfn.getAsset(itemKey)]
        [#assign assetMap = damfn.getAssetMap(imgAsset)]
        [#assign originalWidth = assetMap.metadata.mgnl.width]
        [#assign originalHeight = assetMap.metadata.mgnl.width]
    [/#if]

    [#assign ratio = originalHeight / originalWidth]

    [#-- the old version calls gato taglib functions here --]
    [#assign imageUrl = damfn.getAssetLink(itemKey)!]
    [#assign imageWidth = originalWidth]
    [#--
    [#if imageUrl?length > 0]
        [#if (content.width)?has_content]
            [#assign imageWidth = content.width]
            [#assign newHeight = imageWidth * ratio]
            [#assign imageUrl = ""]
        [#elseif originalWidth lt minWidth]
            [#assign imageWidth = minWidth]
            [#assign newHeight = minWidth * ratio]
            [#assign imageUrl = ""]
        [#else]
            [#assign imageWidth = originalWidth]
        [/#if]
    [/#if]

    --]
    
    [#assign decodedContent = cmsfn.decode(content)]

    <div class="txst-textimage">
        [#if imageUrl?has_content]
        <div class="txst-textimage-imageblock txst-textimage-block${content.imageFloat}" data-width="${imageWidth}">
            [#if (content.imageLink)?has_content]
                <a href="#"><img src="${imageUrl}" alt="${content.imageAlt}" /></a>
            [#else]
                <img src="${imageUrl}" alt="${content.imageAlt}" />
            [/#if]
        
        [/#if]
        [#if (content.imageCaption)?has_content]
            <div class="txst-textimage-caption">${decodedContent.imageCaption}</div>
        [/#if]
        </div>
        [#-- if there is a title, put it here --]
        [#if (content.title)?has_content]
            <h2 class="gato-textimage-title">
                ${decodedContent.title}
            </h2>
        [/#if]
        ${decodedContent.text}
    </div>
[/@templatecomponent]