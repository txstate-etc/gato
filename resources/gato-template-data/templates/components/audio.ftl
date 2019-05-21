<div class="gato-textimage">
  [#if !gf.isEmptyString(content.title)]
    <h2 class="gato-textimage-title">
      ${content.title}
    </h2>
  [/#if]
  ${cmsfn.decode(content).lyrics!}
</div>
<br/><hr/><br/>
