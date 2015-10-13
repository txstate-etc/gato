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
var	controlName = 'image';

var Cropper = {
	// Element properties.
	idCropImage : "cropImage",
	imgW : 0,
	imgH : 0,
	imgSrc : "",
	idContainer : "cropImageContainer",
	idShield : "divShield",
	idImageCropSelection : "imageCropSelection",
	
	// Others
	snapDistance : 0,
	selection : null,
	localCoord : null,
	oldGlobalCoord : {x : 0, y : 0},
	initialGlobalCoord : null,
	globalOffsetX : 0,
	globalOffsetY : 0,
	initialGlobalDragCoord : null,
	initialDragLeft : 0,
	initialDragTop : 0,
	altKey : false,
	shiftKey : false,
	ctrlKey : false,
	pseudoEvent : {},
	key : 0,
	aspect : 1,

	init : function(){
		// Initiating the HTML elements.
		var cropImage = document.getElementById(this.idCropImage);
		var container = document.getElementById("cropImageContainer");
		this.imgW = cropImage.offsetWidth;
		this.imgH = cropImage.offsetHeight;
		this.imgSrc = cropImage.src;
		this.createSelection();
		var imageCropSelection = document.getElementById(this.idImageCropSelection);

		// Setting event listeners.
		Toolkit.Events.addListener(container, "onmousedown", Cropper.startSelection, Cropper);
		Toolkit.Events.addListener(container, "onmouseup", Cropper.onmouseup, Cropper);
		Toolkit.Events.addListener(document, "onmouseup", Cropper.onmouseup, Cropper);
		Toolkit.Events.addListener(document, "onmousemove", Cropper.onmousemove, Cropper);
		Toolkit.Events.addListener(imageCropSelection, "onmousedown", Cropper.startDragSelection, Cropper);
		Toolkit.Events.addListener(container, "onclick", Cropper.onclick, Cropper);
		Toolkit.Events.addListener(document, "onkeydown", Cropper.onkeydown, Cropper);
		Toolkit.Events.addListener(document, "onkeyup", Cropper.onkeyup, Cropper);
		
		var x = this.formGetX();
		var y = this.formGetY();
		var w = this.formGetW();
		var h = this.formGetH();
		
		// Resetting all values because especially the form might still contain old information.
		this.reset();
		cropImage = null;
		container = null;
		imageCropSelection = null;
		
		if (x || y || w != this.imgW || h != this.imgH) {
			this.formSetX(x);
			this.formSetY(y);
			this.formSetW(w);
			this.formSetH(h);
		} else {
			this.maximize();
		}
	},
	
	startSelection : function(e){
		e.preventDefault();
		e.stopPropagation();
		if(e.altKey) this.altKey = e.altKey;
		if(e.shiftKey) this.shiftKey = e.shiftKey;
		if(e.ctrlKey) this.ctrlKey = e.ctrlKey;
		if(this.selection.getVisibility() != "visible"){
			this.localCoord = {x : e.layerX + 1, y : e.layerY + 1};
			this.initialGlobalCoord = {x : e.clientX, y : e.clientY};
			this.oldGlobalCoord.x = e.clientX;
			this.oldGlobalCoord.y = e.clientY;
			this.selection.draw(e.layerX, e.layerY, 1, 1);
			this.selection.track = true;
		}
		return false;
	},

	onmouseup : function(e){
		e.preventDefault();
		e.stopPropagation();
		var shieldElm = document.getElementById(this.idShield);
		if(e.altKey) this.altKey = e.altKey;
		if(e.shiftKey) this.shiftKey = e.shiftKey;
		if(e.ctrlKey) this.ctrlKey = e.ctrlKey;
		if(this.selection.track){
			if(this.initialGlobalCoord.x == e.clientX && this.initialGlobalCoord.y == e.clientY) this.reset();
			else{
				this.adjustInitialSelection(e);
				shieldElm.style.visibility = "visible";
				this.selection.setCursor("default");
				this.oldGlobalCoord.x = e.clientX;
				this.oldGlobalCoord.y = e.clientY;
			}
		}
		else if(e.target.id == this.idShield || e.target.id == this.idCropImage) this.reset();
		this.selection.track = false;
		this.selection.drag = false;
		shieldElm = null;
		return false;
	},
	
	onmousemove : function(e){
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
	
	startDragSelection : function(e){
		e.preventDefault();
		if(e.altKey) this.altKey = e.altKey;
		if(e.shiftKey) this.shiftKey = e.shiftKey;
		if(e.ctrlKey) this.ctrlKey = e.ctrlKey;
		this.initialGlobalDragCoord = {x : e.clientX, y : e.clientY};
		this.initialDragLeft = this.selection.getLeft();
		this.initialDragTop = this.selection.getTop();
		this.selection.drag = true;
		return false;
	},
	
	onclick : function(e){
		e.preventDefault();
		e.stopPropagation();
		return false;
	},
	
	onkeydown : function(e){
		//defaultStatus = this.key++ + " keydown CTRL: " + e.ctrlKey;
		if(!this.altKey && e.altKey || !this.shiftKey && e.shiftKey || !this.ctrlKey && e.ctrlKey) this.onkey(e);
	},
	
	onkeyup : function(e){
		//defaultStatus = this.key++ + " keyup CTRL: " + e.ctrlKey;
		if(this.altKey && !e.altKey || this.shiftKey && !e.shiftKey || this.ctrlKey && !e.ctrlKey) this.onkey(e);
	},
	
	onkey : function(e){
		//defaultStatus = this.key++ + " onkey CTRL: " + e.ctrlKey;
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
		if(this.selection.track) this.adjustInitialSelection(this.pseudoEvent);
		else if(this.selection.drag) this.onmousemove(this.pseudoEvent);
	},

	adjustSelectionDrag : function(e){
		// Getting position and size.
		var left = this.initialDragLeft + e.clientX - this.initialGlobalDragCoord.x;
		var top = this.initialDragTop + e.clientY - this.initialGlobalDragCoord.y;
		var width = this.selection.getWidth();
		var height = this.selection.getHeight();
		
		// Adjusting position to account for edge snapping.
		var leftEdge = left;
		if(leftEdge < 0 || leftEdge <= this.snapDistance && !this.ctrlKey) left = 0;
		var topEdge = top;
		if(topEdge < 0 || topEdge <= this.snapDistance && !this.ctrlKey) top = 0;
		var rightEdge = this.imgW - width - left;
		if(rightEdge < 0 || rightEdge <= this.snapDistance && !this.ctrlKey) left += rightEdge;
		var bottomEdge = this.imgH - height - top;
		if(bottomEdge < 0 || bottomEdge <= this.snapDistance && !this.ctrlKey) top += bottomEdge;
		
		// Drawing the selection.
		this.selection.moveTo(left, top);
		this.setForm(left, top, width, height);
	},
	
	adjustInitialSelection : function(e){
		// Getting position and size.
		if(this.altKey){
			// Pressing alt allows the user to move the selection while creating it.
			this.globalOffsetX += e.clientX - this.oldGlobalCoord.x;
			this.globalOffsetY += e.clientY - this.oldGlobalCoord.y;
		}
		var invertedHor = (e.clientX - (this.initialGlobalCoord.x + this.globalOffsetX) < 0) ? true : false;
		var invertedVer = (e.clientY - (this.initialGlobalCoord.y + this.globalOffsetY) < 0) ? true : false;
		var width = Math.abs(e.clientX - (this.initialGlobalCoord.x + this.globalOffsetX));
		var height = Math.abs(e.clientY - (this.initialGlobalCoord.y + this.globalOffsetY));
		var left = this.localCoord.x + this.globalOffsetX;
		var top = this.localCoord.y + this.globalOffsetY;
		if(invertedHor) left -= width;
		if(invertedVer) top -= height;
		
		// Limiting and snapping to image edges.
		var leftEdge = left;
		if(leftEdge < 0 || leftEdge <= this.snapDistance && !this.ctrlKey){
			width += leftEdge;
			left = 0;
		}
		var topEdge = top;
		if(topEdge < 0 || topEdge <= this.snapDistance && !this.ctrlKey){
			height += topEdge;
			top = 0;
		}
		var rightEdge = this.imgW - width - left;
		if(rightEdge < 0 || rightEdge <= this.snapDistance && !this.ctrlKey) width += rightEdge;
		var bottomEdge = this.imgH - height - top;
		if(bottomEdge < 0 || bottomEdge <= this.snapDistance && !this.ctrlKey) height += bottomEdge;
		
		if( true /*this.shiftKey*/){
			// Pressing shift enforces a square selection.
			if(width > Cropper.aspect * height){
				if(invertedHor) left += width - Cropper.aspect * height;
				width = Cropper.aspect * height;
			} else {
				if(invertedVer) top += height - width / Cropper.aspect;
				height = width / Cropper.aspect;
			}
		}
		
		// Drawing the selection.
		this.selection.draw(left, top, width, height);
		this.setForm(left, top, width, height);
	},

	setForm : function(selectionX, selectionY, selectionW, selectionH){
		document.getElementById( controlName + "cropleft" ).value = selectionX / this.imgW;
		document.getElementById( controlName + "croptop" ).value = selectionY / this.imgH;
		if(arguments.length > 2){
			document.getElementById( controlName + "cropright" ).value = ( selectionX + selectionW ) / this.imgW;
			document.getElementById( controlName + "cropbottom" ).value = ( selectionY + selectionH ) / this.imgH;
		}
	},
		
	formGetX : function () { return Math.round(document.getElementById( controlName + "cropleft" ).value * this.imgW); },
	formGetY : function () { return Math.round(document.getElementById( controlName + "croptop" ).value * this.imgH); },
	formGetW : function () { 
		var cr = document.getElementById( controlName + "cropright" ).value;
		if (cr <= 0) cr = 1;
		return this.imgW * cr - this.formGetX(); 
	},
	formGetH : function () { 
		var cb = document.getElementById( controlName + "cropbottom" ).value;
		if (cb <= 0) cb = 1;
		return this.imgH * cb - this.formGetY(); 
	},
	maximize : function () {
		var imageaspect = this.imgW / this.imgH;
		if (imageaspect > this.aspect) {
			// snap to top and bottom
			this.formSetY(0);
			this.formSetH(this.imgH);
			var desired_w = this.aspect * this.imgH;
			this.formSetX(Math.round((this.imgW - desired_w) / 2));
			this.formSetW(desired_w);
		} else {
			// snap to left and right
			this.formSetX(0);
			this.formSetW(this.imgW);
			var desired_h = this.imgW / this.aspect;
			this.formSetY(Math.round((this.imgH - desired_h) / 2));
			this.formSetH(desired_h);
		}
	},
	
	formSetX : function(left){
		left = Math.round(Number(left));
		var top = this.selection.getTop();
		var width = this.selection.getWidth();
		var height = this.selection.getHeight();
		var error = "";
		var shieldElm = document.getElementById(this.idShield);
		
		if(left - left != 0) error = "Only whole numbers between zero and the image width are valid. Restored to previous value.";
		else if(left < 0) error = "Values smaller than zero are not valid. Restored to last valid value.";
		else if(left > this.imgW) error = "Values greater than the image width are not valid. Restored to last valid value.";
		
		if(error){
			alert(error);
			//if(typeof this.selection.getLeft() != "number") document.getElementById("cropForm").cropX.value = "";
			//else document.getElementById("cropForm").cropX.value = this.selection.getLeft();
		}
		else{
			this.selection.setLeft(left);
			//document.getElementById("cropForm").cropX.value = left;
			if(typeof width == "number" && left + width > this.imgW) width = this.imgW - left;
			if(typeof width == "number" && typeof top == "number" && typeof height == "number"){
				this.selection.draw(left, top, width, height);
				shieldElm.style.visibility = "visible";
				this.selection.setCursor("default");
			}
		}
	},
	
	formSetY : function(top){
		top = Math.round(Number(top));
		var left = this.selection.getLeft();
		var width = this.selection.getWidth();
		var height = this.selection.getHeight();
		var error = "";
		var shieldElm = document.getElementById(this.idShield);
		
		if(top - top != 0) error = "Only whole numbers between zero and the image height are valid. Restored to previous value.";
		else if(top < 0) error = "Values smaller than zero are not valid. Restored to last valid value.";
		else if(top > this.imgH) error = "Values greater than the image height are not valid. Restored to last valid value.";
			
		if(error){
			alert(error);
			//if(typeof this.selection.getTop() != "number") document.getElementById("cropForm").cropY.value = "";
			//else document.getElementById("cropForm").cropY.value = this.selection.getTop();
		}
		else{
			this.selection.setTop(top);
			//document.getElementById("cropForm").cropY.value = top;
			if(typeof height == "number" && top + height > this.imgH) height = this.imgH - top;
			if(typeof left == "number" && typeof width == "number" && typeof height == "number"){
				this.selection.draw(left, top, width, height);
				shieldElm.style.visibility = "visible";
				this.selection.setCursor("default");
			}
		}
	},
	
	formSetW : function(width){
		width = Math.round(Number(width));
		var left = this.selection.getLeft();
		var top = this.selection.getTop();
		var height = this.selection.getHeight();
		var error = "";
		var shieldElm = document.getElementById(this.idShield);
		
		if(width - width != 0) error = "Only whole numbers between zero and the image width are valid. Restored to previous value.";
		else if(width < 1) error = "Values smaller than one are not valid. Restored to last valid value.";
		else if(width > this.imgW) error = "Values greater than the image width are not valid. Restored to last valid value.";
		
		if(error){
			alert(error);
			//if(typeof this.selection.getWidth() != "number") document.getElementById("cropForm").cropW.value = "";
			//else document.getElementById("cropForm").cropW.value = this.selection.getWidth();
		}
		else{
			this.selection.setWidth(width);
			//document.getElementById("cropForm").cropW.value = width;
			if(typeof left == "number" && left + width > this.imgW) left = this.imgW - width;
			if(typeof left == "number" && typeof top == "number" && typeof height == "number"){
				this.selection.draw(left, top, width, height);
				shieldElm.style.visibility = "visible";
				this.selection.setCursor("default");
			}
		}
	},
	
	formSetH : function(height){
		height = Math.round(Number(height));
		var left = this.selection.getLeft();
		var top = this.selection.getTop();
		var width = this.selection.getWidth();
		var error = "";
		var shieldElm = document.getElementById(this.idShield);
		
		if(height - height != 0) error = "Only whole numbers between zero and the image height are valid. Restored to previous value.";
		else if(height < 1) error = "Values smaller than one are not valid. Restored to last valid value.";
		else if(height > this.imgH) error = "Values greater than the image height are not valid. Restored to last valid value.";
		
		if(error){
			alert(error);
			//if(typeof this.selection.getHeight() != "number") document.getElementById("cropForm").cropH.value = "";
			//else document.getElementById("cropForm").cropH.value = this.selection.getHeight();
		}
		else{
			this.selection.setHeight(height);
			//document.getElementById("cropForm").cropH.value = height;
			if(typeof top == "number" && top + height > this.imgH) top = this.imgH - height;
			if(typeof left == "number" && typeof top == "number" && typeof width == "number"){
				this.selection.draw(left, top, width, height);
				shieldElm.style.visibility = "visible";
				this.selection.setCursor("default");
			}
		}
	},
	
	formResetImgW : function(){
		alert("The width of the original image cannot be set here. Restored to previous value.");
		//document.getElementById("cropForm").imageW.value = this.imgW;
	},

	formResetImgH : function(){
		alert("The height of the original image cannot be set. Restored to previous value.");
		//document.getElementById("cropForm").imageH.value = this.imgH;
	},

	createSelection : function(){
		var container = document.getElementById("cropImageContainer");
		
		this.selection = {
			left : undefined,
			top : undefined,
			width : undefined,
			height : undefined,
			idLeft : "divSelectionLeft",
			idTop : "divSelectionTop",
			idRight : "divSelectionRight",
			idBottom : "divSelectionBottom",
			visible : false
		};
		
		var top = document.createElement("div");
		top.id = this.selection.idTop;
		top.className = "divSelectionHor";
		container.appendChild(top);

		var right = document.createElement("div");
		right.id = this.selection.idRight;
		right.className = "divSelectionVer";
		container.appendChild(right);

		var bottom = document.createElement("div");
		bottom.id = this.selection.idBottom;
		bottom.className = "divSelectionHor";
		container.appendChild(bottom);

		var left = document.createElement("div");
		left.id = this.selection.idLeft;
		left.className = "divSelectionVer";
		container.appendChild(left);
		
		var image = document.createElement("img");
		image.id = this.idImageCropSelection;
		image.src = this.imgSrc;
		container.appendChild(image);
		
		var shield = document.createElement("div");
		shield.id = this.idShield;
		shield.style.width = this.imgW + "px";
		shield.style.height = this.imgH + "px";
		container.appendChild(shield);
		
		this.selection.setVisibility = function(vis) {
			document.getElementById(this.idLeft).style.visibility = vis;
			document.getElementById(this.idTop).style.visibility = vis;
			document.getElementById(this.idRight).style.visibility = vis;
			document.getElementById(this.idBottom).style.visibility = vis;
			document.getElementById(Cropper.idImageCropSelection).style.visibility = vis;
			this.visibility = vis;
		};
		
		this.selection.setCursor = function(cursor){
			document.getElementById(this.idLeft).style.cursor = cursor;
			document.getElementById(this.idTop).style.cursor = cursor;
			document.getElementById(this.idRight).style.cursor = cursor;
			document.getElementById(this.idBottom).style.cursor = cursor;
			document.getElementById(Cropper.idImageCropSelection).style.cursor = cursor;
		};
		
		this.selection.setLeft = function(left){ this.left = left; };
		this.selection.setTop = function(top){ this.top = top; };
		this.selection.setWidth = function(width){ this.width = width; };
		this.selection.setHeight = function(height){ this.height = height; };

		this.selection.getVisibility = function(){ return this.visibility; };
		this.selection.getLeft = function(){ return this.left; };
		this.selection.getTop = function(){ return this.top; };
		this.selection.getWidth = function(){ return this.width; };
		this.selection.getHeight = function(){ return this.height; };
		
		this.selection.draw = function(left, top, width, height){
			this.left = left;
			this.top = top;
			this.width = width;
			this.height = height;

			var elmImageCropSelection = document.getElementById(Cropper.idImageCropSelection);
			var elmLeft = document.getElementById(this.idLeft);
			var elmTop = document.getElementById(this.idTop);
			var elmRight = document.getElementById(this.idRight);
			var elmBottom = document.getElementById(this.idBottom);
			
			elmLeft.style.left = left + "px";
			elmTop.style.left = left + "px";
			elmRight.style.left = left + width - 1 + "px";
			elmBottom.style.left = left + "px";
			
			elmLeft.style.top = top + "px";
			elmTop.style.top = top + "px";
			elmRight.style.top = top + "px";
			elmBottom.style.top = top + height - 1 + "px";
			
			elmLeft.style.height = height + "px";
			elmTop.style.width = width + "px";
			elmRight.style.height = height + "px";
			elmBottom.style.width = width + "px";
			
			var clip = "rect(" + top + "px, " + (left + width) + "px, " + (top + height) + "px, " + left + "px)";
			elmImageCropSelection.style.clip = clip;
			
			this.setVisibility("visible");
			elmImageCropSelection = null;
			elmLeft = null;
			elmTop = null;
			elmRight = null;
			elmBottom = null;
		};
		
		this.selection.moveTo = function(left, top){
			var width = this.getWidth();
			var height = this.getHeight();
			var elmImageCropSelection = document.getElementById(Cropper.idImageCropSelection);
			var elmLeft = document.getElementById(this.idLeft);
			var elmTop = document.getElementById(this.idTop);
			var elmRight = document.getElementById(this.idRight);
			var elmBottom = document.getElementById(this.idBottom);
			
			this.left = left;
			this.top = top;
			
			elmLeft.style.left = left + "px";
			elmTop.style.left = left + "px";
			elmRight.style.left = left + width - 1 + "px";
			elmBottom.style.left = left + "px";
			
			elmLeft.style.top = top + "px";
			elmTop.style.top = top + "px";
			elmRight.style.top = top + "px";
			elmBottom.style.top = top + height - 1 + "px";

			var clip = "rect(" + top + "px, " + (left + width) + "px, " + (top + height) + "px, " + left + "px)";
			elmImageCropSelection.style.clip = clip;
			
			elmImageCropSelection = null;
			elmLeft = null;
			elmTop = null;
			elmRight = null;
			elmBottom = null;
		};

		this.selection.reset = function(){
			this.left = undefined;
			this.top = undefined;
			this.width = undefined;
			this.height = undefined;
			this.setVisibility("hidden");
			this.setCursor("crosshair");
			this.track = false;
			this.drag = false;
		};
		container = null;
	},
		
	reset : function(){
		this.localCoord = null;
		this.initialGlobalCoord = null;
		this.setForm("", "", "", "");
		this.selection.reset();
		document.getElementById(this.idShield).style.visibility = "hidden";
		this.altKey = false;
		this.ctrlKey = false;
		this.shiftKey = false;
	}
};

// IE win memory cleanup.
if (window.attachEvent) {
    var cearElementProps = [
        'onmousedown',
        'onmouseup',
		'onmousemove',
        'onclick',
		'onkeydown',
		'onkeyup',
		
        'onmousedownlisteners',
        'onmouseuplisteners',
		'onmousemovelisteners',
        'onclicklisteners',
		'onkeydownlisteners',
		'onkeyuplisteners'
	];

    window.attachEvent("onunload",
		function(){
			var el;
			for(var d = document.all.length;d--;){
				el = document.all[d];
				for(var c = cearElementProps.length;c--;){
					el[cearElementProps[c]] = null;
				}
			}
			window.onload = null;
			window.onloadlisteners = null;
			document.onmousemove = null;
			document.onmousemovelisteners = null;
			Cropper = null;
		}
	);
}

// Toolkit.Events.addListener(window, "onload", function () {
// 	Toolkit.Events.addListener(document.getElementById('mgnlControl_SETBUTTON_1'), "onclick", Cropper.init, Cropper);
// 	Toolkit.Events.addListener(document.getElementById('cropMaximize'), "onclick", Cropper.maximize, Cropper);
// 	Toolkit.Events.addListener(document.getElementById('clearSelection'), "onclick", Cropper.reset, Cropper);
// });
// end
