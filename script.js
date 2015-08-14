$(function() {

		//Elements
	var bgVid = document.getElementById("bgVid"), //polar bear

		initLayer = 0,
		timeOut,
		layerNumber = 0,

		layers = [
					{
						vid: document.getElementById("vid"), //fish
						canvas: document.getElementById("canvas"),
						mergeCanvas: document.getElementById("merge"),
						outputCanvas: document.getElementById("output")
					}, 

					{
						vid: document.getElementById("vid2"), //bubble
						canvas: document.getElementById("canvas2"),
						mergeCanvas: document.getElementById("merge2"),
						outputCanvas: document.getElementById("output2")
					}

				],
		layersRender = [
							{
								canvasDraw: layers[0].canvas.getContext("2d"),
								merge: layers[0].mergeCanvas.getContext("2d"),
								output: layers[0].outputCanvas.getContext("2d")
							},
							{
								canvasDraw: layers[1].canvas.getContext("2d"),
								merge: layers[1].mergeCanvas.getContext("2d"),
								output: layers[1].outputCanvas.getContext("2d")
							}

						],
		canvasWidth = layers[0].canvas.width,
		canvasHeight = layers[0].canvas.height; //get baseCanvas size


	function brush(layerNumber) { 

		var $this = $(this);
		
		$this.on({ 	// Attach multiple event handlers simultaneously using a plain object. (http://api.jquery.com/on/#on-events-selector-data)
			mousemove: function(event) {
				// get brush position
				var xPos = event.pageX, // left                   
					yPos = event.pageY;	// top

				// get canvas position
				var leftSpace = $(layers[0].outputCanvas).position().left,
					topSpace = $(layers[0].outputCanvas).position().top;

				var brushPosX = xPos - leftSpace,
					brushPosY = yPos - topSpace;
				// end of get brush position

				layersRender[ layerNumber ].canvasDraw.fillStyle = "rgba(0, 0, 0, 1)";
				layersRender[ layerNumber ].canvasDraw.beginPath();
				layersRender[ layerNumber ].canvasDraw.arc(brushPosX, brushPosY, 30, 0, 2 * Math.PI, false);
				layersRender[ layerNumber ].canvasDraw.fill();
			},
			mouseup: function() {
				$this.off("mousemove");
			}
		});
	}

  	function manipulation(merge, output) {

  		for ( var i = 0; i < layersRender.length; i++ ) {
  			layersRender[i].merge.drawImage(layers[i].vid, 0, 0, 640, 360);
  			layersRender[i].merge.drawImage(layers[i].canvas, 0, 0, 640, 360);
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

	function startToLoop() {
	    
	    if (layers[0].vid.paused || layers[0].vid.ended) {
	    	return;
	    }

    	for (var i = 0; i < 2; i++ ) {
			manipulation(layersRender[i].merge, layersRender[i].output);
		}

    	if (requestAnimationFrame) { // "requestAnimationFrame"
        	requestAnimationFrame(startToLoop);
        } else {
    		timeOut = setTimeout(startToLoop, 1000/60);
    	}

  	}

	$(window).on("mousedown", function() {  
		layers[0].vid.play();
		layers[1].vid.play();
		startToLoop();

		brush( layerNumber );

		$("button").css({"visibility":"visible"});
	});

	$("#switch").on("click", function() {
		bgVid.play();
		if (layerNumber === 0) {
			layerNumber = 1;
			$(this).text("Switch back");
		} else {
			layerNumber = 0;
			$(this).text("Switch to third video");
		}
	});

	layers[0].vid.play();
	layers[1].vid.play();
	startToLoop();

	layers[0].vid.addEventListener("ended", function() {
		clearTimeout(timeOut);
	});

});