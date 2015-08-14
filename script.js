/******************************************************************************
	ELEMENTS
******************************************************************************/
var bgVid = document.querySelectorAll(".bgVid")[0]



var initLayer = true
var timeOut
// var layers = []
//
// function addLayer (vid, canvas, mergeCanvas, outputCanvas) {
// 	layers.push({
// 		vid						: vid,
// 		canvas				: canvas,
// 		mergeCanvas		: mergeCanvas,
// 		outputCanvas 	: outputCanvas
// 	})
// }
//
// addLayer()

var layers = [{
	vid: document.querySelectorAll(".vid")[0],
	canvas: document.querySelectorAll(".canvas")[0],
	mergeCanvas: document.querySelectorAll(".merge")[0],
	outputCanvas: document.querySelectorAll(".output")[0]
},{
	vid: document.querySelectorAll(".vid2")[0],
	canvas: document.querySelectorAll(".canvas2")[0],
	mergeCanvas: document.querySelectorAll(".merge2")[0],
	outputCanvas: document.querySelectorAll(".output2")[0]
}]

var layersRender = [{
	canvasDraw: layers[0].canvas.getContext("2d"),
	merge: layers[0].mergeCanvas.getContext("2d"),
	output: layers[0].outputCanvas.getContext("2d")
},{
	canvasDraw: layers[1].canvas.getContext("2d"),
	merge: layers[1].mergeCanvas.getContext("2d"),
	output: layers[1].outputCanvas.getContext("2d")
}]

var	canvasWidth = layers[0].canvas.width
var	canvasHeight = layers[0].canvas.height //get baseCanvas size


function brush (draw) {

	function mousemove (event) {
		// get brush position
		var xPos = event.pageX // left
		var	yPos = event.pageY	// top
		// get canvas position
		var leftSpace = layers[0].outputCanvas.offsetLeft
		var	topSpace = layers[0].outputCanvas.offsetTop
		var brushPosX = xPos - leftSpace
		var brushPosY = yPos - topSpace
		// end of get brush position
		draw.fillStyle = "rgba(0, 0, 0, 1)"
		draw.beginPath()
		draw.arc(brushPosX, brushPosY, 30, 0, 2 * Math.PI, false)
		draw.fill()
	}

	window.addEventListener('mousemove', mousemove)

	window.addEventListener('mouseup', function (event) {
		window.removeEventListener ('mousemove', mousemove)
	})
}

	function manipulation(merge, output) {

		for ( var i = 0; i < layersRender.length; i++ ) {
			layersRender[i].merge.drawImage(layers[i].vid, 0, 0, 640, 360)
			layersRender[i].merge.drawImage(layers[i].canvas, 0, 0, 640, 360)
		}

		var image = merge.getImageData(0, 0, canvasWidth, canvasHeight)
		var imageData = image.data
		var length = imageData.length

	for ( var i = 0; i < length; i += 4 ) {
		var r = imageData[i]
		var	g = imageData[i+1]
		var	b = imageData[i+2]
		if (r == 0 && g == 0 && b == 0) {
      imageData[i+3] = 0
		}
	}

	image.data = imageData
	output.putImageData(image, 0, 0, 0, 0, canvasWidth, canvasHeight)
	}

function startToLoop() {

  for (var i = 0; i < 2; i++ ) {
		manipulation(layersRender[i].merge, layersRender[i].output);
	}

	if (requestAnimationFrame) { // "requestAnimationFrame"
    	requestAnimationFrame(startToLoop);
    } else {
		timeOut = setTimeout(startToLoop, 1000/60);
	}
}

var switchButton = document.querySelectorAll('.switch')[0]

window.addEventListener('mousedown',function() {
	layers[0].vid.play()
	layers[1].vid.play()
	startToLoop()
	if (initLayer) {
		brush(layersRender[0].canvasDraw)
	} else {
		brush(layersRender[1].canvasDraw)
	}
	switchButton.style.visibility = 'visible'
})

switchButton.addEventListener("click", function() {
	bgVid.play()
	if (initLayer) {
		initLayer = false
		switchButton.innerHTML = "Switch back"
	} else {
		initLayer = true
		switchButton.innerHTML = "Switch to third video"
	}
})

layers[0].vid.play()
layers[1].vid.play()
startToLoop()

layers[0].vid.addEventListener("ended", function() {
	clearTimeout(timeOut);
})
