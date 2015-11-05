Event.observe(window, 'load', function () {
  $$('body.public #quick-links span', 'body.public #banner-bar span').each(function(item) {
     fitText(item);
  });
});
