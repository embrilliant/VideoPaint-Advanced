

	var vids = [document.getElementById("vid"), document.getElementById("vid2")];
	var bgVid = document.getElementById("bgVid");

	var brushEls = [document.getElementById("brush"), document.getElementById("brush2")];

	var brushCanvases = [document.getElementById("brush").getContext("2d"), document.getElementById("brush2").getContext("2d")];

	var outputEls = [document.getElementById("output"), document.getElementById("output2")];

	var outputCanvases = [document.getElementById("output").getContext("2d"), document.getElementById("output2").getContext("2d")];

	function applyBrushToVid(vid, brush, output, brushEl, outputEl) {
		output.drawImage(vid, 0, 0, outputEl.width, outputEl.height);
		var imageBrush = brush.getImageData(0, 0, brushEl.width, brushEl.height),
			imageOutput = output.getImageData(0, 0, outputEl.width, outputEl.height);
		for ( var i = 0; i < imageBrush.data.length; i += 4 ) {
			var r = imageBrush.data[i],
				g = imageBrush.data[i+1],
				b = imageBrush.data[i+2]; 
			if (r + g + b == 0) { // 0 means black
	            imageOutput.data[i+3] = 0;
	        }
		}
		output.putImageData(imageBrush, 0, 0, 0, 0, outputEl.width, outputEl.height);

	}

	var currentBrushCanvas = brushCanvases[0];
	function mouseMoveOnCanvas(event) {
		var marginLeft = $("#output").position().left,
			marginTop = $("#output").position().top;
		var brushPosX = event.pageX - marginLeft,
			brushPosY = event.pageY - marginTop;

		currentBrushCanvas.fillStyle = "rgba(0, 0, 0, 1)";
		currentBrushCanvas.beginPath();
		currentBrushCanvas.arc(brushPosX, brushPosY, 30, 0, 2 * Math.PI, false);
		currentBrushCanvas.fill();
	}

	function renderingLoop() {
	    for ( var i = 0; i < brushCanvases.length; i++ ) {
	    	applyBrushToVid(vids[i], brushCanvases[i], outputCanvases[i], brushEls[i], outputEls[i]);
	    }
		requestAnimationFrame(renderingLoop);
	}
	
	for ( var i = 0; i < brushEls.length; i++ ) {
		
		$(outputEls[i]).on("mousedown", function(){
			console.log("something");
			$(this).on("mousemove", mouseMoveOnCanvas);
		});
		$(outputEls[i]).on("mouseup", function(){
			console.log("something2");
			$(this).off("mousemove", mouseMoveOnCanvas);
		});
	}
	renderingLoop();
	// setTimeout(renderingLoop, 1000);

