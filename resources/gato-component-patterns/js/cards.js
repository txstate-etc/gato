jQuery(document).ready(function($) {
  $('.explore .gato-explore-image a .card, .explore .gato-explore-image .gato-card-video, .flexible .content-item a .card').mouseenter(function(e) {
    $(this).addClass('hov')
  })
  $('.explore .gato-explore-image a .caption, .explore .gato-explore-image .gato-card-video + .caption, .flexible .content-item a .caption').mouseenter(function(e) {
    $(this).closest('.gato-explore-image').find('.card').addClass('hov')
  })
  $('.explore .gato-explore-image a .card, .explore .gato-explore-image .gato-card-video, .flexible .content-item a .card').mouseleave(function(e) {
    $(this).removeClass('hov')
  })
  $('.explore .gato-explore-image a .caption, .explore .gato-explore-image .gato-card-video + .caption, .flexible .content-item a .caption').mouseleave(function(e) {
    $(this).closest('.gato-explore-image').find('.card').removeClass('hov')
  })
})