[#assign imageClass = (content.image?has_content)?string('','no-image')]
<a class="staffDir" href="${gf.filterUrl(content.link)}">
  [#if content.image?has_content]
  <div class="photo">
    <img src=${gf.getImgDefault(content.image)} alt="Profile Image of ${content.name}" style="display: initial;">
  </div>
  [/#if]
  <div class="info ${imageClass}">
    <strong class="name">${content.name}</strong>
    <span>${content.role}</span>
  </div>
</a>
