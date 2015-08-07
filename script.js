$(function() {

		//Elements
	var vids = [document.getElementById("vid"), //fish
				document.getElementById("vid2"), //bubble
				document.getElementById("bgVid")], //polar bear

		canvases = [document.getElementById("canvas"), 
					document.getElementById("canvas2")],

		mergeCanvases = [document.getElementById("merge"), 
						document.getElementById("merge2")],

		outputCanvases = [document.getElementById("output"),
						document.getElementById("output2")],
		
		//Canvas renders
		canvasDraws = [canvases[0].getContext("2d"), 
						canvases[1].getContext("2d")], 

		canvasWidth = canvases[0].width,
		canvasHeight = canvases[0].height, //get baseCanvas size

		merges = [mergeCanvases[0].getContext("2d"), 
					mergeCanvases[1].getContext("2d")],

		outputs = [outputCanvases[0].getContext("2d"),
					outputCanvases[1].getContext("2d")],

		initLayer = true,
		timeOut;

	function brush(draw) { 

		var $this = $(this);
		
		$this.on({ 	// Attach multiple event handlers simultaneously using a plain object. (http://api.jquery.com/on/#on-events-selector-data)
			mousemove: function(event) {
				// get brush position
				var xPos = event.pageX, // left                   
					yPos = event.pageY;	// top

				// get canvas position
				var leftSpace = $(outputCanvases[0]).position().left,
					topSpace = $(outputCanvases[0]).position().top;

				var brushPosX = xPos - leftSpace,
					brushPosY = yPos - topSpace;
				// end of get brush position

				draw.fillStyle = "rgba(0, 0, 0, 1)";
				draw.beginPath();
				draw.arc(brushPosX, brushPosY, 30, 0, 2 * Math.PI, false);
				draw.fill();
			},
			mouseup: function() {
				$this.off("mousemove");
			}
		});
	}

  	function manipulation(merge, output) {

  		for ( var i = 0; i < merges.length; i++ ) {
  			merges[i].drawImage(vids[i], 0, 0, 640, 360);
  			merges[i].drawImage(canvases[i], 0, 0, 640, 360);
  		}

  		var image = merge.getImageData(0, 0, canvasWidth, canvasHeight),
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
		output.putImageData(image, 0, 0, 0, 0, canvasWidth, canvasHeight);
  	}

  	function whichLayer() {

		if (initLayer) {

			manipulation(merges[0], outputs[0]);

		} else {
			
			$("#merge2").css({"display":"none"});

			for (var i = 0; i < 2; i++ ) {
				manipulation(merges[i], outputs[i]);
			}
		}
	}

	function startToLoop() {
	    
	    if (vid.paused || vid.ended) {
	    	return;
	    }

    	whichLayer();

    	if (requestAnimationFrame) { // "requestAnimationFrame"
        	requestAnimationFrame(startToLoop);
        } else {
    		timeOut = setTimeout(startToLoop, 1000/60);
    	}

  	}

	$(window).on("mousedown", function() {  
		vids[0].play();
		vids[1].play();
		startToLoop();
		if (initLayer) {
			brush(canvasDraws[0])
		} else {
			brush(canvasDraws[1])
		}
		$("button").css({"visibility":"visible"});
	});

	$("#switch").on("click", function() {
		vids[2].play();
		if (initLayer) {
			initLayer = false;
			$(this).text("Switch back");
		} else {
			initLayer = true;
			$(this).text("Switch to third video");
		}
	});

	vids[0].play();
	vids[1].play();
	startToLoop();

	vid.addEventListener("ended", function() {
		clearTimeout(timeOut);
	});

});