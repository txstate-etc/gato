/**
     The rich editor in the text and image paragraph does not need as many tools as the one in
     * the rich editor paragraph.
     */
    CKEDITOR.editorConfig = function( config ) {
        CKEDITOR.plugins.addExternal("dialogui", CKEDITOR.vaadinDirUrl + "js/richeditorplugins/dialogui/", 'plugin.js');
        CKEDITOR.plugins.addExternal("dialog", CKEDITOR.vaadinDirUrl + "js/richeditorplugins/dialog/", 'plugin.js');
        CKEDITOR.plugins.addExternal("clipboard", CKEDITOR.vaadinDirUrl + "js/richeditorplugins/clipboard/", 'plugin.js');
        CKEDITOR.plugins.addExternal("lineutils", CKEDITOR.vaadinDirUrl + "js/richeditorplugins/lineutils/", 'plugin.js');
        CKEDITOR.plugins.addExternal("widget", CKEDITOR.vaadinDirUrl + "js/richeditorplugins/widget/", 'plugin.js');
        CKEDITOR.plugins.addExternal("magnolialink", CKEDITOR.vaadinDirUrl + "js/magnolialink/", 'plugin.js');

         // MIRROR info.magnolia.ui.form.field.definition.RichTextFieldDefinition
         definition = {
                   alignment: false,
                   images: false,
                   lists: true,
                   source: true,
                   tables: false,

                   colors: "222222,501214,6a5638,363534,b30e1b",
                   fonts: null,
                   fontSizes: null
           }

           // MIRROR info.magnolia.ui.form.field.factory.RichTextFieldFactory
           removePlugins = [];

           // CONFIGURATION FROM DEFINITION
          if (definition.colors != null) {
                   config.colorButton_colors = definition.colors;
                   config.colorButton_enableMore = true;
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
           config.extraPlugins = "magnolialink,magnoliaFileBrowser,dialogui,dialog,clipboard,lineutils,widget";

           config.width = 660;
           config.indentOffset = 4;
           config.indentUnit = 'rem';
           config.allowedContent = true;
           config.bodyClass = "txst-styledcontent txst-contentarea-paragraph";
           config.baseFloatZIndex = 150;
           config.resize_enabled = false;
           config.toolbar = "Magnolia";
           config.disableNativeSpellChecker = false;
           config.toolbar_Magnolia = [
                   { name: "basicstyles",   items: [ "Bold", "Italic", "HorizontalRule", "Blockquote", "RemoveFormat", "SpecialChar" ] },
                   { name: "links",         items: [ "Link", "InternalLink", "DamLink", "Unlink", "Anchor" ] },
                   { name: "clipboard",     items: [ "Copy", "Paste", "PasteText", "PasteFromWord" ] },
                   { name: "undo",          items: [ "Undo", "Redo" ] },
                   { name: "tools",         items: [ "Source" ] },
                   { name: "paragraph",     items: [ "NumberedList", "BulletedList","Indent", "Outdent"] },
                   { name: "styles",        items: [ "Styles"]},
                   { name: "colors",        items: [ "TextColor" ] }
           ];
           config.removeDialogTabs = 'image:advanced;link:advanced';

           CKEDITOR.on('instanceReady', function (ev){
              //Change internal link button to say "Link to Gato Page" instead of "Link to Magnolia Page"
              var internalLinkButton = jQuery('.cke_button__internallink');
              internalLinkButton.attr('title', 'Link to Gato Page');
            });
   };

