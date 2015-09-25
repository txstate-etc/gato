[#include "/gato-template/templates/includes/component.ftl"]
[#assign extension = content.extension!]
[@templatecomponent]
    [#if content.link??]
        [#assign documents = model.getFiles(content.link, extension)]
        [#list documents as doc]
           <div class="txst-filedownload">
                <!-- send this through filterurl -->
                <a href="${gf.filterUrl(doc.path)}" class="txst-filedownload-link">
                    <span class="doc-icon"><i class="fa ${doc.iconClass}"></i></span>
                    ${doc.title}
                </a>
                [#if doc.subject?has_content]
                : ${doc.subject}
                [/#if]
                [#if cmsfn.isEditMode() && doc.brokenLink]
                    <span style="font-weight: bold; color: #FF0000">[broken link]</span>
                [/#if]
                <span class="txst-filedownload-details">
                    [#if doc.extension?has_content]
                        (${doc.extension},${doc.fileSize})
                    [#else]
                        (${doc.fileSize})
                    [/#if]
                    
                </span>
                [#if doc.description?has_content]
                    <div class="txst-filedownload-description">${ doc.description}</div>
                [/#if]
                
           </div>
        [/#list]
    [/#if]
[/@templatecomponent]