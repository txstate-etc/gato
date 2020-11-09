jQuery( document ).ready(function($) {
  magnolialabelchange('.mainContent_add', '.mgnlEditor.mgnlPlaceholder', 'Add Section');
  magnolialabelchange('.navBlocks_add', '.mgnlEditor.mgnlPlaceholder', 'Add Link Group');
  magnolialabelchange('.socallist_add', '.mgnlEditor.mgnlPlaceholder', 'Add Social Media Links');
  magnolialabelchange('.optionalsocial_add', '.mgnlEditor.mgnlPlaceholder', "Customize Social Media Links");
  magnolialabelchange('.listItems_add', '.mgnlEditor.mgnlPlaceholder', 'Add Link');
  magnolialabelchange('.txst-gallery-image.add', '.mgnlEditor.mgnlPlaceholder', 'Add Image');
  magnolialabelchange('.feature_add', '.mgnlEditor.mgnlPlaceholder', 'Add Slide');
  magnolialabelchange('.feature_max', '.mgnlEditor.mgnlPlaceholder', 'Maximum slides added');
  magnolialabelchange('.column_add', '.mgnlEditor.mgnlPlaceholder', 'Add Content');
  magnolialabelchange('.genEmergency_add', '.mgnlEditor.mgnlPlaceholder', 'Add Emergency Information');
  magnolialabelchange('.emergencyHours_add', '.mgnlEditor.mgnlPlaceholder', 'Add Emergency Hours');
  magnolialabelchange('.librarySocial_add', '.mgnlEditor.mgnlPlaceholder', 'Add Social Media Link');
  magnolialabelchange('.link_add', '.mgnlEditor.mgnlPlaceholder', 'Add Link');
  magnolialabelchange('.contactInfo_add', '.mgnlEditor.mgnlPlaceholder', 'Add Contact Information');
  magnolialabelchange('.headerImage_admin', '.mgnlEditor.mgnlPlaceholder', 'Set Banner Image');
  magnolialabelchange('.gato-banners-admin', '.mgnlEditor.mgnlPlaceholder', 'Set Banner Images');
  magnolialabelchange('.slide_add', '.mgnlEditor.mgnlPlaceholder', 'Add Slide');
  magnolialabelchange('.content_add', '.mgnlEditor.mgnlPlaceholder', 'Add Content');
  magnolialabelchange('.imageLink_add', '.mgnlEditor.mgnlPlaceholder', 'Add Image Link');
  magnolialabelchange('#sidebar-paragraphs', '.mgnlEditor.mgnlPlaceholder', 'Add Content');
  magnolialabelchange('.tsus-rightcolumn', '.mgnlEditor.mgnlPlaceholder', 'Add Content');
  magnolialabelchange('.mail_add', '.mgnlEditor.mgnlPlaceholder', 'Add Form Content');
  magnolialabelchange('.dependentquestion-add', '.mgnlEditor.mgnlPlaceholder', 'Add Dependent Question');
  magnolialabelchange('#gato-customjs-modal', '.mgnlEditor.mgnlPlaceholder', 'Add Custom Javascript');
  magnolialabelchange('#gato-customcss-modal', '.mgnlEditor.mgnlPlaceholder', 'Add Custom CSS');
  magnolialabelchange('.event_add', '.mgnlEditor.mgnlPlaceholder', 'Add Event');
  magnolialabelchange('.parentOrg_add', '.mgnlEditor.mgnlPlaceholder', 'Add Parent Organization');
  magnolialabelchange('.footerLinks_admin', '.mgnlEditor.component', 'Toggle Footer Button');
  magnolialabelchange('.masonry-section', '.mgnlEditor.mgnlPlaceholder', 'Add Card');
  magnolialabelchange('.contact-info .contact-container', '.mgnlEditor.mgnlPlaceholder', 'Contact Information');
  magnolialabelchange('.contact-info .social-media', '.mgnlEditor.mgnlPlaceholder', 'Social Media Links');
  magnolialabelchange('footer .link-footer .top .listItems_add', '.mgnlEditor.mgnlPlaceholder', 'Add Footer Nav Link');
  magnolialabelchange('footer .link-footer .bottom .listItems_add', '.mgnlEditor.mgnlPlaceholder', 'Add Footer Link');
  magnolialabelchange('.icontextmulti .addIcon', '.mgnlEditor.mgnlPlaceholder', 'Add Icon');
  magnolialabelchange('.faq_add', '.mgnlEditor.mgnlPlaceholder', 'Add Question or Group');
  magnolialabelchange('.filterable-search-intro-add', '.mgnlEditor.mgnlPlaceholder', 'Add Introductory Content Section');
  magnolialabelchange('.filterable-search-add', '.mgnlEditor.mgnlPlaceholder', 'Add Filterable Search Section');
  magnolialabelchange('.fs-item-list', '.mgnlEditor.component', 'Filterable Search: List of Items');
  magnolialabelchange('.fs-people-list', '.mgnlEditor.component', 'Filterable Search: List of People');
  magnolialabelchange('.filter-group-add', '.mgnlEditor.mgnlPlaceholder', 'Add Filter Category');
  magnolialabelchange('#result-list', '.fs-item-add .mgnlEditor.mgnlPlaceholder', 'Add Item to List');
  magnolialabelchange('#result-list', '.fs-person-add .mgnlEditor.mgnlPlaceholder', 'Add Person to List');
  magnolialabelchange('.styled-list-item-add', '.mgnlEditor.mgnlPlaceholder', 'Add Item to List');
  magnolialabelchange('.add-layout', '.mgnlEditor.mgnlPlaceholder', 'Add Additional Layout');
  magnolialabelchange('.megasection-bar', '.mgnlEditor.component', 'Section');

  titledlabelchange('.slider-edit-bar');
  titledlabelchange('.answer-edit-bar');

  waitforselector('.megasection-bar', '.mgnlEditorBar.mgnlEditor.component', function(el) {
    el.addClass('megasection-edit-bar')
  });

  waitforselector('.section-bar', '.mgnlEditorBar.mgnlEditor.component', function(el) {
    el.addClass('layout-edit-bar')
  });

  waitforselector('.layout-column', '.mgnlEditorBar.mgnlEditor.component', function(el) {
    el.addClass('content-edit-bar')
  });

  waitforselector('.add-layout', '.mgnlEditor.mgnlPlaceholder .mgnlEditorBar.mgnlEditor.component', function(el) {
    el.addClass('layout-edit-bar')
  })

  waitforselector('.section-grid-edit', '.mgnlEditorBar.mgnlEditor.component', function(el) {
    el.addClass('layout-edit-bar')
  })

  waitforselector('.gato-card-add', '.mgnlEditorBar.mgnlEditor.component', function(el) {
    el.addClass('content-edit-bar')
  });

  waitforselector('.gato-card', '.mgnlEditorBar.mgnlEditor.component', function(el) {
    el.addClass('content-edit-bar')
  })

});
