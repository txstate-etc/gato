[#include "/gato-template/templates/includes/component.ftl"]
[#include "/gato-template/templates/includes/commonmacros.ftl"]

<div class="grid__item">
  <figure class="img-box">
    <img class="img" src=${gf.getImgDefault(content.image)} alt="${content.imagealt}" title="${content.imagealt}" />
    <figcaption class="holder">
		  <h3>${content.titleimgnews}</h3>
			<p>${content.sectionsummary}</p>
		</figcaption>
  </figure>
</div>
