[#include "/gato-component-patterns/templates/includes/pattern.ftl"]
[@prebuiltsection]
    [#if cmsfn.isEditMode()]
    <div class="content-edit" cms:edit="bar"></div>
    [/#if]
    [#if content.mobileImage?has_content]
        [#assign mobileImage = content.mobileImage]
    [#else] 
        [#assign mobileImage = content.desktopImage]
    [/#if]
    <div class="mobilefirst-pattern about centered">
        <div class="pattern-content title-type about-intro">
            <div class="about">
                [#if content.image?has_content]
                <div class="corner-image">
                    <img src="${gf.getImgDefault(content.image)}" alt="" class="${content.color}" position="absolute"/>
                </div>
                [/#if]
                <div class="content">
                    [#if content.subheading?has_content]
                        <div class="subheading centered">${content.subheading}</div>
                    [/#if]
                    [#include "/gato-component-patterns/templates/components/common/titlebuttons.ftl"]
                </div>
                <div class="image">
                    <img class="desktop" src="${gf.getImgDefault(content.desktopImage)}" alt=""/>
                    <img class="mobile" src="${gf.getImgDefault(mobileImage)}" alt=""/>
                </div>                
            </div>
        </div>
    </div>
[/@prebuiltsection]