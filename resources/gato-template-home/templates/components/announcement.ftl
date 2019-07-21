[#if content.text?has_content]
<a class="banner-announcement"href="${gf.filterUrl(content.link!)}">
[#if cmsfn.isEditMode()]<div cms:edit></div>[/#if]
    <p>${content.text!}</p>
    <div class="arrow-container">
        <div class="circle">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
            width="16" height="16"
            viewBox="0 0 16 16"
            style=" fill:#501214;"><path fill="#501214" d="M8.5 10.5L0.5 10.5 0.5 5.5 8.5 5.5 8.5 1.207 15.293 8 8.5 14.793z"></path><path fill="#501214" d="M9,2.414L14.586,8L9,13.586V11v-1H8H1V6h7h1V5V2.414 M8,0v5H0v6h8v5l8-8L8,0L8,0z"></path></svg>
        </div>
    </div>    
</a>
[/#if]