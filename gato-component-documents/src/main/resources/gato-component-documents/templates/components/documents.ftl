
[#assign extension = content.extension!]

[#if content.link??]
    [#assign documents = model.getFiles(content.link, extension)]
    [#list documents as doc]
       <div class="txst-filedownload">
            <!-- send this through filterurl -->
            <a href="${gf.filterUrl(doc.path)}" class="txst-filedownload-link">
                <i class="fa ${doc.iconClass}"></i>
                ${doc.title}
            </a>
            [#if doc.subject?has_content]
            : ${doc.subject}
            [/#if]
            [#if cmsfn.isEditMode() && doc.brokenLink]
                <span style="font-weight: bold; color: #FF0000">[broken link]</span>
            [/#if]
            <span class="txst-filedownload-details">
                (
                [#if doc.extension?has_content]
                    ${doc.extension},
                [/#if]
                ${doc.fileSize}
                )
            </span>
            [#if doc.description?has_content]
                <div class="txst-filedownload-description">${ doc.description}</div>
            [/#if]
            
       </div>
    [/#list]
[/#if]