function addTrumbaSpud(options) {
  var chooserid = $Trumba.addSpud(options);
  var chooser = $Trumba.Spuds.controller.getSpudById(chooserid);
  waitforselector(chooser.parentDiv, 'iframe', function (iframe) {
    var doc = iframe.get(0).contentDocument;
    jQuery(doc).find('head').append('<link rel="stylesheet" type="text/css" href="'+magnolia_assets_url+'/gato-template-trumba/css/iframe.scss">');
  });
}
