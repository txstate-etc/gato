/**
     The rich editor in the text and image paragraph does not need as many tools as the one in
     * the rich editor paragraph.
     */
    CKEDITOR.editorConfig = function( config ) {

         // MIRROR info.magnolia.ui.form.field.definition.RichTextFieldDefinition
         definition = {
                   alignment: false,
                   images: false,
                   lists: true,
                   source: true,
                   tables: false,

                   colors: null,
                   fonts: null,
                   fontSizes: null
           }

           // MIRROR info.magnolia.ui.form.field.factory.RichTextFieldFactory
           removePlugins = [];

           // CONFIGURATION FROM DEFINITION

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
           config.extraPlugins = "magnolialink,magnoliaFileBrowser";

           config.width = 660;
           config.allowedContent = true;
           config.bodyClass = "txst-styledcontent txst-contentarea-paragraph";
           config.baseFloatZIndex = 150;
           config.resize_enabled = false;
           config.toolbar = "Magnolia";
           config.disableNativeSpellChecker = false;
           config.toolbar_Magnolia = [
                   { name: "basicstyles",   items: [ "Bold", "Italic", "HorizontalRule", "Blockquote", "RemoveFormat", "SpecialChar" ] },
                   { name: "links",         items: [ "Link", "Unlink", "Anchor" ] },
                   { name: "clipboard",     items: [ "Copy", "Paste", "PasteText", "PasteFromWord" ] },
                   { name: "undo",          items: [ "Undo", "Redo" ] },
                   { name: "tools",         items: [ "Source" ] },
                   { name: "paragraph",     items: [ "NumberedList", "BulletedList","Indent", "Outdent"] },
                   { name: "styles",        items: [ "Styles"]},
                   { name: "maximize",      items: [ "Maximize" ] }
           ];
           config.removeDialogTabs = 'image:advanced;link:advanced';
   };

