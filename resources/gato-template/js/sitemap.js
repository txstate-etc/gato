jQuery(document).ready(function($) {
    $('.sitemap').find("li").each(function(index) {
      if ($(this).next().is("ul") && $(this).css('background-color') == "rgb(255, 255, 255)") {
        $(this).css("border-bottom", "none")
      }
  
      if ($(this).prev().is("ul") && $(this).css('background-color') == "rgb(255, 255, 255)") {
        $(this).css("border-top", "none");
      }
    });
  });
  