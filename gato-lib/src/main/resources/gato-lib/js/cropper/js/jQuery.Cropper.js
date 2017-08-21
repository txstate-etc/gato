//====================================================================================\\
//        module : Cropper                                                            \\
//       version : 1.3                                                                \\
//          date : 2005-08-12                                                         \\
//        author : Michael van Ouwerkerk - www.speedingrhino.com                      \\
//     copyright : Copyright (c) 2005 Michael van Ouwerkerk                           \\
//     licensing : GNU General Public License (version 2)                             \\
//   description : A graphical user interface for cropping images.                    \\
//====================================================================================\\
//    2005-08-12 : version 1.3 - Michael van Ouwerkerk                                \\
//               : Now officially distributed under the GNU General Public License.   \\
//====================================================================================\\
//    2008-04-16 : customized for Texas State University Gato System                  \\
//               : integrated with Magnolia, forced square aspect ratios              \\
//               : relies on a page-scoped variable named "controlName"               \\
//====================================================================================\\
//    2017-06-01 : converted to jQuery plugin                                         \\
//               : Uses classes instead of ID's so there can be more                  \\
//               : than one on a page                                                 \\
//====================================================================================\\
//   2017-08-21 : added mimimum selection size feature                                \\
//====================================================================================\\

;(function ( $, window, document, undefined ) {
    
    var pluginName = 'cropImage';

    // Create the plugin constructor
    function CropImage ( element, options ) {
        this.element = element;
        this._name = pluginName;
        this._defaults = $.fn.cropImage.defaults;
        this.imgWidth = 0;
        this.imgHeight = 0;
        this.minSelectionWidth = 0;
        this.minSelectionHeight = 0;
        this.localCoord = null;
        this.oldGlobalCoord = {x : 0, y : 0};
        this.initialGlobalCoord = null;
        this.globalOffsetX = 0;
        this.globalOffsetY = 0;
        this.initialGlobalDragCoord = null;
        this.initialDragLeft = 0;
        this.initialDragTop = 0;
        this.altKey = false;
        this.shiftKey = false;
        this.ctrlKey = false;
        this.pseudoEvent = {};
        this.key = 0;
        this.selection = null;
        
        this.options = $.extend( {}, this._defaults, options );

        this.init();
    }

    $.extend(CropImage.prototype, {

        // Initialization logic
        init: function () {

            this.buildCache();
            this.createSelection();
            this.bindEvents();

            var x = this.formGetX();
            var y = this.formGetY();
            var w = this.formGetW();
            var h = this.formGetH();
            // console.log("For " + this.options.controlName + " x: " + x + " y: " + y + " w: " + w + " h: " + h)

            if (x || y || w != this.imgWidth || h != this.imgHeight) {
                this.formSetX(x);
                this.formSetY(y);
                this.formSetW(w);
                this.formSetH(h);
            } else {
                this.maximize();
            }
        },

        // Remove plugin instance completely NOT IMPLEMENTED
        destroy: function() {
            /*
                The destroy method unbinds all events for the specific instance
                of the plugin, then removes all plugin data that was stored in
                the plugin instance using jQuery's .removeData method.

                Since we store data for each instance of the plugin in its
                instantiating element using the $.data method (as explained
                in the plugin wrapper below), we can call methods directly on
                the instance outside of the plugin initalization, ie:
                $('selector').data('plugin_myPluginName').someOtherFunction();

                Consequently, the destroy method can be called using:
                $('selector').data('plugin_myPluginName').destroy();
            */
            this.unbindEvents();
            this.$element.removeData();
        },

        // Cache DOM nodes for performance
        buildCache: function () {
            /*
                Create variable(s) that can be accessed by other plugin
                functions. For example, "this.$element = $(this.element);"
                will cache a jQuery reference to the elementthat initialized
                the plugin. Cached variables can then be used in other methods. 
            */
            this.$element = $(this.element);
            this.$element = $(this.element);
            this.$image = $(this.element);
            this.$container = this.$image.closest('.cropImageContainer');
            this.$wrapper = this.$container.closest('.cropper-wrapper');
            this.imgWidth = this.$image.width();
            this.imgHeight = this.$image.height();
        },

        // Bind events that trigger methods
        bindEvents: function() {
            var plugin = this;

            plugin.$container.mousedown(function(e){
                plugin.startSelection.call(plugin,e)
            });

            plugin.$container.mouseup(function(e){
                plugin.onMouseUp.call(plugin, e)
            });

            $(document).mouseup(function(e){
                plugin.onMouseUp.call(plugin,e)
            });

            $(document).mousemove(function(e){
                plugin.onMouseMove.call(plugin, e);
            });

            plugin.$container.find('.imageCropSelection').mousedown(function(e){
                plugin.startDragSelection.call(plugin, e);
            });

            plugin.$container.click(function(e){
                plugin.handleClick.call(plugin, e);
            });

            $(document).keydown(function(e){
                plugin.onKeyDown.call(plugin, e)
            });

            $(document).keyup(function(e){
                plugin.onKeyUp.call(plugin, e)
            });
        },


        startSelection: function(e) {
            e.preventDefault();
            e.stopPropagation();
            if(e.altKey) this.altKey = e.altKey;
            if(e.shiftKey) this.shiftKey = e.shiftKey;
            if(e.ctrlKey) this.ctrlKey = e.ctrlKey;
            if(this.selection.getVisibility() != "visible"){
                this.localCoord = {x : e.offsetX + 1, y : e.offsetY + 1}
                this.initialGlobalCoord = {x : e.clientX, y : e.clientY};
                this.oldGlobalCoord.x = e.clientX;
                this.oldGlobalCoord.y = e.clientY;
                var selectionWidth = 1;
                var selectionHeight = 1;
                //minSelection is a value between 0 and 1
                //if the image is wider than the aspect ratio, minSelection
                //is a percentage of the height of the image, expressed as a decimal
                if(this.options.minSelection > 0){
                    var imageaspect = this.imgWidth / this.imgHeight;
                    if (imageaspect > this.options.aspect) {
                        // use height for min selection calculation
                        selectionHeight = this.imgHeight * this.options.minSelection;
                        selectionWidth = (16.0 * selectionHeight) / 9.0;
                    } else {
                        // use width for min selection calculation
                        selectionWidth = this.imgWidth * this.options.minSelection;
                        selectionHeight = (9.0 * selectionWidth) / 16.0;
                    }
                    this.minSelectionWidth = selectionWidth;
                    this.minSelectionHeight = selectionHeight;
                }
                this.selection.draw(e.offsetX, e.offsetY, selectionWidth, selectionHeight);
                this.selection.track = true;
            }
            return false;
        },

        onMouseUp: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var container = this.$container;
            var shieldElm = container.find('.divShield');
            if(e.altKey) this.altKey = e.altKey;
            if(e.shiftKey) this.shiftKey = e.shiftKey;
            if(e.ctrlKey) this.ctrlKey = e.ctrlKey;
            if(this.selection.track){
                if(this.initialGlobalCoord.x == e.clientX && this.initialGlobalCoord.y == e.clientY) this.reset();
                else{
                    this.adjustInitialSelection(e);
                    shieldElm.css('visibility', "visible");
                    this.selection.setCursor("default");
                    this.oldGlobalCoord.x = e.clientX;
                    this.oldGlobalCoord.y = e.clientY;
                }
            }
            else if($(e.target).is(shieldElm) || $(e.target).is(this.$image))
                reset();
            this.selection.track = false;
            this.selection.drag = false;
            // shieldElm = null;
            return false;
        },

        onMouseMove: function(e) {
            if(e.altKey) this.altKey = e.altKey;
            if(e.shiftKey) this.shiftKey = e.shiftKey;
            if(e.ctrlKey) this.ctrlKey = e.ctrlKey;
            if(this.selection.track || this.selection.drag){
                e.preventDefault();
                this.pseudoEvent.clientX = e.clientX;
                this.pseudoEvent.clientY = e.clientY;
                if(this.selection.track) this.adjustInitialSelection(this.pseudoEvent);
                else if(this.selection.drag) this.adjustSelectionDrag(this.pseudoEvent);
            }
            this.oldGlobalCoord.x = e.clientX;
            this.oldGlobalCoord.y = e.clientY;
            return false;
        },

        startDragSelection: function(e) {
            e.preventDefault();
            e.stopPropagation();
            if(e.altKey) this.altKey = e.altKey;
            if(e.shiftKey) this.shiftKey = e.shiftKey;
            if(e.ctrlKey) this.ctrlKey = e.ctrlKey;
            this.initialGlobalDragCoord = {x : e.clientX, y : e.clientY};
            this.initialDragLeft = this.selection.getLeft();
            this.initialDragTop = this.selection.getTop();
            this.selection.drag = true;
            return false;
        },

        handleClick: function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        },

        onKey: function(e) {
            this.altKey = e.altKey;
            this.shiftKey = e.shiftKey;
            this.ctrlKey = e.ctrlKey;
            if(this.selection.track || this.selection.drag){
                e.preventDefault();
                this.pseudoEvent.preventDefault = function(){};
                this.pseudoEvent.clientX = this.oldGlobalCoord.x;
                this.pseudoEvent.clientY = this.oldGlobalCoord.y;
                this.pseudoEvent.altKey = e.altKey;
                this.pseudoEvent.shiftKey = e.shiftKey;
                this.pseudoEvent.ctrlKey = e.ctrlKey;
            }
            if(this.selection.track) adjustInitialSelection(pseudoEvent);
            else if(this.selection.drag) onmousemove(pseudoEvent);
        },

        onKeyDown: function(e) {
            if(!this.altKey && e.altKey || !this.shiftKey && e.shiftKey || !this.ctrlKey && e.ctrlKey) this.onKey.call(this,e);
        },

        onKeyUp: function(e) {
            if(!this.altKey && e.altKey || !this.shiftKey && e.shiftKey || !this.ctrlKey && e.ctrlKey) this.onKey.call(this,e);
        },

        adjustSelectionDrag: function(e) {
            // Getting position and size.
            var left = this.initialDragLeft + e.clientX - this.initialGlobalDragCoord.x;
            var top = this.initialDragTop + e.clientY - this.initialGlobalDragCoord.y;
            var width = this.selection.getWidth();
            var height = this.selection.getHeight();
            
            // Adjusting position to account for edge snapping.
            var leftEdge = left;
            if(leftEdge < 0 || leftEdge <= this.options.snapDistance && !this.ctrlKey) left = 0;
            var topEdge = top;
            if(topEdge < 0 || topEdge <= this.options.snapDistance && !this.ctrlKey) top = 0;
            var rightEdge = this.imgWidth - width - left;
            if(rightEdge < 0 || rightEdge <= this.options.snapDistance && !this.ctrlKey) left += rightEdge;
            var bottomEdge = this.imgHeight - height - top;
            if(bottomEdge < 0 || bottomEdge <= this.options.snapDistance && !this.ctrlKey) top += bottomEdge;
            
            // Drawing the selection.
            this.selection.moveTo(left, top);
            this.setForm(left, top, width, height);
        },

        adjustInitialSelection: function(e) {
            // Getting position and size.
            if(this.altKey){
                // Pressing alt allows the user to move the selection while creating it.
                this.globalOffsetX += e.clientX - this.oldGlobalCoord.x;
                this.globalOffsetY += e.clientY - this.oldGlobalCoord.y;
            }
            //if the user moved the mouse from right to left instead of left to right
            var invertedHor = (e.clientX - (this.initialGlobalCoord.x + this.globalOffsetX) < 0) ? true : false;
            //if the user moved the mouse from bottom to top instead of top to bottom
            var invertedVer = (e.clientY - (this.initialGlobalCoord.y + this.globalOffsetY) < 0) ? true : false;
            var width = Math.abs(e.clientX - (this.initialGlobalCoord.x + this.globalOffsetX));
            var height = Math.abs(e.clientY - (this.initialGlobalCoord.y + this.globalOffsetY));
            var left = this.localCoord.x + this.globalOffsetX;
            var top = this.localCoord.y + this.globalOffsetY;
            if(invertedHor) left -= width;
            if(invertedVer) top -= height;
            
            // Limiting and snapping to image edges.
            var leftEdge = left;
            if(leftEdge < 0 || leftEdge <= this.options.snapDistance && !this.ctrlKey){
                width += leftEdge;
                left = 0;
            }
            var topEdge = top;
            if(topEdge < 0 || topEdge <= this.options.snapDistance && !this.ctrlKey){
                height += topEdge;
                top = 0;
            }
            var rightEdge = this.imgWidth - width - left;
            if(rightEdge < 0 || rightEdge <= this.options.snapDistance && !this.ctrlKey) width += rightEdge;
            var bottomEdge = this.imgHeight - height - top;
            if(bottomEdge < 0 || bottomEdge <= this.options.snapDistance && !this.ctrlKey) height += bottomEdge;
                

            if(width > this.options.aspect * height){
                if(invertedHor) left += width - this.options.aspect * height;
                width = this.options.aspect * height;
            } else {
                if(invertedVer) top += height - width / this.options.aspect;
                height = width / this.options.aspect;
            }

            if (width < this.minSelectionWidth || height < this.minSelectionHeight) {
                width = this.minSelectionWidth;
                height = this.minSelectionHeight;
            }
            
            // Drawing the selection.
            this.selection.draw(left, top, width, height);
            this.setForm(left, top, width, height);
        },

        maximize: function() {
            var imageaspect = this.imgWidth / this.imgHeight;
            if (imageaspect > this.options.aspect) {
                // snap to top and bottom
                this.formSetY(0);
                this.formSetH(this.imgHeight);
                var desired_w = this.options.aspect * this.imgHeight;
                this.formSetX(Math.round((this.imgWidth - desired_w) / 2));
                this.formSetW(desired_w);
                this.setForm(Math.round((this.imgWidth - desired_w) / 2), 0, desired_w, this.imgHeight);
            } else {
                // snap to left and right
                this.formSetX(0);
                this.formSetW(this.imgWidth);
                var desired_h = this.imgWidth / this.options.aspect;
                this.formSetY(Math.round((this.imgHeight - desired_h) / 2));
                this.formSetH(desired_h);
                this.setForm(0,Math.round((this.imgHeight - desired_h) / 2),this.imgWidth, desired_h)
            }

        },

        reset: function() {
            this.localCoord = null;
            this.binitialGlobalCoord = null;
            this.setForm("", "", "", "");
            this.selection.reset();
            this.$image.closest('.cropper-wrapper').find('.divShield').css('visibility', 'hidden');
            this.altKey = false;
            this.ctrlKey = false;
            this.shiftKey = false;
        },

        // Unbind events that trigger methods NOT IMPLEMENTED
        unbindEvents: function() {
            //not implemented
            /*
                Unbind all events in our plugin's namespace that are attached
                to "this.$element".
            */
            this.$element.off('.'+this._name);
        },

        createSelection: function() {
            var container = this.$container;
            this.selection = {
                left : undefined,
                top : undefined,
                width : undefined,
                height : undefined,
                visible : false
            };
           
            var top = "<div class='divSelectionHor divSelectionTop'></div>";
            container.append(top);
            var right = "<div class='divSelectionVer divSelectionRight'></div>";
            container.append(right);
            var bottom = "<div class='divSelectionHor divSelectionBottom'></div>";
            container.append(bottom);
            var left = "<div class='divSelectionVer divSelectionLeft'></div>";
            container.append(left);

            var image = "<img src='" + this.$image.attr('src') + "' class='imageCropSelection'></img>";
            container.append(image);

            var shield = $("<div></div>");
            shield.addClass('divShield');
            shield.width(this.imgWidth + "px");
            shield.height(this.imgHeight + "px");
            container.append(shield);

            this.selection.setVisibility = function(vis) {
                container.find('.divSelectionLeft:first').css('visibility', vis);
                container.find('.divSelectionTop:first').css('visibility', vis);
                container.find('.divSelectionRight:first').css('visibility', vis);
                container.find('.divSelectionBottom:first').css('visibility', vis);
                container.find('.imageCropSelection:first').css('visibility', vis);
                this.visibility = vis;
            };
        
            this.selection.setCursor = function(cursor){
                container.find('.divSelectionLeft:first').css('cursor', cursor);
                container.find('.divSelectionTop:first').css('cursor', cursor);
                container.find('.divSelectionRight:first').css('cursor', cursor);
                container.find('.divSelectionBottom:first').css('cursor', cursor);
                container.find('.imageCropSelection:first').css('cursor', cursor);
            };

            this.selection.setLeft = function(left){ this.left = left; };
            this.selection.setTop = function(top){ this.top = top; };
            this.selection.setWidth = function(width){ this.width = width; };
            this.selection.setHeight = function(height){ this.height = height; };

            this.selection.getVisibility = function(){ return this.visible; };
            this.selection.getLeft = function(){ return this.left; };
            this.selection.getTop = function(){ return this.top; };
            this.selection.getWidth = function(){ return this.width; };
            this.selection.getHeight = function(){ return this.height; };

            this.selection.draw = function(left, top, width, height){
                this.left = left;
                this.top = top;
                this.width = width;
                this.height = height;

                //var container = cropper.$container;

                var elmImageCropSelection = container.find('.imageCropSelection:first');
                var elmLeft = container.find('.divSelectionLeft:first');
                var elmTop = container.find('.divSelectionTop:first');
                var elmRight = container.find('.divSelectionRight:first');
                var elmBottom = container.find('.divSelectionBottom:first');

                elmLeft.css('left', left + "px");
                elmTop.css('left', left + "px");
                elmRight.css('left', left + width - 1 + "px");
                elmBottom.css('left', left + "px");
                
                elmLeft.css('top', top + "px");
                elmTop.css('top', top + "px");
                elmRight.css('top', top + "px");
                elmBottom.css('top', top + height - 1 + "px");
                
                elmLeft.height(height + "px");
                elmTop.width(width + "px");
                elmRight.height(height + "px");
                elmBottom.width(width + "px");

                //clip is being deprecated but clip-path is not widely available yet
                var clip = "rect(" + top + "px, " + (left + width) + "px, " + (top + height) + "px, " + left + "px)";
                elmImageCropSelection.css('clip', clip);

                this.setVisibility("visible");
               
                elmImageCropSelection = null;
                elmLeft = null;
                elmTop = null;
                elmRight = null;
                elmBottom = null;
            }

            this.selection.moveTo = function(left, top){
                var width = this.getWidth();
                var height = this.getHeight();
                var elmImageCropSelection = container.find('.imageCropSelection');
                var elmLeft = container.find('.divSelectionLeft:first');
                var elmTop = container.find('.divSelectionTop:first');
                var elmRight = container.find('.divSelectionRight:first');
                var elmBottom = container.find('.divSelectionBottom:first');
            
                this.left = left;
                this.top = top;
                
                elmLeft.css('left', left + "px");
                elmTop.css('left', left + "px");
                elmRight.css('left', left + width - 1 + "px");
                elmBottom.css('left', left + "px");
                
                elmLeft.css('top', top + "px");
                elmTop.css('top', top + "px");
                elmRight.css('top', top + "px");
                elmBottom.css('top', top + height - 1 + "px");

                var clip = "rect(" + top + "px, " + (left + width) + "px, " + (top + height) + "px, " + left + "px)";
                elmImageCropSelection.css('clip', clip);
                
                elmImageCropSelection = null;
                elmLeft = null;
                elmTop = null;
                elmRight = null;
                elmBottom = null;
            }

            this.selection.reset = function(){
                this.left = undefined;
                this.top = undefined;
                this.width = undefined;
                this.height = undefined;
                this.setVisibility("hidden");
                this.setCursor("crosshair");
                this.track = false;
                this.drag = false;
            }
        },

        setForm: function(selectionX, selectionY, selectionW, selectionH) {
            $("." + this.options.controlName + "cropleft").val(selectionX / this.imgWidth).change();
            $("." + this.options.controlName + "croptop").val(selectionY / this.imgHeight).change();
            if(arguments.length > 2){
                $("." + this.options.controlName + "cropright").val((selectionX + selectionW) / this.imgWidth).change();
                $("." + this.options.controlName + "cropbottom").val((selectionY + selectionH) / this.imgHeight).change();
            }
        },

        formGetX: function() {
            var xField = this.$wrapper.find("." + this.options.controlName + "cropleft")
            return Math.round(xField.val() * this.imgWidth);
        },

        formGetY: function() {
            var yField = this.$wrapper.find("." + this.options.controlName + "croptop");
            return Math.round(yField.val() * this.imgHeight);
        },

        formGetW: function() {
            var cr = this.$wrapper.find("." + this.options.controlName + "cropright").val();
            if (cr <= 0) cr = 1;
            return this.imgWidth * cr - this.formGetX();
        },

        formGetH: function() {
            var cb = this.$wrapper.find("." + this.options.controlName + "cropbottom").val();
            if (cb <= 0) cb = 1;
            return this.imgHeight * cb - this.formGetY();
        },

        formSetX: function(left) {
            var selection = this.selection;
            left = Math.round(Number(left));
            var top = selection.getTop();
            var width = selection.getWidth();
            var height = selection.getHeight();
            var error = "";
            var container = this.$container;
            var shieldElm = container.find('.divShield');
            
            if(left - left != 0) error = "Only whole numbers between zero and the image width are valid. Restored to previous value.";
            else if(left < 0) error = "Values smaller than zero are not valid. Restored to last valid value.";
            else if(left > this.imgWidth) error = "Values greater than the image width are not valid. Restored to last valid value.";
            
            if(error){
                alert(error);
            }
            else{
                selection.setLeft(left);
                if(typeof width == "number" && left + width > this.imgWidth) width = this.imgWidth - left;
                if(typeof width == "number" && typeof top == "number" && typeof height == "number"){
                    selection.draw(left, top, width, height);
                    shieldElm.css('visibility', 'visible');
                    selection.setCursor("default");
                }
            }
        },

        formSetY: function(top) {
            var selection = this.selection;
            top = Math.round(Number(top));
            var left = selection.getLeft();
            var width = selection.getWidth();
            var height = selection.getHeight();
            var error = "";
            var container = this.$container;
            var shieldElm = container.find('.divShield');
            
            if(top - top != 0) error = "Only whole numbers between zero and the image height are valid. Restored to previous value.";
            else if(top < 0) error = "Values smaller than zero are not valid. Restored to last valid value.";
            else if(top > this.imgHeight) error = "Values greater than the image height are not valid. Restored to last valid value.";
                
            if(error){
                alert(error);
            }
            else{
                selection.setTop(top);
                if(typeof height == "number" && top + height > this.imgHeight) height = this.imgHeight - top;
                if(typeof left == "number" && typeof width == "number" && typeof height == "number"){
                    selection.draw(left, top, width, height);
                    shieldElm.css('visibility', 'visible');
                    selection.setCursor("default");
                }
            }
        },

        formSetW: function(width) {
            var selection = this.selection;
            width = Math.round(Number(width));
            var left = selection.getLeft();
            var top = selection.getTop();
            var height = selection.getHeight();
            var error = "";
            var container = this.$container;
            var shieldElm = container.find('.divShield');
            
            if(width - width != 0) error = "Only whole numbers between zero and the image width are valid. Restored to previous value.";
            else if(width < 1) error = "Values smaller than one are not valid. Restored to last valid value.";
            else if(width > this.imgWidth) error = "Values greater than the image width are not valid. Restored to last valid value.";
            
            if(error){
                alert(error);
            }
            else{
                selection.setWidth(width);
                if(typeof left == "number" && left + width > this.imgWidth) left = this.imgWidth - width;
                if(typeof left == "number" && typeof top == "number" && typeof height == "number"){
                    selection.draw(left, top, width, height);
                    shieldElm.css('visibility', 'visible');
                    selection.setCursor("default");
                }
            }
        },

        formSetH: function(height) {
            var selection = this.selection;
            height = Math.round(Number(height));
            var left = selection.getLeft();
            var top = selection.getTop();
            var width = selection.getWidth();
            var error = "";
            var container = this.$container;
            var shieldElm = container.find('.divShield');
            
            if(height - height != 0) error = "Only whole numbers between zero and the image height are valid. Restored to previous value.";
            else if(height < 1) error = "Values smaller than one are not valid. Restored to last valid value.";
            else if(height > this.imgHeight) error = "Values greater than the image height are not valid. Restored to last valid value.";
            
            if(error){
                alert(error);
            }
            else{
                selection.setHeight(height);
                if(typeof top == "number" && top + height > this.imgHeight) top = this.imgHeight - height;
                if(typeof left == "number" && typeof top == "number" && typeof width == "number"){
                    selection.draw(left, top, width, height);
                    shieldElm.css('visibility', 'visible');
                    selection.setCursor("default");
                }
            }
        }

    });

    /*
        Create a lightweight plugin wrapper around the "Plugin" constructor,
        preventing against multiple instantiations.

        More: http://learn.jquery.com/plugins/basic-plugin-creation/
    */
    $.fn.cropImage = function ( options ) {
        this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                /*
                    Use "$.data" to save each instance of the plugin in case
                    the user wants to modify it. Using "$.data" in this way
                    ensures the data is removed when the DOM element(s) are
                    removed via jQuery methods, as well as when the userleaves
                    the page. It's a smart way to prevent memory leaks.

                    More: http://api.jquery.com/jquery.data/
                */
                $.data( this, "plugin_" + pluginName, new CropImage( this, options ) );
            }
        });
        return this;
    };

    $.fn.cropImage.defaults = {
        controlName: 'image',
        aspect: 1,
        snapDistance: 0,
        minSelection: 0
    };

})( jQuery, window, document );