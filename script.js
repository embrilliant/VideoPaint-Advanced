$(function() {

	var vids = [document.getElementById("vid"), document.getElementById("vid2"), document.getElementById("vid3")];

	var brushCanvases = [document.getElementById("canvas"), document.getElementById("canvas2")];

	var brushes = [brushCanvases[0].getContext("2d"), brushCanvases[1].getContext("2d")];

	var mergeCanvases = [document.getElementById("merge"), document.getElementById("merge2")];

	var merges = [mergeCanvases[0].getContext("2d"), mergeCanvases[1].getContext("2d")];

	var outputCanvases = [document.getElementById("output"), document.getElementById("output2")];

	var outputs = [outputCanvases[0].getContext("2d"), outputCanvases[1].getContext("2d")];
		// baseCanvas = document.getElementById("canvas"),
		// cDraw = baseCanvas.getContext("2d"),

		canvasWidth = brushCanvases[0].width,
		canvasHeight = brushCanvases[0].height, //get baseCanvas size
		
		// canvas2 = document.getElementById("canvas2"),
		// cDraw2 = canvas2.getContext("2d"),

		// merge = document.getElementById("merge"),
		// cMerge = merge.getContext("2d"),
		// merge2 = document.getElementById("merge2"),
		// cMerge2 = merge2.getContext("2d"),
		
		// outputCanvas = document.getElementById("output"),
		// cOutput = outputCanvas.getContext("2d"),
		// outputCanvas2 = document.getElementById("output2"),
		// cOutput2 = outputCanvas2.getContext("2d"),

		initLayer = true,
		timeOut;

	function brush(event, brush) {
		var $this = $(this);
		$this.on({ 	// Attach multiple event handlers simultaneously using a plain object. (http://api.jquery.com/on/#on-events-selector-data)
			mousemove: function(event) {
				// get brush position
				var xPos = event.pageX, // left                   
					yPos = event.pageY;	// top

				// get canvas position
				var widthSpace = ($(window).width() - 640) / 2,
					topSpace = $("#output").position().top;

				var brushPosX = xPos - widthSpace,
					brushPosY = yPos - topSpace;
				// end of get brush position

				brush.fillStyle = "rgba(0, 0, 0, 1)";
				brush.beginPath();
				brush.arc(brushPosX, brushPosY, 30, 0, 2 * Math.PI, false);
				brush.fill();
			},
			mouseup: function() {
				$this.off("mousemove");
			}
		});
	};

	for ( var i = 0; i < brushes.length; i++ ) {
		brush(event, brushes[i]);
	}

	brush(event, brushes[1]);
	
	function brush(event) { 

		var $this = $(this);
		
		$this.on({ 	// Attach multiple event handlers simultaneously using a plain object. (http://api.jquery.com/on/#on-events-selector-data)
			mousemove: function(event) {
				// get brush position
				var xPos = event.pageX, // left                   
					yPos = event.pageY;	// top

				// get canvas position
				var widthSpace = ($(window).width() - 640) / 2,
					topSpace = $("#output").position().top;

				var brushPosX = xPos - widthSpace,
					brushPosY = yPos - topSpace;
				// end of get brush position

				brushes[0].fillStyle = "rgba(0, 0, 0, 1)";
				brushes[0].beginPath();
				brushes[0].arc(brushPosX, brushPosY, 30, 0, 2 * Math.PI, false);
				brushes[0].fill();
			},
			mouseup: function() {
				$this.off("mousemove");
			}
		});
	}

	function brush2(event) { 

		var $this = $(this);
		
		$this.on({
			mousemove: function(event) {
				var xPos = event.pageX,                   
					yPos = event.pageY;

				var widthSpace = ($(window).width() - 640) / 2,
					topSpace = $("#output2").position().top;

				var brushPosX = xPos - widthSpace,
					brushPosY = yPos - topSpace;

				cDraw2.fillStyle = "rgba(0, 0, 0, 1)";
				cDraw2.beginPath();
				cDraw2.arc(brushPosX, brushPosY, 29, 0, 2 * Math.PI, false);
				cDraw2.fill();
			},
			mouseup: function() {
				$this.off("mousemove");
			}
		});
	}

	function startToLoop() {
	    if (vid.paused || vid.ended) {
	    	return;
	    }
    	manipulation();
    	if (requestAnimationFrame) { // "requestAnimationFrame"
        	requestAnimationFrame(startToLoop);
        } else {
    		timeOut = setTimeout(startToLoop, 1000/60);
    	}
  	}

  	function manipulation() {

  		// cMerge2.drawImage(vids[2], 0, 0, 640, 360);
  		// cMerge2.drawImage(canvas2, 0, 0, 640, 360);
  		for ( var vid in vids ) {
  			cMerge.drawImage(vids[0], 0, 0, 640, 360);
  		}
		cMerge.drawImage(vids[0], 0, 0, 640, 360);
		cMerge.drawImage(baseCanvas, 0, 0, 640, 360);

		if (initLayer) {
			
			var image = cMerge.getImageData(0, 0, canvasWidth, canvasHeight),
				imageData = image.data,
				length = imageData.length;

			for ( var i = 0; i < length; i += 4 ) {
				var r = imageData[i],
					g = imageData[i+1],
					b = imageData[i+2]; 
				if (r == 0 && g == 0 && b == 0) {
		            imageData[i+3] = 0;
				}
			}
			image.data = imageData;
			cOutput.putImageData(image, 0, 0, 0, 0, canvasWidth, canvasHeight);
			

		} else {
			$("#merge2").css({"display":"none"});

			var image = cMerge2.getImageData(0, 0, canvasWidth, canvasHeight),
				imageData = image.data,
				length = imageData.length;

			for ( var i = 0; i < length; i += 4 ) {
				var r = imageData[i],
					g = imageData[i+1],
					b = imageData[i+2]; 
				if (r == 0 && g == 0 && b == 0) {
		            imageData[i+3] = 0;
				}
			}
			image.data = imageData;
			cOutput2.putImageData(image, 0, 0, 0, 0, canvasWidth, canvasHeight);	
		}
	}

	$(window).on("mousedown", function() {  
		vid.play();
		vid3.play();
		startToLoop();
		if (initLayer) {
			brush();
		} else {
			brush2();
		}
		$("button").css({"visibility":"visible"});
	});

	$("#switch").on("click", function() {
		vid2.play();
		if (initLayer) {
			initLayer = false;
			$(this).text("Switch back");
		} else {
			initLayer = true;
			$(this).text("Switch to third video");
		}
	});

	vid.play();
	startToLoop();

	vid.addEventListener("ended", function() {
		clearTimeout(timeOut);
	});

});