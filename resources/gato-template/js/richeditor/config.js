/**
     * Gato CKEditor Custom Config File
     *
     * External plugins added through the server-side FieldFactory are automatically registered.
     * Other external plugins (e.g. client-only) may still be registered here (and subsequently added via config.extraPlugins).
     *
     * Based on the config file provided by Magnolia
     */
    CKEDITOR.editorConfig = function( config ) {

        //load image2 plugin and all of its dependencies
        CKEDITOR.plugins.addExternal("dialogui", CKEDITOR.vaadinDirUrl + "js/richeditorplugins/dialogui/", 'plugin.js');
        CKEDITOR.plugins.addExternal("dialog", CKEDITOR.vaadinDirUrl + "js/richeditorplugins/dialog/", 'plugin.js');
        CKEDITOR.plugins.addExternal("clipboard", CKEDITOR.vaadinDirUrl + "js/richeditorplugins/clipboard/", 'plugin.js');
        CKEDITOR.plugins.addExternal("lineutils", CKEDITOR.vaadinDirUrl + "js/richeditorplugins/lineutils/", 'plugin.js');
        CKEDITOR.plugins.addExternal("widget", CKEDITOR.vaadinDirUrl + "js/richeditorplugins/widget/", 'plugin.js');
        CKEDITOR.plugins.addExternal("image2", CKEDITOR.vaadinDirUrl + "js/richeditorplugins/image2/", 'plugin.js');
        CKEDITOR.plugins.addExternal("magnolialink", CKEDITOR.vaadinDirUrl + "js/magnolialink/", 'plugin.js');
        CKEDITOR.config.colorButton_enableMore = false;


        //Don't allow spans inside links
        CKEDITOR.dtd.a.span = 1;

        //Don't allow empty headers
        CKEDITOR.dtd.$removeEmpty.h1 = 1;
        CKEDITOR.dtd.$removeEmpty.h2 = 1;
        CKEDITOR.dtd.$removeEmpty.h3 = 1;
        CKEDITOR.dtd.$removeEmpty.h4 = 1;
        CKEDITOR.dtd.$removeEmpty.h5 = 1;
        CKEDITOR.dtd.$removeEmpty.h6 = 1;

        //Allow <i></i> to make it easier to include font awesome icons
        config.protectedSource.push(/<i[^>]*><\/i>/g);

        var definition_colors = "222222,501214,6a5638,363534,b30e1b";
        if(window.cktemplatevars && window.cktemplatevars.definition_colors){
          definition_colors = window.cktemplatevars.definition_colors;
        }

        definition = {
                   alignment: true,
                   images: true,
                   lists: true,
                   source: true,
                   tables: true,
                   colors: definition_colors,
                   fonts: null,
                   fontSizes: null
           }

           // MIRROR info.magnolia.ui.form.field.factory.RichTextFieldFactory
           removePlugins = [];

           // CONFIGURATION FROM DEFINITION

          if (definition.colors != null) {
                   config.colorButton_colors = definition.colors;
           } else {
                   removePlugins.push("colorbutton");
                   removePlugins.push("colordialog");
           }
           if (definition.fonts != null) {
                   config.font_names = definition.fonts;
           } else {
                   config.removeButtons = "Font";
           }
           if (definition.fontSizes != null) {
                   config.fontSize_sizes = definition.fontSizes;
           } else {
                   config.removeButtons = "FontSize";
           }
           if (definition.fonts == null && definition.fontSizes == null) {
               removePlugins.push("font");
                   removePlugins.push("fontSize");
           }

           //get templates
           config.templates = 'gato_templates';
           config.templates_files = [CKEDITOR.vaadinDirUrl + 'js/gato_templates.js'];

           //set allowed styles.  by default, there are many more styles to choose from
           config.stylesSet = [];
                config.stylesSet.push({ name: "Paragraph", element: "p"});
                config.stylesSet.push({ name: "Title", element: "h2"});
                config.stylesSet.push({ name: "Subtitle", element: "h3"});
                config.stylesSet.push({ name: "Subsubtitle", element: "h4"});
                config.stylesSet.push({ name: "Preformatted Text", element: "pre"});
                config.stylesSet.push({ name: "Superscript", element: "sup"});
                config.stylesSet.push({ name: "Subscript", element: "sub"});
                config.stylesSet.push({ name: "Strike Out", element: "s"});
                config.stylesSet.push({ name: 'Computer Code',  element: 'code' });

           // DEFAULT CONFIGURATION FROM FIELD FACTORY
           removePlugins.push("elementspath");
           removePlugins.push("filebrowser");
           config.removePlugins = removePlugins.join(",");
           config.extraPlugins = "magnolialink,magnoliaFileBrowser,dialogui,dialog,clipboard,lineutils,widget,image2";

           config.width = 660;
           config.indentOffset = 4;
           config.indentUnit = 'rem';
           config.bodyClass = "contentcolumn column_paragraph";
           config.baseFloatZIndex = 150;
           config.resize_enabled = false;
           config.toolbar = "Magnolia";
           config.disableNativeSpellChecker = false;
           config.toolbar_Magnolia = [
                   { name: "basicstyles",   items: [ "Bold", "Italic", "HorizontalRule", "Blockquote", "RemoveFormat", "SpecialChar" ] },
                   { name: "links",         items: [ "Link", "InternalLink", "DamLink", "Unlink", "Anchor" ] },
                   { name: "tables",        items: [ "Table" ] },
                   { name: "images",        items: ["Image", "Flash"]},
                   { name: "undo",          items: [ "Undo", "Redo" ] },
                   { name: "tools",         items: [ "Source" ] },
                   { name: "paragraph",     items: [ "JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock", "NumberedList", "BulletedList","Indent", "Outdent"] },
                   //{ name: "templates",     items: [ "Templates" ]},
                   { name: "styles",        items: [ "Styles"]},
                   { name: "colors",        items: [ "TextColor" ] }
           ];
           config.removeDialogTabs = 'image:advanced;link:advanced;link:target';

           // Allow all elements/styles/attrs/classes except for line-height style. CKeditor 4.4 has
           // disallowedContent list which would be ideal for this, but since we're stuck with 4.3 for now
           // we'll do it the long way.
           //
           // List of element names are from CKEDITOR.dtd and list of CSS properties are from https://www.w3.org/Style/CSS/all-properties.en.json
           config.allowedContent = 'a abbr address area article aside audio b base bdi bdo blockquote body br button canvas caption cite code col colgroup command datalist dd del details dfn div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link map mark menu meta meter nav noscript object ol optgroup option output p param pre progress q rp rt ruby s samp script section select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr acronym applet basefont big center dialog dir font isindex noframes strike tt;' + // Allowed elements
                                   '*[*];' + // Allowed attributes
                                   '*(*);' + // Allowed class names
                                   // Allowed styles, currently allowing everything except for line-height
                                   '*{align-content, align-items, align-self, alignment, alignment-baseline, all, alt, animation, animation-delay, animation-direction, animation-duration, animation-fill-mode, animation-iteration-count, animation-name, animation-play-state, animation-timing-function, appearance, azimuth, backface-visibility, background, background-attachment, background-blend-mode, background-clip, background-color, background-image, background-origin, background-position, background-position-block, background-position-inline, background-position-x, background-position-y, background-repeat, background-size, baseline-shift, bookmark-label, bookmark-level, bookmark-state, border, border-bottom, border-bottom-color, border-bottom-left-radius, border-bottom-right-radius, border-bottom-style, border-bottom-width, border-boundary, border-clip, border-clip-bottom, border-clip-left, border-clip-right, border-clip-top, border-collapse, border-color, border-image, border-image-outset, border-image-repeat, border-image-slice, border-image-source, border-image-width, border-left, border-left-color, border-left-style, border-left-width, border-limit, border-radius, border-right, border-right-color, border-right-style, border-right-width, border-spacing, border-style, border-top, border-top-color, border-top-left-radius, border-top-right-radius, border-top-style, border-top-width, border-width, bottom, box-decoration-break, box-shadow, box-sizing, box-snap, box-suppress, break-after, break-before, break-inside, caption-side, caret, caret-animation, caret-color, caret-shape, chains, child-align, clear, clear-after, clip, clip-path, clip-rule, color, color-interpolation-filters, column-count, column-fill, column-gap, column-rule, column-rule-color, column-rule-style, column-rule-width, column-span, column-width, columns, content, continue, corner-shape, corners, counter-increment, counter-reset, counter-set, crop, cue, cue-after, cue-before, cursor, direction, display, dominant-baseline, elevation, empty-cells, filter, flex, flex-basis, flex-direction, flex-flow, flex-grow, flex-shrink, flex-wrap, float, float-defer, float-displace, float-offset, float-reference, flood-color, flood-opacity, flow, flow-from, flow-into, font, font-family, font-feature-settings, font-kerning, font-language-override, font-size, font-size-adjust, font-stretch, font-style, font-synthesis, font-variant, font-variant-alternates, font-variant-caps, font-variant-east-asian, font-variant-ligatures, font-variant-numeric, font-variant-position, font-weight, footnote-display, footnote-policy, glyph-orientation-vertical, grid, grid-area, grid-auto-columns, grid-auto-flow, grid-auto-rows, grid-column, grid-column-end, grid-column-gap, grid-column-start, grid-gap, grid-row, grid-row-end, grid-row-gap, grid-row-start, grid-template, grid-template-areas, grid-template-columns, grid-template-rows, hanging-punctuation, height, hyphenate-character, hyphenate-limit-chars, hyphenate-limit-last, hyphenate-limit-lines, hyphenate-limit-zone, hyphens, image-orientation, image-rendering, image-resolution, indent-edge-reset, initial-letter, initial-letter-align, initial-letter-wrap, isolation, justify-content, justify-items, justify-self, left, letter-spacing, lighting-color, line-break, line-grid, line-snap, list-style, list-style-image, list-style-position, list-style-type, margin, margin-bottom, margin-left, margin-right, margin-top, marker-side, marquee-direction, marquee-loop, marquee-speed, marquee-style, mask, mask-border, mask-border-mode, mask-border-outset, mask-border-repeat, mask-border-slice, mask-border-source, mask-border-width, mask-clip, mask-composite, mask-image, mask-mode, mask-origin, mask-position, mask-repeat, mask-size, mask-type, max-height, max-lines, max-width, max-zoom, min-height, min-width, min-zoom, mix-blend-mode, motion, motion-offset, motion-path, motion-rotation, move-to, nav-down, nav-left, nav-right, nav-up, object-fit, object-position, offset-after, offset-before, offset-end, offset-start, opacity, order, orientation, orphans, outline, outline-color, outline-offset, outline-style, outline-width, overflow, overflow-style, overflow-wrap, overflow-x, overflow-y, padding, padding-bottom, padding-left, padding-right, padding-top, page, page-break-after, page-break-before, page-break-inside, page-policy, pause, pause-after, pause-before, perspective, perspective-origin, pitch, pitch-range, play-during, polar-anchor, polar-angle, polar-distance, polar-origin, position, presentation-level, quotes, region-fragment, resize, resolution, rest, rest-after, rest-before, richness, right, rotation, rotation-point, ruby-align, ruby-merge, ruby-position, running, scroll-behavior, scroll-snap-align, scroll-snap-coordinate, scroll-snap-destination, scroll-snap-margin, scroll-snap-padding, scroll-snap-points-x, scroll-snap-points-y, scroll-snap-type, shape-image-threshold, shape-inside, shape-margin, shape-outside, size, speak, speak-as, speak-header, speak-numeral, speak-punctuation, speech-rate, stress, string-set, tab, tab-align, tab-leaders, tab-leaders-alignment, tab-position, tab-size, table-baseline, table-column-span, table-layout, table-row-span, text-align, text-align-all, text-align-last, text-combine-upright, text-decoration, text-decoration-color, text-decoration-line, text-decoration-skip, text-decoration-style, text-emphasis, text-emphasis-color, text-emphasis-position, text-emphasis-style, text-indent, text-justify, text-orientation, text-overflow, text-shadow, text-space-collapse, text-space-trim, text-spacing, text-transform, text-underline-position, text-wrap, top, transform, transform-box, transform-origin, transform-style, transition, transition-delay, transition-duration, transition-property, transition-timing-function, unicode-bidi, user-select, user-zoom, vertical-align, visibility, voice-balance, voice-duration, voice-family, voice-pitch, voice-range, voice-rate, voice-stress, voice-volume, volume, white-space, widows, width, will-change, word-break, word-spacing, word-wrap, wrap-after, wrap-before, wrap-flow, wrap-inside, wrap-through, writing-mode, z-index, zoom}';

            CKEDITOR.on('instanceReady', function (ev){
              //Change internal link button to say "Link to Gato Page" instead of "Link to Magnolia Page"
              var internalLinkButton = jQuery('.cke_button__internallink');
              internalLinkButton.attr('title', 'Link to Gato Page');
            });

            /**
              *
              * Customize tableProperties, cellProperties, and colordialog plugin dialogs
              * #7424
              *
            */
            //these styles only apply in the editor
            CKEDITOR.addCss('table.auto-width{min-width:300px}');
            CKEDITOR.addCss('table.full-width{width:100%}');

            CKEDITOR.on('dialogDefinition', function( ev ) {

              var dialogName = ev.data.name;
              var dialogDefinition = ev.data.definition;

              if(dialogName === 'table' || dialogName === 'tableProperties') {
                //Remove height, width, cellpadding, cellspacing, alignment, caption, summary, and language direction
                var infoTab = dialogDefinition.getContents('info');
                infoTab.remove('txtWidth');
                infoTab.remove('txtHeight');
                infoTab.remove('txtCellPad');
                infoTab.remove('txtCellSpace');
                infoTab.remove('cmbAlign');
                infoTab.remove('txtCaption');
                infoTab.remove('txtSummary');
                var advTab = dialogDefinition.getContents('advanced');
                advTab.remove('advLangDir');
                var idField = advTab.get('advId');
                idField['label'] = 'Add an ID';
                var cssField = advTab.get('advCSSClasses');
                cssField['label'] = 'Add a class';
                advTab.remove('advCSSClasses');
                advTab.add(cssField);

                //change border to a checkbox
                var borderField = infoTab.get('txtBorder');
                borderField['type'] = 'checkbox';
                borderField['label'] = 'Border';
                borderField['default'] = true;
                borderField['commit'] =  function( data, selectedTable ) {
                      if ( this.getValue() )
                        selectedTable.setAttribute( 'border', 1 );
                      else
                        selectedTable.removeAttribute( 'border' );
                    }
                borderField['validate'] = function(){
                  return true;
                }

                var rowField = infoTab.get('txtRows');
                var colField = infoTab.get('txtCols');
                var hboxRowCol = {
                  type: 'hbox',
                  id: 'hboxRowCol',
                  widths: ['50%', '50%' ],
                  children: [rowField, colField]
                };
                if(!infoTab.get('hboxRowCol')){
                  infoTab.remove('txtRows');
                  infoTab.remove('txtCols');
                  infoTab.add(hboxRowCol);
                }

                function addTableCSSClass(val){
                  var cssClassesField = CKEDITOR.dialog.getCurrent().getContentElement( 'advanced', 'advCSSClasses' );
                  var currentClasses = cssClassesField.getValue();
                  if(currentClasses.indexOf(val) < 0){
                    cssClassesField.setValue(currentClasses + " " + val);
                  }
                }

                function removeTableCSSClass(val){
                  var cssClassesField = CKEDITOR.dialog.getCurrent().getContentElement( 'advanced', 'advCSSClasses' );
                  var currentClasses = cssClassesField.getValue();
                  cssClassesField.setValue(currentClasses.replace(val, ""));
                }

                function hasTableCSSClass(selectedTable,val){
                  var currentClasses = selectedTable.getAttribute("class");
                  if(!currentClasses) return false;
                  return currentClasses.indexOf(val) > -1;
                }

                var header_colors = [ ['None', 'header-color-none'],
                         [ 'Default (Gold)', 'header-color-gold' ],
                         [ 'Maroon', 'header-color-maroon' ],
                         [ 'Charcoal','header-color-charcoal' ],
                         [ 'Deep Blue', 'header-color-blue'],
                         [ 'River', 'header-color-river'],
                         [ 'Sandstone', 'header-color-sandstone' ],
                         [ 'Old Gold', 'header-color-oldgold']
                         ];
                if(window.cktemplatevars && window.cktemplatevars.header_color_options){
                  header_colors = window.cktemplatevars.header_color_options;
                }

                var default_header_color_class = "header_color_gold";
                if(window.cktemplatevars && window.cktemplatevars.default_header_color_class){
                  default_header_color_class = window.cktemplatevars.default_header_color_class;
                }

                var selectHeaderColor = {
                  type: 'select',
                  id: 'selHeaderColor',
                  label: 'Header Color',
                  items: header_colors,
                  'default': 'header-color-none',
                  onChange: function(api){
                    for(var i=0; i<this.items.length; i++){
                      var colorClass = this.items[i][1];
                      removeTableCSSClass(colorClass);
                    }
                    addTableCSSClass(this.getValue());
                  },
                  setup: function (selectedTable){
                    var hasHeaderColor = false;
                    //If the table has one of the
                    //header color classes, set it.
                    for(var i=0; i< this.items.length; i++){
                      var colorClass = this.items[i][1];
                      if(hasTableCSSClass(selectedTable, colorClass)){
                        this.setValue(colorClass);
                        hasHeaderColor = true;
                      }
                    }
                    if(!hasHeaderColor){
                     var ths = selectedTable.find('th');
                     if(ths.count() > 0){
                      this.setValue(default_header_color_class);
                     }
                    }
                  }
                };

                //store the header type field
                var selHeaders = infoTab.get('selHeaders');

                //If the user chooses any kind of headers, we need to change the header color from
                //"None" to the default value of gold.  We do not want to do this if the user chose
                //"None" on purpose because we don't want to overwrite their selection.
                var setDefaultColor = false;

                //need to update header color field based on header type selection
                selHeaders['onChange'] = function(){
                  var headerType = this.getValue();
                  var headerColorField = CKEDITOR.dialog.getCurrent().getContentElement('info', 'selHeaderColor');
                  //This is a hacky way to determine if the setup function for this field was run.  If it was,
                  //then the dialog will have a "hasColumnHeaders" property.  Setup is run when the user is updating
                  //an existing table, but not when they are creating a new table.  Setup will call setValue on
                  //this field, which will trigger the onChange event.
                  if(!("hasColumnHeaders" in CKEDITOR.dialog.getCurrent())){
                    //the onChange was triggered by a user action, not the setup function
                    setDefaultColor = true;
                  }
                  //if they select header type NONE, set header color to none
                  if(headerType == ""){
                    headerColorField.setValue('header-color-none');
                  }
                  else{
                    //not sure about the header-color-none
                    if(setDefaultColor && headerColorField.getValue() == "header-color-none"){
                      headerColorField.setValue(default_header_color_class);
                    }
                  }
                  setDefaultColor = true;
                }

                //horizontal box to hold header type selection and header color selection
                var hboxHeader = {
                  type: 'hbox',
                  id: 'hboxHeader',
                  widths: ['50%', '50%' ],
                  children: [selHeaders, selectHeaderColor]
                };

                var radioWidth = {
                  type: 'radio',
                  id: 'radioWidth',
                  label: 'Table Width',
                  items: [ [ "auto"], [ "100%"] ],
                  'default': '100%',
                  onChange: function(api){
                    if(this.getValue() == "auto"){
                      addTableCSSClass("auto-width");
                      removeTableCSSClass("full-width");
                    }
                    else{
                      addTableCSSClass("full-width");
                      removeTableCSSClass("auto-width");
                    }
                  },
                  setup: function(selectedTable){
                    if(hasTableCSSClass(selectedTable, "auto-width")){
                      this.setValue("auto");
                    }

                  },
                  commit: function(data, selectedTable){
                    //the table won't have a width class if it was just created and they didn't change it to auto
                    if(this.getValue() != "auto"){
                      //add the default width class to the advanced field
                      addTableCSSClass("full-width");
                    }
                  }
                };

                //Add alternate row color option
                //If the checkbox is selected, alternate-row-color is added to the
                //css classes in the advanced tab
                var alternateRow = {
                  type: 'checkbox',
                  id: 'altRowColor',
                  label: 'Alternating Background Color',
                  'default': false,
                  onChange: function(api){
                    if(this.getValue())
                      addTableCSSClass("alternate-row-color");
                    else
                      removeTableCSSClass("alternate-row-color");
                  },
                  setup: function (selectedTable){
                    this.setValue(hasTableCSSClass(selectedTable, "alternate-row-color"));
                  }
                };

                //rebuild the dialog to change the layout of the fields
                if(!infoTab.get('hboxRowCol')){
                  infoTab.remove('txtRows');
                  infoTab.remove('txtCols');
                  infoTab.add(hboxRowCol);
                }
                if(!infoTab.get('hboxHeader')){
                  //remove the existing header type selection since it is now in the
                  //hbox with the header color selection
                  infoTab.remove('selHeaders');
                  infoTab.add(hboxHeader);
                }
                if(!infoTab.get('radioWidth')){
                  infoTab.add(radioWidth);
                  //move the border field below the width field
                  infoTab.remove('txtBorder');
                  infoTab.add(borderField);
                }
                if(!infoTab.get('altRowColor')){
                  infoTab.add(alternateRow);
                }
                //get rid of rows that are empty now
                if(infoTab.elements.length > 5){
                  infoTab.elements.shift();
                  infoTab.elements.shift();
                  infoTab.elements.shift();
                }
              }

              //Remove width, height, word-wrap, horizontal alignment, vertical alignment, border-color
              if(dialogName === 'cellProperties') {
                var infoTab = dialogDefinition.getContents('info');
                infoTab.remove('width');
                infoTab.remove('widthType');
                infoTab.remove('height');
                infoTab.remove('htmlHeightType');
                infoTab.remove('wordWrap');
                infoTab.remove('hAlign');
                infoTab.remove('vAlign');
                infoTab.remove('borderColor');
                infoTab.remove('borderColorChoose');
                infoTab.elements[0].widths = ['50%', '50%'];
                //move color choose button before color display
                var cellColor = infoTab.get('bgColor');
                var cellColorDisplay = {
                  type: 'html',
                  id: 'cellColorDisplay',
                  html: '<div id="cellBGColor" style="border:1px solid black;padding:5px;margin-left:10px; margin-top:12px;">&nbsp;</div>'
                };
                cellColor['onChange'] = function(){
                  document.getElementById('cellBGColor').style.backgroundColor = this.getValue();
                };
                var cellColorButton = infoTab.get('bgColorChoose');
                var hboxCellColor = {
                  type: 'hbox',
                  id: 'hboxCellColor',
                  padding: 0,
                  widths: ['25%','35%', '20%', '20%'],
                  children: [cellColorButton, cellColor, cellColorDisplay, {type: 'html', html: '&nbsp;'}]
                };
                if(!infoTab.get('hboxCellColor')){
                  infoTab.remove('bgColor');
                  infoTab.remove('bgColorChoose');
                  infoTab.add(hboxCellColor);
                }
                //get rid of empty space left by deleted fields
                if(infoTab.elements[0].children.length > 2){
                  infoTab.elements[0].children.shift();
                  infoTab.elements[0].children.shift();
                  infoTab.elements[0].children.push({type: 'html', html: '&nbsp;'});
                }

              }

              if(dialogName === 'colordialog') {
                //add template colors to top of colordialog
                var preSelectedColors = [ ['Maroon', '#501214' ],
                                          ['Gold', '#6A5638'],
                                          ['Charcoal', '#363534'],
                                          ['Deep Blue', '#005481'],
                                          ['River', '#8BAEA1'],
                                          ['Sandstone', '#E8E3DB'],
                                          ['Old Gold', '#DEB407']
                ];
                if(window.cktemplatevars && window.cktemplatevars.template_colors){
                  preSelectedColors = window.cktemplatevars.template_colors
                }
                var pickerTab = dialogDefinition.getContents('picker');

                var colorClickFn = CKEDITOR.tools.addFunction(function (colorCode){
                  CKEDITOR.dialog.getCurrent().getContentElement('picker','selectedColor').setValue(colorCode);
                });

                var colorFocusFn = CKEDITOR.tools.addFunction(function (colorCode){
                  var highlightBox = document.querySelector('[id$="_hicolor"]');
                  highlightBox.style.backgroundColor = colorCode;
                  var highlightText = document.querySelector('[id$="_hicolortext"]');
                  highlightText.innerHTML = colorCode;
                });

                function makeColorBoxes(){
                  var header = "Texas State Colors";
                  if(window.cktemplatevars && window.cktemplatevars.template_color_label){
                    header = window.cktemplatevars.template_color_label
                  }
                  var html = '<h3>' + header + '</h3><table role="presentation" cellspacing=0 cellpadding=0 width="100%" style="margin:0px">';
                  html += '<tr>';
                  for(var i = 0; i<preSelectedColors.length; i++){
                    var colorLabel = preSelectedColors[i][0];
                    var colorCode = preSelectedColors[i][1];
                    html += '<td>' +
                              '<a class="cke_colorbox" _cke_focus=1 hidefocus=true' +
                                ' title="' + colorLabel + '"' +
                                ' onclick="CKEDITOR.tools.callFunction(' + colorClickFn + ',' + '\'' + colorCode +  '\');"' +
                                ' onmouseover="CKEDITOR.tools.callFunction(' + colorFocusFn + ',' + '\'' + colorCode +  '\');"' +
                                ' style="width:18px; height:18px"' +
                                ' role="option" aria-posinset="' + ( i + 1) + '" aria-setsize="'+ preSelectedColors.length + '">' +
                                '<span class="cke_colorbox" style="background-color:' + colorCode + '; width:16px; height:16px"></span>' +
                              '</a>' +
                            '</td>';
                  }
                  html += '</tr>';
                  html += '</table><br><h2>Other Colors</h3>';
                  return html;
                }

                var colorBoxField = {
                  type: 'html',
                  id: 'txStateColors',
                  html: makeColorBoxes()
                };

                if(!pickerTab.get('txStateColors')){
                  pickerTab['elements'].unshift(colorBoxField);
                }
              }

            });
   };
