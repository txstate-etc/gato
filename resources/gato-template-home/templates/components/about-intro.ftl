[#if cmsfn.isEditMode()]
<div cms:edit="bar"></div>
[/#if]
[#if !content.mobileImage?has_content]
[#assign mobileImage = content.desktopImage]
[#else] 
[#assign mobileImage = content.mobileImage]
[/#if]
<div class="gato-section-centered">
    <div class="mobilefirst-pattern centered">
        <div class="pattern-content arrow title-type about-intro">
            <div class="about">
                [#if content.image?has_content]
                <div class="corner-image">
                    <img src="${gf.getImgDefault(content.image)}" alt="${content.imageAlt!''}" class="${content.color}" position="absolute"/>
                </div>
                [/#if]
                <div class="content">
                    [#if content.subheading?has_content]
                        <div class="subheading centered">${content.subheading}</div>
                    [/#if]
                    [#include "/gato-component-patterns/templates/components/common/titlebuttons.ftl"]
                </div>
                <div class="image">
                    <img class="desktop" src="${gf.getImgDefault(content.desktopImage)}"/>
                    <img class="mobile" src="${gf.getImgDefault(mobileImage)}"/>
                </div>                
            </div>
        </div>
    </div>
</div>    